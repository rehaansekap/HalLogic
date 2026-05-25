import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import PageHeader from '@/components/custom/layout/PageHeader';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as classroomsIndex, store } from '@/routes/admin/classrooms';

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface AdminClassroomsCreateProps {
    teachers: Teacher[];
}

const ACADEMIC_YEARS = [
    '2024/2025',
    '2025/2026',
    '2026/2027',
    '2027/2028',
];

export default function AdminClassroomsCreate({
    teachers,
}: AdminClassroomsCreateProps) {
    const [formData, setFormData] = useState({
        name: '',
        academic_year: '2025/2026',
        teacher_id: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: '' }));
        },
        [],
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);

            router.post(store.url(), formData, {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Kelas Berhasil Ditambahkan!',
                        text: `Kelas ${formData.name} telah dibuat.`,
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl border-none shadow-2xl',
                        },
                    });
                },
                onError: (errs) => {
                    setErrors(errs);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Periksa kembali form Kamu.',
                        confirmButtonColor: '#ef4444',
                        customClass: {
                            popup: 'rounded-2xl border-none shadow-2xl',
                        },
                    });
                },
                onFinish: () => setIsSubmitting(false),
            });
        },
        [formData],
    );

    const inputClass = (field: string) =>
        `w-full rounded-xl border ${errors[field] ? 'border-red-400' : 'border-(--palette-limelight)/30'} bg-white px-4 py-2.5 text-sm transition-all focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20`;

    return (
        <>
            <Head title="Tambah Kelas - Admin" />

            <motion.div
                className="space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Tambah Kelas Baru"
                    subtitle="Buat kelas baru dan assign guru pengajar"
                    icon={<Building2 className="h-6 w-6" />}
                    role="admin"
                />

                <div className="mx-auto max-w-2xl">
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-2xl border border-(--palette-limelight)/20 bg-white p-6 shadow-sm md:p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Nama Kelas
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass('name')}
                                placeholder="Contoh: XII IPA 1"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Academic Year */}
                        <div>
                            <label
                                htmlFor="academic_year"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Tahun Ajaran
                            </label>
                            <Select
                                value={formData.academic_year}
                                onValueChange={(val) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        academic_year: val,
                                    }));
                                    setErrors((prev) => ({
                                        ...prev,
                                        academic_year: '',
                                    }));
                                }}
                            >
                                <SelectTrigger
                                    id="academic_year"
                                    className={inputClass('academic_year')}
                                >
                                    <SelectValue placeholder="Pilih tahun ajaran..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-(--palette-limelight)/20 shadow-xl">
                                    {ACADEMIC_YEARS.map((y) => (
                                        <SelectItem
                                            key={y}
                                            value={y}
                                            className="rounded-lg transition-colors focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                        >
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.academic_year && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.academic_year}
                                </p>
                            )}
                        </div>

                        {/* Teacher */}
                        <div>
                            <label
                                htmlFor="teacher_id"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Guru Pengajar
                            </label>
                            <Select
                                value={formData.teacher_id}
                                onValueChange={(val) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        teacher_id: val,
                                    }));
                                    setErrors((prev) => ({
                                        ...prev,
                                        teacher_id: '',
                                    }));
                                }}
                            >
                                <SelectTrigger
                                    id="teacher_id"
                                    className={inputClass('teacher_id')}
                                >
                                    <SelectValue placeholder="Pilih guru..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-(--palette-limelight)/20 shadow-xl">
                                    {teachers.map((t) => (
                                        <SelectItem
                                            key={t.id}
                                            value={t.id.toString()}
                                            className="rounded-lg transition-colors focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                        >
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.teacher_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.teacher_id}
                                </p>
                            )}
                        </div>

                        {/* Info */}
                        <div className="rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-4">
                            <p className="text-xs text-muted-foreground">
                                💡 Kode gabung akan di-generate otomatis oleh
                                sistem setelah kelas dibuat.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-(--palette-limelight)/20 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.visit(classroomsIndex.url())
                                }
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-(--palette-green) font-bold text-white shadow-sm shadow-(--palette-green)/20 transition-all hover:bg-(--palette-green)/90 hover:scale-105 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.8,
                                                ease: 'linear',
                                            }}
                                        />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Kelas
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </>
    );
}
