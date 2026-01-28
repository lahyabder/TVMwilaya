'use client';

import { deleteAllocation } from '@/actions/allocation';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

export default function DeleteAllocationButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this allocation? This action can be audited.")) {
            startTransition(async () => {
                await deleteAllocation(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition disabled:opacity-50"
            title="Delete"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
