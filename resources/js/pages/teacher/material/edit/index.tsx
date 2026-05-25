import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import PageHeader from '@/components/custom/layout/PageHeader';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { update } from '@/routes/teacher/materials';

import type {
    Classroom,
    MaterialOption,
} from '../components/MaterialFormStepper';
import MaterialFormStepper from '../components/MaterialFormStepper';

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
        summary?: string | null;
        learning_objectives?: string[] | null;
    };
    classrooms: Classroom[];
    ownMaterials: MaterialOption[];
    user: {
        name: string;
    };
}

export default function EditMaterial({
    material,
    classrooms,
    ownMaterials,
    user,
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
        summary: material.summary || '',
        learning_objectives: material.learning_objectives || [''],
    };

    const handleSubmit = useCallback(
        (formData: MaterialFormData) => {
            setIsSubmitting(true);

            router.post(update.url(material.id), formData as any, {
                forceFormData: true,
                onSuccess: async () => {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Material Berhasil Diperbarui!',
                        text: 'Perubahan material Anda telah disimpan.',
                        confirmButtonColor: '#10b981', // --palette-green
                        customClass: {
                            popup: 'rounded-3xl border-none shadow-2xl',
                            confirmButton:
                                'rounded-xl px-8 py-3 font-bold uppercase tracking-wider transition-transform hover:scale-105 active:scale-95',
                        },
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
                        customClass: {
                            popup: 'rounded-3xl border-none shadow-2xl',
                            confirmButton:
                                'rounded-xl px-8 py-3 font-bold uppercase tracking-wider transition-transform hover:scale-105 active:scale-95',
                        },
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        },
        [material.id],
    );

    return (
        <>
            <Head title={`Edit Material - ${material.title}`} />

            <motion.div
                className="space-y-8 p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <PageHeader
                    title="Perbarui Material"
                    subtitle={`Mengedit konten untuk: ${material.title}`}
                    icon={<Edit3 className="h-6 w-6" />}
                    role="teacher"
                    userName={user.name}
                />

                <div className="mx-auto max-w-5xl">
                    <MaterialFormStepper
                        mode="edit"
                        classrooms={classrooms}
                        prerequisites={ownMaterials}
                        initialMaterial={initialMaterial}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </motion.div>
        </>
    );
}
