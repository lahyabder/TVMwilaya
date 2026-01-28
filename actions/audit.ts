'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function createAuditLog(
    entity: string,
    entityId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE',
    details?: any,
    reason?: string
) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        console.warn("Audit Log Warning: No user session found for action", action);
        // We might still want to log it if it's a system action, or throw error.
        // For now, let's skip or log with 'SYSTEM' if we had a system user. 
        // But since userId is required in schema, we need a valid ID.
        // If this is a protected action, session should exist.
        return;
    }

    try {
        await prisma.auditLog.create({
            data: {
                entity,
                entityId,
                action,
                userId,
                details: details ? JSON.stringify(details) : null,
                reason
            }
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // Don't fail the main transaction just because audit log failed? 
        // Or strictly enforce it? For financial systems, strict is better, 
        // but since we are calling this *inside* or *after* actions, 
        // we need to be careful about transaction scope.
        // ideally this should be part of the same transaction.
    }
}
