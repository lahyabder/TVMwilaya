'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function getExpenses(branchId?: string) {
    try {
        const where = branchId ? { branchId } : {};
        const expenses = await prisma.expense.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                branch: true,
                user: true
            }
        });
        return { success: true, data: expenses };
    } catch (error) {
        console.error("Failed to fetch expenses:", error);
        return { success: false, error: "Failed to fetch expenses" };
    }
}

export async function createExpense(formData: FormData) {
    const session = await getServerSession(authOptions);
    // Fallback for dev/testing if no session, but in prod we should enforce it.
    // For now, if no session, we might fail or mock.
    // Let's assume there is a session or we can pass a userId temporarily if needed for testing?
    // Actually, user explicitly asked to "create user accounts... and test".
    // So we should rely on session.

    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const branchId = formData.get('branchId') as string;

    // If user is Manager, branchId should come from their profile ideally, 
    // but we can allow selecting if Admin, or auto-fill if Manager.
    // For simplicity, we just take it from form for now (hidden input or select).

    if (!amount || !description || !category || !branchId) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.expense.create({
            data: {
                amount,
                description,
                category,
                branchId,
                userId: session.user.id as string, // Ensure next-auth types are picked up
                status: 'PENDING'
            }
        });
        revalidatePath('/admin/expenses');
        return { success: true };
    } catch (error) {
        console.error("Failed to create expense:", error);
        return { success: false, error: "Failed to create expense" };
    }
}

export async function updateExpenseStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    try {
        const expense = await prisma.expense.findUnique({ where: { id } });
        if (!expense) return { success: false, error: "Expense not found" };

        if (expense.status === status) return { success: true }; // No change

        // Logic:
        // PENDING -> APPROVED: Decrement Balance
        // APPROVED -> REJECTED: Increment Balance (Refund)
        // REJECTED -> APPROVED: Decrement Balance
        // PENDING -> REJECTED: No change

        let balanceChange = 0;

        if (status === 'APPROVED') {
            // We are approving
            balanceChange = -expense.amount;
        } else if (status === 'REJECTED' && expense.status === 'APPROVED') {
            // We are rejecting previously approved expense
            balanceChange = expense.amount;
        }

        if (balanceChange !== 0) {
            await prisma.$transaction([
                prisma.expense.update({
                    where: { id },
                    data: { status }
                }),
                prisma.branch.update({
                    where: { id: expense.branchId },
                    data: { balance: { increment: balanceChange } }
                })
            ]);
        } else {
            // Just update status
            await prisma.expense.update({
                where: { id },
                data: { status }
            });
        }

        revalidatePath('/admin/expenses');
        return { success: true };
    } catch (error) {
        console.error("Failed to update expense status:", error);
        return { success: false, error: "Failed to update expense status" };
    }
}

export async function getBranchBalance(branchId: string) {
    // 1. Sum Allocations
    const allocations = await prisma.allocation.aggregate({
        where: { branchId },
        _sum: { amount: true }
    });

    // 2. Sum Approved Expenses
    const expenses = await prisma.expense.aggregate({
        where: { branchId, status: 'APPROVED' },
        _sum: { amount: true }
    });

    const totalAllocated = allocations._sum.amount || 0;
    const totalSpent = expenses._sum.amount || 0;

    return {
        allocated: totalAllocated,
        spent: totalSpent,
        balance: totalAllocated - totalSpent
    };
}
