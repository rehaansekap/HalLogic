import { Head, router, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';

import PageHeader from '@/components/custom/layout/PageHeader';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { dashboard } from '@/routes/teacher';
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
                className="space-y-6 p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="mb-2">
                    <Link href={dashboard.url()}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group gap-2 text-muted-foreground hover:text-foreground transition-all"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

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
