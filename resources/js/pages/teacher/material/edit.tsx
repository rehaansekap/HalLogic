import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { update } from '@/routes/teacher/materials';
import MaterialFormStepper from './MaterialFormStepper';
import type { Classroom, MaterialOption } from './MaterialFormStepper';

interface EditMaterialProps {
    material: {
        id: number;
        classroom_id: number;
        title: string;
        slug: string;
        description: string;
        difficulty_level: number;
        video_url: string;
        case_narrative: string;
        material_pdf: string | null;
        prerequisite_material_id: number | null;
        started_at: string | null;
        finished_at: string | null;
    };
    classrooms: Classroom[];
    ownMaterials: MaterialOption[];
}

export default function EditMaterial({
    material,
    classrooms,
    ownMaterials,
}: EditMaterialProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialMaterial: Partial<MaterialFormData> = {
        classroom_id: material.classroom_id,
        title: material.title,
        description: material.description,
        difficulty_level: material.difficulty_level,
        video_url: material.video_url,
        case_narrative: material.case_narrative,
        prerequisite_material_id: material.prerequisite_material_id,
        started_at: material.started_at,
        finished_at: material.finished_at,
        material_pdf_existing: material.material_pdf || undefined,
    };

    const handleSubmit = useCallback(
        (formData: MaterialFormData) => {
            setIsSubmitting(true);

            router.post(
                update.url(material.id),
                formData as any,
                {
                    forceFormData: true,
                    onSuccess: async () => {
                        // Show success alert
                        await Swal.fire({
                            icon: 'success',
                            title: 'Material Berhasil Diperbarui!',
                            text: 'Perubahan material Anda telah disimpan.',
                            confirmButtonColor: '#3b82f6',
                        });
                    },
                    onError: (errors) => {
                        const message =
                            Object.values(errors).flat()[0] ||
                            'Gagal memperbarui material. Silakan coba lagi.';

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
                },
            );
        },
        [material.id],
    );

    return (
        <>
            <Head title={`Edit Material - ${material.title}`} />

            <div className="min-h-screen bg-gray-100 py-8">
                <MaterialFormStepper
                    mode="edit"
                    classrooms={classrooms}
                    prerequisites={ownMaterials}
                    initialMaterial={initialMaterial}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </>
    );
}
