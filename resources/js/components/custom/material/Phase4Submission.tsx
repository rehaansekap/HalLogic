import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Code2, File, Upload } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Phase4SubmissionProps {
    materialSlug: string;
    currentStep: number;
    currentUserRole: string;
    groupHasSubmitted: boolean;
}

export default function Phase4Submission({
    materialSlug,
    currentStep,
    currentUserRole,
    groupHasSubmitted,
}: Phase4SubmissionProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [codeFinal, setCodeFinal] = useState('');

    const isPhaseActive = currentStep >= 4;
    const isLeader = currentUserRole === 'Leader';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    if (!isPhaseActive) {
        return (
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-4">
                        <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Fase 4: Pengumpulan Final
                        </h2>
                        <p className="text-muted-foreground">
                            Fase ini akan dibuka setelah kode disimpan
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (groupHasSubmitted) {
        return (
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="mb-6 flex items-center gap-4"
                    variants={itemVariants}
                >
                    <div className="rounded-lg bg-(--palette-green)/20 p-4">
                        <CheckCircle2 className="h-6 w-6 text-(--palette-green)" />
                    </div>
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                            Pengumpulan Selesai
                            <CheckCircleIcon className="h-6 w-6 text-(--palette-green)" />
                        </h2>
                        <p className="text-muted-foreground">
                            Hasil kerja kelompok Anda telah dikumpulkan
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="flex items-center gap-2 rounded-lg border border-(--palette-green)/20 bg-(--palette-green)/10 p-4"
                    variants={itemVariants}
                >
                    <CheckCircleIcon className="h-4 w-4 shrink-0 text-(--palette-green)" />
                    <p className="text-sm text-foreground">
                        Kelompok Anda telah menyelesaikan pengumpulan hasil
                        kerja. Sekarang Anda dapat melanjutkan ke fase evaluasi
                        untuk melihat karya kelompok lain dan memberikan
                        feedback.
                    </p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="mb-8 flex items-start gap-4"
                variants={itemVariants}
            >
                <div className="rounded-lg bg-(--palette-sunflower)/8 p-4">
                    <Upload className="h-6 w-6 text-(--palette-sunflower)" />
                </div>
                <div className="flex-1">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                        Fase 4: Pengumpulan Final
                    </h2>
                    <p className="text-muted-foreground">
                        {isLeader
                            ? 'Sebagai Ketua, Anda dapat mengumpulkan file flowchart dan kode final kelompok'
                            : 'Ketua akan mengumpulkan hasil kerja kelompok'}
                    </p>
                </div>
            </motion.div>

            {!isLeader && (
                <motion.div
                    className="mb-6 flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4"
                    variants={itemVariants}
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Hanya untuk Ketua
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Hanya Ketua kelompok yang dapat mengumpulkan hasil
                            kerja
                        </p>
                    </div>
                </motion.div>
            )}

            {isLeader && (
                <Form
                    method="post"
                    action={`/material/${materialSlug}/submit-phase-4`}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    {({ errors, processing, wasSuccessful }) => (
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* File Upload — Flowchart */}
                            <motion.div variants={itemVariants}>
                                <label className="mb-3 block text-sm font-semibold text-foreground">
                                    File Flowchart (.pdf, .jpg, .jpeg, .png) *
                                </label>
                                <div className="cursor-pointer rounded-lg border-2 border-dashed border-(--palette-limelight)/30 p-8 text-center transition-colors hover:border-(--palette-green)">
                                    <input
                                        type="file"
                                        name="file_flowchart"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-input"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <label
                                        htmlFor="file-input"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="mx-auto mb-3 h-12 w-12 text-(--palette-limelight) opacity-50" />
                                        <p className="font-semibold text-foreground">
                                            Klik untuk memilih file atau drag &
                                            drop
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Maksimal 10MB — PDF, JPG, JPEG, atau PNG
                                        </p>
                                    </label>
                                </div>
                                {selectedFile && (
                                    <motion.div
                                        className="mt-3 flex items-center gap-2 rounded-lg bg-(--palette-green)/10 p-3"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <File className="h-4 w-4 text-(--palette-green)" />
                                        <span className="text-sm font-semibold text-foreground">
                                            {selectedFile.name}
                                        </span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {(
                                                selectedFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{' '}
                                            MB
                                        </span>
                                    </motion.div>
                                )}
                                {errors.file_flowchart && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.file_flowchart}
                                    </p>
                                )}
                            </motion.div>

                            {/* Code Final */}
                            <motion.div variants={itemVariants}>
                                <label className="mb-3 block text-sm font-semibold text-foreground">
                                    Source Code Final *
                                </label>
                                <textarea
                                    name="code_final"
                                    value={codeFinal}
                                    onChange={(e) =>
                                        setCodeFinal(e.target.value)
                                    }
                                    placeholder="Tempelkan source code final kelompok Anda di sini..."
                                    className="resize-vertical min-h-50 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 font-mono text-sm focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                />
                                {errors.code_final && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.code_final}
                                    </p>
                                )}
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                className="flex gap-3 pt-4"
                                variants={itemVariants}
                            >
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !selectedFile ||
                                        codeFinal.length < 10 ||
                                        wasSuccessful
                                    }
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all ${
                                        wasSuccessful
                                            ? 'bg-(--palette-green) text-white'
                                            : 'bg-(--palette-green) text-white hover:shadow-lg disabled:opacity-50'
                                    }`}
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Mengumpulkan...
                                        </>
                                    ) : wasSuccessful ? (
                                        <>
                                            <CheckCircle2 className="h-5 w-5" />
                                            Terkumpul!
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            Kumpulkan Hasil Akhir
                                        </>
                                    )}
                                </Button>
                            </motion.div>

                            {wasSuccessful && (
                                <motion.div
                                    className="flex items-center gap-2 rounded-lg border border-(--palette-green)/30 bg-(--palette-green)/10 p-4 text-sm font-semibold text-(--palette-green)"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <CheckCircleIcon className="h-4 w-4 shrink-0" />
                                    File berhasil dikumpulkan! Lanjut ke fase
                                    evaluasi
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </Form>
            )}
        </motion.div>
    );
}
