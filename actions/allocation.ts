'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createAuditLog } from './audit';

export async function getAllocations() {
    try {
        const allocations = await prisma.allocation.findMany({
            where: { deletedAt: null },
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
        const result = await prisma.$transaction(async (tx) => {
            const allocation = await tx.allocation.create({
                data: {
                    amount,
                    branchId,
                    reference,
                    notes,
                    date: new Date(),
                }
            });

            await tx.branch.update({
                where: { id: branchId },
                data: {
                    balance: { increment: amount }
                }
            });

            return allocation;
        });

        // Audit Log (Non-blocking)
        createAuditLog('Allocation', result.id, 'CREATE', { amount, branchId, reference }, 'Initial Creation');

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
        await prisma.$transaction(async (tx) => {
            const oldAllocation = await tx.allocation.findUnique({
                where: { id }
            });

            if (!oldAllocation) throw new Error("Allocation not found");

            const difference = amount - oldAllocation.amount;

            await tx.allocation.update({
                where: { id },
                data: { amount, branchId, reference, notes }
            });

            if (oldAllocation.branchId !== branchId) {
                await tx.branch.update({
                    where: { id: oldAllocation.branchId },
                    data: { balance: { decrement: oldAllocation.amount } }
                });
                await tx.branch.update({
                    where: { id: branchId },
                    data: { balance: { increment: amount } }
                });
            } else {
                await tx.branch.update({
                    where: { id: branchId },
                    data: { balance: { increment: difference } }
                });
            }
        });

        // Audit Log
        createAuditLog('Allocation', id, 'UPDATE', { amount, branchId, reference }, 'Updated details');

        revalidatePath('/admin/allocations');
        return { success: true };
    } catch (error) {
        console.error("Failed to update allocation:", error);
        return { success: false, error: "Failed to update allocation" };
    }
}

export async function deleteAllocation(id: string) {
    try {
        await prisma.$transaction(async (tx) => {
            const allocation = await tx.allocation.findUnique({
                where: { id }
            });

            if (!allocation) throw new Error("Allocation not found");

            // Soft Delete
            await tx.allocation.update({
                where: { id },
                data: { deletedAt: new Date() }
            });

            // Revert Balance
            await tx.branch.update({
                where: { id: allocation.branchId },
                data: { balance: { decrement: allocation.amount } }
            });
        });

        createAuditLog('Allocation', id, 'SOFT_DELETE', null, 'Soft deleted allocation');
        revalidatePath('/admin/allocations');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete allocation:", error);
        return { success: false, error: "Failed to delete allocation" };
    }
}
