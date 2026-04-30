import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { destroy } from '@/routes/teacher/materials';

interface DeleteMaterialButtonProps {
    materialId: number;
    materialTitle: string;
    variant?: 'default' | 'dropdown';
}

export default function DeleteMaterialButton({
    materialId,
    materialTitle,
    variant = 'default',
}: DeleteMaterialButtonProps) {
    const handleDelete = (e: any) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        Swal.fire({
            title: 'Hapus Material?',
            html: `
                <div class="text-left space-y-4">
                    <p class="text-sm text-gray-600 leading-relaxed">
                        Apakah Anda yakin ingin menghapus <b>"${materialTitle}"</b>? 
                        Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                    </p>
                    <div class="p-3 bg-red-50 rounded-lg border border-red-100 mb-4">
                        <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Peringatan Kritis:</p>
                        <ul class="text-[10px] text-red-700/70 space-y-0.5">
                            <li>• Menghapus kelompok & refleksi siswa</li>
                            <li>• Menghapus submission & nilai</li>
                            <li>• Menghapus file materi terkait</li>
                        </ul>
                    </div>
                    <p class="text-xs font-bold text-gray-700 mb-2 uppercase tracking-tight">Ketik judul material untuk konfirmasi:</p>
                </div>
            `,
            input: 'text',
            inputPlaceholder: materialTitle,
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Hapus Permanen',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            background: '#ffffff',
            customClass: {
                popup: 'rounded-2xl border-2 border-red-50 shadow-2xl p-6',
                title: 'text-2xl font-bold text-gray-900 pt-2',
                htmlContainer: 'text-gray-600',
                input: 'h-12 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 text-sm font-semibold mt-2',
                confirmButton: 'rounded-xl px-8 py-3 font-bold text-sm shadow-lg shadow-red-200 order-2',
                cancelButton: 'rounded-xl px-8 py-3 font-bold text-sm text-gray-500 hover:bg-gray-100 order-1',
            },
            preConfirm: (value) => {
                if (value !== materialTitle) {
                    Swal.showValidationMessage(`Judul tidak sesuai!`);
                    return false;
                }
                return true;
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(destroy.url(materialId), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Terhapus!',
                            text: 'Material telah berhasil dihapus.',
                            timer: 2000,
                            showConfirmButton: false,
                            background: '#ffffff',
                            customClass: {
                                popup: 'rounded-2xl border-2 border-green-50 shadow-xl',
                                title: 'text-xl font-bold text-green-600',
                                htmlContainer: 'text-sm text-gray-600',
                            },
                        });
                    },
                    onError: (errors) => {
                        const message =
                            Object.values(errors).flat()[0] ||
                            'Gagal menghapus material. Silakan coba lagi.';
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops!',
                            text: message,
                            confirmButtonColor: '#ef4444',
                            background: '#ffffff',
                            customClass: {
                                popup: 'rounded-2xl border-2 border-red-50 shadow-xl',
                                title: 'text-xl font-bold text-red-600',
                            },
                        });
                    },
                });
            }
        });
    };


    if (variant === 'dropdown') {
        return (
            <DropdownMenuItem
                onSelect={handleDelete}
                className="flex items-center gap-3 cursor-pointer py-3 px-4 rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors"
            >
                <Trash2 className="h-4 w-4" />
                <span className="font-semibold">Hapus Material</span>
            </DropdownMenuItem>
        );
    }

    return (
        <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="bg-red-600 font-bold hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-red-200"
        >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
        </Button>
    );
}
