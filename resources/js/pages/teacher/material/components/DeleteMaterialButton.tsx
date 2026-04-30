import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import DeleteMaterialModal from './DeleteMaterialModal';

interface DeleteMaterialButtonProps {
    materialId: number;
    materialTitle: string;
}

export default function DeleteMaterialButton({
    materialId,
    materialTitle,
}: DeleteMaterialButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
            >
                <Trash2 size={16} className="mr-1" />
                Hapus
            </Button>

            {isOpen && (
                <DeleteMaterialModal
                    materialId={materialId}
                    materialTitle={materialTitle}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
