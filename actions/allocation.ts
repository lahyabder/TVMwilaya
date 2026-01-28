'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAllocations() {
    try {
        const allocations = await prisma.allocation.findMany({
            orderBy: { date: 'desc' },
            include: {
                branch: true
            }
        });
        return { success: true, data: allocations };
    } catch (error) {
        console.error("Failed to fetch allocations:", error);
        return { success: false, error: "Failed to fetch allocations" };
    }
}

export async function createAllocation(formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const branchId = formData.get('branchId') as string;
    const reference = formData.get('reference') as string;
    const notes = formData.get('notes') as string;

    if (!amount || !branchId || !reference) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.$transaction([
            prisma.allocation.create({
                data: {
                    amount,
                    branchId,
                    reference,
                    notes,
                    date: new Date(),
                }
            }),
            prisma.branch.update({
                where: { id: branchId },
                data: {
                    balance: { increment: amount }
                }
            })
        ]);
        revalidatePath('/admin/allocations');
        return { success: true };
    } catch (error) {
        console.error("Failed to create allocation:", error);
        return { success: false, error: "Failed to create allocation" };
    }
}

export async function getAllocation(id: string) {
    try {
        const allocation = await prisma.allocation.findUnique({
            where: { id },
            include: { branch: true }
        });
        return { success: true, data: allocation };
    } catch (error) {
        return { success: false, error: "Failed to fetch allocation" };
    }
}

export async function updateAllocation(id: string, formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const branchId = formData.get('branchId') as string;
    const reference = formData.get('reference') as string;
    const notes = formData.get('notes') as string;

    try {
        // First get the old allocation to calculate difference
        const oldAllocation = await prisma.allocation.findUnique({
            where: { id }
        });

        if (!oldAllocation) {
            return { success: false, error: "Allocation not found" };
        }

        const difference = amount - oldAllocation.amount;

        // If branch changed, we need simpler logic: decrement old branch, increment new branch
        // For now let's assume branch doesn't change often, or handle it:
        if (oldAllocation.branchId !== branchId) {
            await prisma.$transaction([
                prisma.allocation.update({
                    where: { id },
                    data: { amount, branchId, reference, notes }
                }),
                prisma.branch.update({
                    where: { id: oldAllocation.branchId },
                    data: { balance: { decrement: oldAllocation.amount } }
                }),
                prisma.branch.update({
                    where: { id: branchId },
                    data: { balance: { increment: amount } }
                })
            ]);
        } else {
            // Same branch, just update diff
            await prisma.$transaction([
                prisma.allocation.update({
                    where: { id },
                    data: { amount, branchId, reference, notes }
                }),
                prisma.branch.update({
                    where: { id: branchId },
                    data: { balance: { increment: difference } }
                })
            ]);
        }

        revalidatePath('/admin/allocations');
        return { success: true };
    } catch (error) {
        console.error("Failed to update allocation:", error);
        return { success: false, error: "Failed to update allocation" };
    }
}
