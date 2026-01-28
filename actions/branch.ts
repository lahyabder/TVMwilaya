'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getBranches() {
    try {
        const branches = await prisma.branch.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });
        return { success: true, data: branches };
    } catch (error) {
        console.error("Failed to fetch branches:", error);
        return { success: false, error: "Failed to fetch branches" };
    }
}

export async function createBranch(formData: FormData) {
    const name = formData.get('name') as string;
    const wilaya = formData.get('wilaya') as string;

    // New detailed contact fields
    const contactName = formData.get('contactName') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const contactWhatsapp = formData.get('contactWhatsapp') as string;

    if (!name || !wilaya) {
        return { success: false, error: "Name and Wilaya are required" };
    }

    try {
        await prisma.branch.create({
            data: {
                name,
                wilaya,
                contactName,
                contactPhone,
                contactEmail,
                contactWhatsapp,
            }
        });
        revalidatePath('/admin/branches');
        return { success: true };
    } catch (error) {
        console.error("Failed to create branch:", error);
        return { success: false, error: "Failed to create branch" };
    }
}

export async function getBranch(id: string) {
    try {
        const branch = await prisma.branch.findUnique({
            where: { id }
        });
        return { success: true, data: branch };
    } catch (error) {
        return { success: false, error: "Failed to fetch branch" };
    }
}

export async function updateBranch(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const wilaya = formData.get('wilaya') as string;
    const contactName = formData.get('contactName') as string;
    const contactPhone = formData.get('contactPhone') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const contactWhatsapp = formData.get('contactWhatsapp') as string;

    try {
        await prisma.branch.update({
            where: { id },
            data: {
                name,
                wilaya,
                contactName,
                contactPhone,
                contactEmail,
                contactWhatsapp
            }
        });
        revalidatePath('/admin/branches');
        return { success: true };
    } catch (error) {
        console.error("Failed to update branch:", error);
        return { success: false, error: "Failed to update branch" };
    }
}

export async function deleteBranch(id: string) {
    try {
        await prisma.branch.delete({
            where: { id }
        });
        revalidatePath('/admin/branches');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete branch:", error);
        return { success: false, error: "Failed to delete branch" };
    }
}
