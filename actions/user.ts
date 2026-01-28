'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcryptjs';

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                branch: true
            }
        });
        return { success: true, data: users };
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function createUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const branchId = formData.get('branchId') as string;

    if (!name || !email || !password || !role) {
        return { success: false, error: "Missing required fields" };
    }

    // Role validation
    if (!['ADMIN_FINANCE', 'BRANCH_MANAGER'].includes(role)) {
        return { success: false, error: "Invalid role" };
    }

    // Branch validation for Managers
    if (role === 'BRANCH_MANAGER' && !branchId) {
        return { success: false, error: "Branch is required for Managers" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                branchId: (role === 'BRANCH_MANAGER' && branchId) ? branchId : null,
            }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { success: false, error: "Failed to create user (Email might be duplicate)" };
    }
}

export async function getUser(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { branch: true }
        });
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: "Failed to fetch user" };
    }
}

export async function updateUser(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const branchId = formData.get('branchId') as string;
    const password = formData.get('password') as string;

    try {
        const data: any = {
            name,
            email,
            role,
            branchId: (role === 'BRANCH_MANAGER' && branchId) ? branchId : null,
        };

        if (password && password.trim() !== '') {
            data.password = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({
            where: { id },
            data
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { success: false, error: "Failed to update user" };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({ where: { id } });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}
