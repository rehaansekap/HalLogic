import {
    CheckCircleIcon,
    ClockIcon,
    LightBulbIcon,
    MapPinIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { Form } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lightbulb, Send, BookOpen, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Phase1OrientationProps {
    material: {
        id: number;
        title: string;
        slug: string;
        description: string;
        video_url?: string | null;
        learning_objectives?: string[];
        summary?: string;
        pre_reflection_questions?: string[];
    };
    hasInitialReflection: boolean;
    initialReflectionText?: string | null;
    groupExists: boolean;
}

export default function Phase1Orientation({
    material,
    hasInitialReflection,
    initialReflectionText = '',
    groupExists,
}: Phase1OrientationProps) {
    const [activeTab, setActiveTab] = useState<'materi' | 'refleksi'>('materi');
    const [reflection, setReflection] = useState(initialReflectionText ?? '');
    const [answers, setAnswers] = useState<string[]>(
        material.pre_reflection_questions && material.pre_reflection_questions.length > 0
            ? material.pre_reflection_questions.map(() => '')
            : ['']
    );

    const embedUrl = material.video_url ? (() => {
        const match = material.video_url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    })() : null;

    const parsedReflection = (() => {
        if (!initialReflectionText) return null;
        try {
            const parsed = JSON.parse(initialReflectionText);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // fallback to string
        }
        return null;
    })();

    const isQuestionsMode = material.pre_reflection_questions && material.pre_reflection_questions.length > 0;

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

    return (
        <motion.div
            className="rounded-xl border border-(--palette-limelight)/20 bg-white p-6 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Tabs Navigation */}
            <motion.div
                className="flex gap-1.5 rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-1 mb-8"
                variants={itemVariants}
            >
                <button
                    type="button"
                    onClick={() => setActiveTab('materi')}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'materi'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                >
                    <BookOpen className="h-4 w-4" />
                    <span>Materi</span>
                    {activeTab === 'materi' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30 pointer-events-none"
                            layoutId="activeSubTab"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('refleksi')}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'refleksi'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                >
                    <Heart className="h-4 w-4" />
                    <span>Refleksi</span>
                    {activeTab === 'refleksi' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30 pointer-events-none"
                            layoutId="activeSubTab"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
            </motion.div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
                {activeTab === 'materi' ? (
                    <motion.div
                        key="materi-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Title & Description */}
                        <div className="space-y-3">
                            <h2 className="text-2xl font-extrabold text-foreground tracking-tight uppercase">
                                {material.title}
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground leading-relaxed">
                                {material.description}
                            </p>
                        </div>

                        {/* Learning Objectives */}
                        {material.learning_objectives && material.learning_objectives.length > 0 && (
                            <div className="rounded-xl border border-(--palette-limelight)/10 bg-gray-50/30 p-6 space-y-4">
                                <h3 className="flex items-center gap-2.5 text-base font-bold text-foreground">
                                    <div className="rounded-lg bg-(--palette-green)/10 p-2 text-(--palette-green)">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    Tujuan Pembelajaran (TP)
                                </h3>
                                <p className="text-xs font-bold text-muted-foreground/60 tracking-wide uppercase">
                                    Di pertemuan ini, kamu diharapkan dapat:
                                </p>
                                <div className="space-y-3 pl-1">
                                    {material.learning_objectives.map((objective, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md bg-(--palette-green)/10 text-[10px] font-extrabold text-(--palette-green) border border-(--palette-green)/10">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                                                {objective}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {material.summary && (
                            <div className="rounded-xl border border-(--palette-limelight)/10 bg-gray-50/30 p-6 space-y-3">
                                <h3 className="flex items-center gap-2.5 text-base font-bold text-foreground">
                                    <div className="rounded-lg bg-(--palette-green)/10 p-2 text-(--palette-green)">
                                        <ClipboardList className="h-4 w-4" />
                                    </div>
                                    Ringkasan Materi
                                </h3>
                                <p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap pl-1">
                                    {material.summary}
                                </p>
                            </div>
                        )}

                        {/* Continue Button */}
                        <div className="flex pt-2">
                            <Button
                                type="button"
                                onClick={() => {
                                    setActiveTab('refleksi');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex-1 sm:flex-initial h-12 px-8 font-bold bg-(--palette-green) hover:bg-green-600 text-white rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Lanjut ke Refleksi
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="refleksi-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {hasInitialReflection ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-(--palette-green)/10 p-3">
                                        <Heart className="h-5 w-5 text-(--palette-green)" />
                                    </div>
                                    <div>
                                        <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                                            Refleksi Awal Tersimpan
                                            <CheckCircleSolid className="h-6 w-6 text-(--palette-green)" />
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Refleksi Kamu telah direkam, silakan lanjut ke fase berikutnya
                                        </p>
                                    </div>
                                </div>

                                {/* Video Orientation (Saved Mode) */}
                                {embedUrl && (
                                    <div className="overflow-hidden rounded-xl border border-(--palette-limelight)/20 shadow-sm">
                                        <div className="relative w-full pt-[56.25%]">
                                            <iframe
                                                className="absolute inset-0 h-full w-full"
                                                src={embedUrl}
                                                title="Video Materi"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-lg border border-(--palette-green)/20 bg-(--palette-green)/10 p-5 space-y-4">
                                    {parsedReflection ? (
                                        <div className="space-y-4">
                                            {parsedReflection.map((answer, index) => {
                                                const questionText = material.pre_reflection_questions && material.pre_reflection_questions[index]
                                                    ? material.pre_reflection_questions[index]
                                                    : `Pertanyaan ${index + 1}`;
                                                return (
                                                    <div key={index} className="border-l-2 border-(--palette-green) pl-4 py-1">
                                                        <p className="text-xs font-bold text-muted-foreground/80 mb-1">{questionText}</p>
                                                        <p className="text-sm font-semibold text-foreground leading-relaxed">{answer}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="leading-relaxed text-foreground font-semibold">
                                            {initialReflectionText}
                                        </p>
                                    )}
                                </div>

                                {groupExists ? (
                                    <div className="rounded-lg border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-4">
                                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <MapPinIcon className="h-4 w-4" />
                                            Kelompok Kamu Sudah Terbentuk
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Guru telah membentuk kelompok Kamu. Sekarang Kamu dapat melanjutkan ke Fase 2 untuk mengatur peran kelompok!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <ClockIcon className="h-4 w-4" />
                                            Menunggu Pembentukan Kelompok
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Refleksi Kamu disimpan! Guru akan membentuk kelompok dan Kamu dapat melanjutkan ke fase berikutnya.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="mb-8 flex items-start gap-4">
                                    <div className="rounded-lg bg-(--palette-green)/8 p-4">
                                        <Lightbulb className="h-6 w-6 text-(--palette-green)" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                                            Fase 1: Orientasi & Refleksi Awal
                                        </h2>
                                        <p className="text-muted-foreground">
                                            Tuliskan pemikiran awal Kamu tentang material ini sebelum memulai. Refleksi ini akan membantu Kamu melihat perkembangan pemahaman seiring waktu.
                                        </p>
                                    </div>
                                </div>

                                {/* Video Orientation (Form Mode) */}
                                {embedUrl && (
                                    <div className="overflow-hidden rounded-xl border border-(--palette-limelight)/20 shadow-sm">
                                        <div className="relative w-full pt-[56.25%]">
                                            <iframe
                                                className="absolute inset-0 h-full w-full"
                                                src={embedUrl}
                                                title="Video Materi"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <Form
                                    method="post"
                                    action={`/material/${material.slug}/reflection`}
                                    className="space-y-6"
                                >
                                    {({ errors, processing, wasSuccessful }) => (
                                        <div className="space-y-6">
                                            {/* Text Areas */}
                                            <div className="space-y-6">
                                                {isQuestionsMode ? (
                                                    material.pre_reflection_questions!.map((qText, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <label className="block text-sm font-semibold text-foreground leading-relaxed">
                                                                {index + 1}. {qText} <span className="text-red-500">*</span>
                                                            </label>
                                                            <textarea
                                                                name={`reflection[${index}]`}
                                                                value={answers[index] || ''}
                                                                onChange={(e) => {
                                                                    const newAnswers = [...answers];
                                                                    newAnswers[index] = e.target.value;
                                                                    setAnswers(newAnswers);
                                                                }}
                                                                placeholder="Tuliskan jawaban refleksi Kamu..."
                                                                className="resize-vertical min-h-24 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                                                required
                                                            />
                                                            {errors[`reflection.${index}`] && (
                                                                <p className="mt-1 text-xs font-semibold text-red-500">
                                                                    {errors[`reflection.${index}`]}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-semibold text-foreground">
                                                            Refleksi Awal Kamu <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            name="reflection"
                                                            value={reflection}
                                                            onChange={(e) => setReflection(e.target.value)}
                                                            placeholder="Tuliskan pemikiran dan harapan Kamu mengenai material ini..."
                                                            className="resize-vertical min-h-50 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                                            required
                                                        />
                                                        {errors.reflection && (
                                                            <p className="mt-2 text-sm text-red-500">
                                                                {errors.reflection}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center justify-between">
                                                {isQuestionsMode ? (
                                                    <>
                                                        <p className="text-xs text-muted-foreground">
                                                            {answers.filter(ans => ans.trim().length >= 5).length} dari {material.pre_reflection_questions!.length} pertanyaan dijawab
                                                        </p>
                                                        <p
                                                            className={`flex items-center gap-1 text-xs font-semibold ${answers.some(ans => ans.trim().length < 5)
                                                                ? 'text-red-500'
                                                                : 'text-(--palette-green)'
                                                                }`}
                                                        >
                                                            {answers.some(ans => ans.trim().length < 5) ? (
                                                                <>
                                                                    <PencilIcon className="h-3.5 w-3.5" />
                                                                    Setiap jawaban minimal 5 karakter
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircleIcon className="h-3.5 w-3.5" />
                                                                    Semua pertanyaan terisi
                                                                </>
                                                            )}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-xs text-muted-foreground">
                                                            {reflection.length} karakter
                                                        </p>
                                                        <p
                                                            className={`flex items-center gap-1 text-xs font-semibold ${reflection.length < 50
                                                                ? 'text-red-500'
                                                                : reflection.length < 100
                                                                    ? 'text-yellow-500'
                                                                    : 'text-(--palette-green)'
                                                                }`}
                                                        >
                                                            {reflection.length < 50 ? (
                                                                <>
                                                                    <PencilIcon className="h-3.5 w-3.5" />
                                                                    Minimal 50 karakter
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircleIcon className="h-3.5 w-3.5" />
                                                                    {reflection.length < 100 ? 'Baik' : 'Lengkap'}
                                                                </>
                                                            )}
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            {/* Tips */}
                                            <div className="rounded-lg border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-4">
                                                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                                                    <LightBulbIcon className="h-4 w-4" />
                                                    Tips Menulis Refleksi
                                                </p>
                                                <ul className="space-y-1 text-xs text-muted-foreground">
                                                    <li>• Apa yang sudah Kamu ketahui tentang topik ini?</li>
                                                    <li>• Apa harapan Kamu dari material ini?</li>
                                                    <li>• Apa tantangan yang Kamu antisipasi?</li>
                                                    <li>• Bagaimana Kamu akan mengukur keberhasilan?</li>
                                                </ul>
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        wasSuccessful ||
                                                        (isQuestionsMode
                                                            ? answers.some((ans) => ans.trim().length < 5)
                                                            : reflection.length < 50)
                                                    }
                                                    className={cn(
                                                        "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all text-white",
                                                        wasSuccessful
                                                            ? 'bg-(--palette-green)'
                                                            : 'bg-(--palette-green) hover:shadow-lg disabled:opacity-50'
                                                    )}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                            Menyimpan...
                                                        </>
                                                    ) : wasSuccessful ? (
                                                        <>
                                                            <Heart className="h-5 w-5" />
                                                            Tersimpan!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="h-5 w-5" />
                                                            Simpan Refleksi
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            {/* Success Message */}
                                            {wasSuccessful && (
                                                <div className="flex items-center gap-2 rounded-lg border border-(--palette-green)/30 bg-(--palette-green)/10 p-4 text-sm font-semibold text-(--palette-green)">
                                                    <CheckCircleIcon className="h-4 w-4 shrink-0" />
                                                    Refleksi berhasil disimpan! Silakan tunggu guru membentuk kelompok atau refresh halaman.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Form>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
