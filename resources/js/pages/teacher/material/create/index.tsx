import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import PageHeader from '@/components/custom/layout/PageHeader';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { store } from '@/routes/teacher/materials';

import type {
    Classroom,
    MaterialOption,
} from '../components/MaterialFormStepper';
import MaterialFormStepper from '../components/MaterialFormStepper';

interface CreateMaterialProps {
    classrooms: Classroom[];
    ownMaterials: MaterialOption[];
    user: {
        name: string;
    };
}

export default function CreateMaterial({
    classrooms,
    ownMaterials,
    user,
}: CreateMaterialProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback((formData: MaterialFormData) => {
        setIsSubmitting(true);

        router.post(store.url(), formData as any, {
            forceFormData: true,
            onSuccess: async () => {
                await Swal.fire({
                    icon: 'success',
                    title: 'Material Berhasil Dibuat!',
                    text: 'Material Anda telah disimpan dan siap digunakan oleh siswa.',
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
                    'Gagal menyimpan material. Silakan coba lagi.';

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
    }, []);

    return (
        <>
            <Head title="Buat Material - Teacher" />

            <motion.div
                className="space-y-8 p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <PageHeader
                    title="Buat Material Baru"
                    subtitle="Rancang pengalaman belajar yang interaktif untuk siswa Anda"
                    icon={<PlusCircle className="h-6 w-6" />}
                    role="teacher"
                    userName={user.name}
                />

                <div className="mx-auto max-w-5xl">
                    <MaterialFormStepper
                        mode="create"
                        classrooms={classrooms}
                        prerequisites={ownMaterials}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </motion.div>
        </>
    );
}
