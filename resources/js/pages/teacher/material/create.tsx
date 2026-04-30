import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { store } from '@/routes/teacher/materials';
import MaterialFormStepper from './MaterialFormStepper';
import type { Classroom, MaterialOption } from './MaterialFormStepper';

interface CreateMaterialProps {
    classrooms: Classroom[];
    ownMaterials: MaterialOption[];
}

export default function CreateMaterial({
    classrooms,
    ownMaterials,
}: CreateMaterialProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback((formData: MaterialFormData) => {
        setIsSubmitting(true);

        router.post(store.url(), formData as any, {
            forceFormData: true,
            onSuccess: async () => {
                // Show success alert
                await Swal.fire({
                    icon: 'success',
                    title: 'Material Berhasil Dibuat!',
                    text: 'Material Anda telah disimpan dan siap digunakan.',
                    confirmButtonColor: '#3b82f6',
                });
            },
            onError: (errors) => {
                const message =
                    Object.values(errors).flat()[0] ||
                    'Gagal menyimpan material. Silakan coba lagi.';

                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: message,
                    confirmButtonColor: '#ef4444',
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    }, []);

    return (
        <>
            <Head title="Buat Material - Teacher" />

            <div className="min-h-screen bg-gray-100 py-8">
                <MaterialFormStepper
                    mode="create"
                    classrooms={classrooms}
                    prerequisites={ownMaterials}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </>
    );
}
