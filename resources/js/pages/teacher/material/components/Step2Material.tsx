import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Check,
    FileText,
    Link,
    Lightbulb,
    MessageSquare,
    Play,
    Upload,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { cn } from '@/lib/utils';

interface Step2MaterialProps {
    formData: MaterialFormData;
    errors: Record<string, string[]>;
    setFieldValue: (field: keyof MaterialFormData, value: any) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

const SectionHeader = ({
    icon: Icon,
    title,
    description,
}: {
    icon: any;
    title: string;
    description: string;
}) => (
    <div className="mb-8 flex items-start gap-4">
        <div className="rounded-xl border border-(--palette-green)/10 bg-(--palette-green)/8 p-4 shadow-sm">
            <Icon className="h-6 w-6 text-(--palette-green)" />
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
);

export default function Step2Material({
    formData,
    errors,
    setFieldValue,
}: Step2MaterialProps) {
    const [dragActive, setDragActive] = useState(false);

    const getError = (field: string) => errors[field]?.[0];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;

        if (files && files[0]) {
            const file = files[0];

            if (file.type === 'application/pdf') {
                setFieldValue('material_pdf', file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files[0]) {
            setFieldValue('material_pdf', files[0]);
        }
    };

    const removeFile = () => {
        setFieldValue('material_pdf', null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) {
            return '0 Bytes';
        }

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    };

    return (
        <motion.div
            className="space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="rounded-2xl border border-(--palette-limelight)/20 bg-white p-8 shadow-sm"
                variants={itemVariants}
            >
                <div className="grid grid-cols-1 gap-12">
                {/* Visual & Narrative */}
                    <div className="space-y-8">
                        <SectionHeader
                            icon={Play}
                            title="Video & Kasus"
                            description="Sediakan video orientasi dan narasi kasus untuk membantu pemahaman siswa."
                        />

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="case_narrative"
                                    className="flex items-center gap-2 text-sm font-bold text-foreground"
                                >
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    Narasi Kasus / Masalah{' '}
                                    <span className="ml-1 text-xs font-medium text-muted-foreground/60">
                                        (Opsional)
                                    </span>
                                </Label>
                                <div className="relative group">
                                    <textarea
                                        id="case_narrative"
                                        value={formData.case_narrative}
                                        onChange={(e) =>
                                            setFieldValue(
                                                'case_narrative',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Deskripsikan kasus atau masalah yang akan dipelajari siswa..."
                                        className={cn(
                                            'min-h-[120px] w-full resize-none rounded-lg border border-(--palette-limelight)/20 bg-white px-4 py-3 pl-11 text-sm leading-relaxed transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none',
                                            getError('case_narrative') &&
                                                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                        )}
                                        maxLength={1000}
                                    />
                                    <MessageSquare className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-(--palette-green)" />
                                    <div className="absolute bottom-3 right-3 text-[10px] font-bold tracking-tighter text-muted-foreground/50 uppercase">
                                        {formData.case_narrative.length}/1000
                                    </div>
                                </div>
                                {getError('case_narrative') && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {getError('case_narrative')}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="video_url"
                                    className="flex items-center gap-2 text-sm font-bold text-foreground"
                                >
                                    <Link className="h-4 w-4 text-muted-foreground" />
                                    URL Video YouTube{' '}
                                    <span className="ml-1 text-xs font-medium text-muted-foreground/60">
                                        (Opsional)
                                    </span>
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="video_url"
                                        type="url"
                                        value={formData.video_url}
                                        onChange={(e) =>
                                            setFieldValue('video_url', e.target.value)
                                        }
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className={cn(
                                            'h-12 rounded-lg border-(--palette-limelight)/20 px-4 pl-11 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                            getError('video_url') &&
                                                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                        )}
                                    />
                                    <Play className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-(--palette-green)" />
                                </div>
                                {getError('video_url') && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {getError('video_url')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                {/* PDF Upload Section */}
                    <div className="space-y-8">
                        <SectionHeader
                            icon={FileText}
                            title="Dokumen Materi"
                            description="Unggah file PDF sebagai bahan bacaan utama atau modul praktikum."
                        />

                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                {formData.material_pdf ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-between rounded-2xl border border-(--palette-green)/30 bg-(--palette-green)/5 p-6 shadow-sm group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-(--palette-green) shadow-md shadow-black/5 transition-transform group-hover:scale-105 border border-(--palette-green)/10">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground truncate max-w-50 md:max-w-md">
                                                    {formData.material_pdf.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-(--palette-green) uppercase tracking-widest bg-(--palette-green)/10 px-2 py-0.5 rounded-full">
                                                        {formatFileSize(formData.material_pdf.size)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        PDF Siap diunggah
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="p-3 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
                                            type="button"
                                            title="Hapus file"
                                        >
                                            <X size={20} />
                                        </button>
                                    </motion.div>
                                ) : formData.material_pdf_existing ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between rounded-2xl border border-(--palette-limelight)/30 bg-(--palette-limelight)/5 p-6 shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-(--palette-green) shadow-md shadow-black/5 border border-(--palette-limelight)/20">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    File Saat Ini
                                                </p>
                                                <p className="text-sm text-muted-foreground truncate max-w-50 md:max-w-md mt-0.5">
                                                    {formData.material_pdf_existing}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-(--palette-green) text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-(--palette-green)/20">
                                            <Check size={14} className="stroke-3" />
                                            <span>Tersimpan</span>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('material_pdf')?.click()}
                                className={cn(
                                    'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300',
                                    dragActive
                                        ? 'border-(--palette-green) bg-(--palette-green)/5 scale-[1.02] shadow-xl shadow-(--palette-green)/5'
                                        : 'border-(--palette-limelight)/30 bg-gray-50/30 hover:border-(--palette-green)/40 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/40',
                                )}
                            >
                                <input
                                    id="material_pdf"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            'p-5 rounded-2xl mb-5 transition-all duration-300',
                                            dragActive
                                                ? 'bg-(--palette-green) text-white shadow-lg shadow-(--palette-green)/20 rotate-12'
                                                : 'bg-white text-muted-foreground shadow-sm border border-(--palette-limelight)/20',
                                        )}
                                    >
                                        <Upload size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">
                                        {dragActive
                                            ? 'Lepaskan file sekarang'
                                            : 'Klik untuk unggah atau seret file'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Format PDF (Maksimal 50MB)
                                    </p>
                                </div>
                            </div>

                            {getError('material_pdf') && (
                                <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                    <AlertCircle size={16} />
                                    {getError('material_pdf')}
                                </p>
                            )}
                        </div>
                    </div>
            </div>

            </motion.div>

            {/* Tips/Info Footer */}
            <motion.div
                className="flex items-start gap-4 rounded-2xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-6"
                variants={itemVariants}
            >
                <div className="shrink-0 rounded-xl border border-(--palette-limelight)/20 bg-white p-3 text-(--palette-green) shadow-sm">
                    <Lightbulb className="h-6 w-6" />
                </div>
                <div className="text-sm leading-relaxed">
                    <p className="mb-1 font-bold text-foreground">
                        Tip Pembelajaran
                    </p>
                    <p className="text-muted-foreground">
                        Sediakan video yang interaktif dan narasi kasus yang
                        menantang untuk meningkatkan keterlibatan siswa dalam
                        pembelajaran mandiri. Pastikan file PDF yang diunggah
                        terbaca dengan jelas.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
