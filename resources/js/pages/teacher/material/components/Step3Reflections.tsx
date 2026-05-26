import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    HelpCircle,
    Lightbulb,
    MessageSquare,
    ClipboardList,
    ChevronDown,
    Play,
    Link,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { cn } from '@/lib/utils';

interface Step3ReflectionsProps {
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

interface AccordionSectionProps {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    isOpen: boolean;
    onToggle: () => void;
    hasError?: boolean;
    children: React.ReactNode;
}

const AccordionSection = ({
    title,
    description,
    icon: Icon,
    isOpen,
    onToggle,
    hasError,
    children,
}: AccordionSectionProps) => {
    return (
        <motion.div
            className={cn(
                "rounded-2xl border bg-white p-6 md:p-8 shadow-sm transition-all duration-300",
                isOpen
                    ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5"
                    : hasError
                        ? "border-red-200 hover:border-red-300 bg-red-50/5"
                        : "border-(--palette-limelight)/20 hover:border-(--palette-green)/20"
            )}
            variants={itemVariants}
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-start justify-between gap-4 text-left focus:outline-none group"
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                        "rounded-xl border p-3.5 shadow-sm transition-colors",
                        isOpen
                            ? "border-(--palette-green)/10 bg-(--palette-green)/8 text-(--palette-green)"
                            : hasError
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-(--palette-limelight)/20 bg-gray-50 text-muted-foreground group-hover:text-foreground"
                    )}>
                        <Icon className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className={cn(
                                "text-lg md:text-xl font-bold tracking-tight",
                                hasError ? "text-red-600" : "text-foreground"
                            )}>
                                {title}
                            </h3>
                            {hasError && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100 uppercase tracking-wider animate-pulse">
                                    Error
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs md:text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 pt-2 text-muted-foreground/60 group-hover:text-foreground">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-5 w-5" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function Step3Reflections({
    formData,
    errors,
    setFieldValue,
}: Step3ReflectionsProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        media: true,
        pre: false,
        post: false,
    });

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getError = (field: string) => errors[field]?.[0];

    const hasMediaErrors = useMemo(() => !!errors.video_url || !!errors.case_narrative, [errors]);
    const hasPreErrors = useMemo(() => !!errors.pre_reflection_questions, [errors]);
    const hasPostErrors = useMemo(() => !!errors.post_reflection_questions, [errors]);

    useEffect(() => {
        if (hasPreErrors || hasPostErrors || hasMediaErrors) {
            setOpenSections((prev) => {
                const next = { ...prev };
                if (hasMediaErrors) {
                    next.media = true;
                }
                if (hasPreErrors) {
                    next.pre = true;
                }
                if (hasPostErrors) {
                    next.post = true;
                }
                return next;
            });
        }
    }, [errors, hasPreErrors, hasPostErrors, hasMediaErrors]);

    const handleAddPreQuestion = () => {
        const current = formData.pre_reflection_questions || [];
        setFieldValue('pre_reflection_questions', [...current, '']);
    };

    const handlePreQuestionChange = (index: number, value: string) => {
        const updated = [...formData.pre_reflection_questions];
        updated[index] = value;
        setFieldValue('pre_reflection_questions', updated);
    };

    const handleRemovePreQuestion = (index: number) => {
        const updated = formData.pre_reflection_questions.filter((_, i) => i !== index);
        setFieldValue('pre_reflection_questions', updated);
    };

    const handleAddPostQuestion = () => {
        const current = formData.post_reflection_questions || [];
        setFieldValue('post_reflection_questions', [...current, '']);
    };

    const handlePostQuestionChange = (index: number, value: string) => {
        const updated = [...formData.post_reflection_questions];
        updated[index] = value;
        setFieldValue('post_reflection_questions', updated);
    };

    const handleRemovePostQuestion = (index: number) => {
        const updated = formData.post_reflection_questions.filter((_, i) => i !== index);
        setFieldValue('post_reflection_questions', updated);
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Accordion 1: Media & Narasi Kasus */}
            <AccordionSection
                id="media"
                title="Narasi Kasus & Media Pembelajaran"
                description="Sertakan video kasus/narasi untuk menunjang aktivitas kelompok."
                icon={Play}
                isOpen={openSections.media}
                onToggle={() => toggleSection('media')}
                hasError={hasMediaErrors}
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="case_narrative"
                                className="flex items-center gap-2 text-sm font-bold text-foreground"
                            >
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                Narasi Kasus / Masalah
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
                                URL Video (YouTube / Google Drive)
                            </Label>
                            <div className="relative group">
                                <Input
                                    id="video_url"
                                    type="url"
                                    value={formData.video_url}
                                    onChange={(e) =>
                                        setFieldValue('video_url', e.target.value)
                                    }
                                    placeholder="https://www.youtube.com/watch?v=... atau https://drive.google.com/file/d/..."
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
            </AccordionSection>
            {/* Accordion 1: Refleksi Awal */}
            <AccordionSection
                id="pre"
                title="Refleksi Awal (Pre-Reflection)"
                description="Tentukan beberapa pertanyaan untuk dijawab siswa secara individu sebelum mereka mulai mempelajari materi."
                icon={MessageSquare}
                isOpen={openSections.pre}
                onToggle={() => toggleSection('pre')}
                hasError={hasPreErrors}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-foreground">
                            Daftar Pertanyaan Refleksi Awal
                        </Label>
                        <button
                            type="button"
                            onClick={handleAddPreQuestion}
                            className="flex items-center gap-1.5 rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 px-3.5 py-2 text-xs font-bold text-(--palette-green) transition-colors hover:bg-(--palette-green)/10 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Pertanyaan
                        </button>
                    </div>

