import { router } from '@inertiajs/react';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { destroy } from '@/routes/teacher/materials';

interface DeleteMaterialModalProps {
    materialId: number;
    materialTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteMaterialModal({
    materialId,
    materialTitle,
    isOpen,
    onClose,
}: DeleteMaterialModalProps) {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) {
        return null;
    }

    const isConfirmed = confirmText === materialTitle;

    const handleDelete = async () => {
        if (!isConfirmed) {
            return;
        }

        setIsDeleting(true);

        router.delete(destroy.url(materialId), {
            onSuccess: async () => {
                // Show success alert
                await Swal.fire({
                    icon: 'success',
                    title: 'Material Berhasil Dihapus!',
                    text: 'Material dan semua data terkaitnya telah dihapus dari sistem.',
                    confirmButtonColor: '#3b82f6',
                });

                // Close modal
                onClose();
            },
            onError: (errors) => {
                const message =
                    Object.values(errors).flat()[0] ||
                    'Gagal menghapus material. Silakan coba lagi.';

                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: message,
                    confirmButtonColor: '#ef4444',
                });
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        // Backdrop
        <div
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="mx-4 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Red Header */}
                <div className="flex items-center justify-between bg-red-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={24} className="text-white" />
                        <h3 className="text-lg font-bold text-white">
                            Hapus Material Pembelajaran?
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-red-100 transition-colors hover:text-white"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 px-6 py-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                            <span className="font-semibold">Perhatian!</span>{' '}
                            Menghapus material akan menghapus:
                        </p>
                        <ul className="mt-2 ml-4 space-y-1 text-sm text-red-700">
                            <li>• Semua kelompok dan anggota kelompok</li>
                            <li>• Progress dan refleksi siswa</li>
                            <li>• Submission dan feedback</li>
                            <li>• Nilai dan kehadiran</li>
                            <li>• File materi (PDF)</li>
                        </ul>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-semibold text-gray-700">
                            Material yang akan dihapus:
                        </p>
                        <p className="rounded bg-gray-100 p-3 text-lg font-bold text-gray-900">
                            {materialTitle}
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Ketik judul material di bawah untuk konfirmasi:
                        </label>
                        <Input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={`Ketik: ${materialTitle}`}
                            className="text-sm"
                            disabled={isDeleting}
                        />
                        {confirmText && !isConfirmed && (
                            <p className="mt-1 text-xs text-red-600">
                                ❌ Teks tidak sesuai dengan judul material
                            </p>
                        )}
                        {isConfirmed && (
                            <p className="mt-1 text-xs text-green-600">
                                ✓ Teks sesuai. Siap untuk menghapus.
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={isDeleting}
                        className="text-gray-700"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={!isConfirmed || isDeleting}
                        className="bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {isDeleting ? 'Menghapus...' : 'Hapus Material'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