                    {formData.pre_reflection_questions && formData.pre_reflection_questions.length > 0 ? (
                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {formData.pre_reflection_questions.map((question, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-(--palette-green)/10 text-xs font-bold text-(--palette-green) border border-(--palette-green)/20">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 relative">
                                            <Input
                                                value={question}
                                                onChange={(e) => handlePreQuestionChange(index, e.target.value)}
                                                placeholder="Contoh: Apa yang sudah kamu ketahui tentang sirkuit logika?"
                                                className={cn(
                                                    'h-12 rounded-lg border-(--palette-limelight)/20 px-4 pr-12 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                                    getError('pre_reflection_questions') && !question.trim() &&
                                                    'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                )}
                                                maxLength={255}
                                            />
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[9px] font-bold tracking-tighter text-muted-foreground/30 uppercase">
                                                {question.length}/255
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePreQuestion(index)}
                                            className="mt-1 shrink-0 rounded-xl p-2.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                            title="Hapus pertanyaan"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="rounded-2xl border-2 border-dashed border-gray-150 p-8 text-center bg-gray-50/30">
                            <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                            <p className="text-sm font-semibold text-muted-foreground/60">
                                Belum ada pertanyaan refleksi awal.
                            </p>
                            <p className="text-xs text-muted-foreground/45 mt-1 max-w-sm mx-auto">
                                Klik tombol "Tambah Pertanyaan" untuk mulai membuat pertanyaan refleksi awal untuk siswa.
                            </p>
                        </div>
                    )}

                    {getError('pre_reflection_questions') && (
                        <p className="text-xs font-semibold text-red-500 mt-2 bg-red-50/50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                            <span>⚠️</span> {getError('pre_reflection_questions')}
                        </p>
                    )}
                </div>
            </AccordionSection>

            {/* Accordion 2: Refleksi Akhir */}
            <AccordionSection
                id="post"
                title="Refleksi Akhir (Post-Reflection)"
                description="Tentukan beberapa pertanyaan evaluasi atau refleksi diri siswa setelah menyelesaikan seluruh aktivitas pembelajaran."
                icon={ClipboardList}
                isOpen={openSections.post}
                onToggle={() => toggleSection('post')}
                hasError={hasPostErrors}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-foreground">
                            Daftar Pertanyaan Refleksi Akhir
                        </Label>
                        <button
                            type="button"
                            onClick={handleAddPostQuestion}
                            className="flex items-center gap-1.5 rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 px-3.5 py-2 text-xs font-bold text-(--palette-green) transition-colors hover:bg-(--palette-green)/10 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Pertanyaan
                        </button>
                    </div>

                    {formData.post_reflection_questions && formData.post_reflection_questions.length > 0 ? (
                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {formData.post_reflection_questions.map((question, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-(--palette-green)/10 text-xs font-bold text-(--palette-green) border border-(--palette-green)/20">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 relative">
                                            <Input
                                                value={question}
                                                onChange={(e) => handlePostQuestionChange(index, e.target.value)}
                                                placeholder="Contoh: Hambatan apa yang paling menantang bagimu?"
                                                className={cn(
                                                    'h-12 rounded-lg border-(--palette-limelight)/20 px-4 pr-12 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                                    getError('post_reflection_questions') && !question.trim() &&
                                                    'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                )}
                                                maxLength={255}
                                            />
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[9px] font-bold tracking-tighter text-muted-foreground/30 uppercase">
                                                {question.length}/255
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePostQuestion(index)}
                                            className="mt-1 shrink-0 rounded-xl p-2.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                            title="Hapus pertanyaan"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="rounded-2xl border-2 border-dashed border-gray-150 p-8 text-center bg-gray-50/30">
                            <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                            <p className="text-sm font-semibold text-muted-foreground/60">
                                Belum ada pertanyaan refleksi akhir.
                            </p>
                            <p className="text-xs text-muted-foreground/45 mt-1 max-w-sm mx-auto">
                                Klik tombol "Tambah Pertanyaan" untuk mulai membuat pertanyaan refleksi akhir untuk siswa.
                            </p>
                        </div>
                    )}

                    {getError('post_reflection_questions') && (
                        <p className="text-xs font-semibold text-red-500 mt-2 bg-red-50/50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                            <span>⚠️</span> {getError('post_reflection_questions')}
                        </p>
                    )}
                </div>
            </AccordionSection>

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
                        Tips Menyusun Pertanyaan Refleksi
                    </p>
                    <p className="text-muted-foreground">
                        Gunakan pertanyaan pemantik yang merangsang cara berpikir kritis dan analisis diri siswa.
                        Pertanyaan refleksi awal membantu menguji pemahaman prasangka siswa, sedangkan refleksi akhir membantu mereka mengevaluasi pembelajaran mandiri serta kolaborasi yang telah dilakukan.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
