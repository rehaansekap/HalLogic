import {
    CheckCircleIcon,
    ClockIcon,
    LightBulbIcon,
    MapPinIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Phase1OrientationProps {
    materialSlug: string;
    hasInitialReflection: boolean;
    initialReflectionText?: string | null;
    groupExists: boolean;
    videoUrl?: string | null;
    materialId?: number;
    questions?: string[];
}

export default function Phase1Orientation({
    materialSlug,
    hasInitialReflection,
    initialReflectionText = '',
    groupExists,
    videoUrl,
    questions = [],
}: Phase1OrientationProps) {
    const [reflection, setReflection] = useState(initialReflectionText ?? '');
    const [answers, setAnswers] = useState<string[]>(
        questions && questions.length > 0 ? questions.map(() => '') : ['']
    );

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

    const isQuestionsMode = questions && questions.length > 0;

    const embedUrl = videoUrl ? (() => {
        const match = videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    })() : null;

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

    if (hasInitialReflection) {
        return (
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <motion.div
                    className="mb-6 flex items-center gap-3"
                    variants={itemVariants}
                >
                    <div className="rounded-lg bg-(--palette-green)/10 p-3">
                        <Heart className="h-5 w-5 text-(--palette-green)" />
                    </div>
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                            Refleksi Awal Tersimpan
                            <CheckCircleSolid className="h-6 w-6 text-(--palette-green)" />
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Refleksi Anda telah direkam, silakan lanjut ke fase
                            berikutnya
                        </p>
                    </div>
                </motion.div>

                {/* Video Material for already reflected state */}
                {embedUrl && (
                    <motion.div
                        className="mb-6 overflow-hidden rounded-xl border border-(--palette-limelight)/20"
                        variants={itemVariants}
                    >
                        <div className="relative w-full pt-[56.25%]">
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={embedUrl}
                                title="Video Materi"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className="mb-6 rounded-lg border border-(--palette-green)/20 bg-(--palette-green)/10 p-5 space-y-4"
                    variants={itemVariants}
                >
                    {parsedReflection ? (
                        <div className="space-y-4">
                            {parsedReflection.map((answer, index) => {
                                const questionText = questions && questions[index] ? questions[index] : `Pertanyaan ${index + 1}`;
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
                </motion.div>

                {groupExists ? (
                    <motion.div
                        className="rounded-lg border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-4"
                        variants={itemVariants}
                    >
                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <MapPinIcon className="h-4 w-4" />
                            Kelompok Anda Sudah Terbentuk
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Guru telah membentuk kelompok Anda. Sekarang Anda
                            dapat melanjutkan ke Fase 2 untuk mengatur peran
                            kelompok!
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4"
                        variants={itemVariants}
                    >
                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <ClockIcon className="h-4 w-4" />
                            Menunggu Pembentukan Kelompok
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Refleksi Anda disimpan! Guru akan membentuk kelompok
                            dan Anda dapat melanjutkan ke fase berikutnya.
                        </p>
                    </motion.div>
                )}
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
            {/* Header */}
            <motion.div
                className="mb-8 flex items-start gap-4"
                variants={itemVariants}
            >
                <div className="rounded-lg bg-(--palette-green)/8 p-4">
                    <Lightbulb className="h-6 w-6 text-(--palette-green)" />
                </div>
                <div className="flex-1">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                        Fase 1: Orientasi & Refleksi Awal
                    </h2>
                    <p className="text-muted-foreground">
                        Tuliskan pemikiran awal Anda tentang material ini
                        sebelum memulai. Refleksi ini akan membantu Anda melihat
                        perkembangan pemahaman seiring waktu.
                    </p>
                </div>
            </motion.div>

            {/* Video Material */}
            {embedUrl && (
                <motion.div
                    className="mb-8 overflow-hidden rounded-xl border border-(--palette-limelight)/20"
                    variants={itemVariants}
                >
                    <div className="relative w-full pt-[56.25%]">
                        <iframe
                            className="absolute inset-0 h-full w-full"
                            src={embedUrl}
                            title="Video Materi"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.div>
            )}

            {/* Reflection Form */}
            <Form
                method="post"
                action={`/material/${materialSlug}/reflection`}
                className="space-y-6"
            >
                {({ errors, processing, wasSuccessful }) => (
                    <motion.div
                        className="space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Text Area */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            {isQuestionsMode ? (
                                questions.map((qText, index) => (
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
                                            placeholder="Tuliskan jawaban refleksi Anda..."
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
                                        Refleksi Awal Anda <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="reflection"
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        placeholder="Tuliskan pemikiran dan harapan Anda mengenai material ini..."
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
                        </motion.div>

                        {/* Character/Question Status */}
                        <motion.div
                            className="flex items-center justify-between"
                            variants={itemVariants}
                        >
                            {isQuestionsMode ? (
                                <>
                                    <p className="text-xs text-muted-foreground">
                                        {answers.filter(ans => ans.trim().length >= 5).length} dari {questions.length} pertanyaan dijawab
                                    </p>
                                    <p
                                        className={`flex items-center gap-1 text-xs font-semibold ${
                                            answers.some(ans => ans.trim().length < 5)
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
                                        className={`flex items-center gap-1 text-xs font-semibold ${
                                            reflection.length < 50
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
                        </motion.div>

                        {/* Tips */}
                        <motion.div
                            className="rounded-lg border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-4"
                            variants={itemVariants}
                        >
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                                <LightBulbIcon className="h-4 w-4" />
                                Tips Menulis Refleksi
                            </p>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                                <li>
                                    • Apa yang sudah Anda ketahui tentang topik
                                    ini?
                                </li>
                                <li>• Apa harapan Anda dari material ini?</li>
                                <li>• Apa tantangan yang Anda antisipasi?</li>
                                <li>
                                    • Bagaimana Anda akan mengukur keberhasilan?
                                </li>
                            </ul>
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
                                    wasSuccessful ||
                                    (isQuestionsMode
                                        ? answers.some((ans) => ans.trim().length < 5)
                                        : reflection.length < 50)
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
                        </motion.div>

                        {/* Success Message */}
                        {wasSuccessful && (
                            <motion.div
                                className="flex items-center gap-2 rounded-lg border border-(--palette-green)/30 bg-(--palette-green)/10 p-4 text-sm font-semibold text-(--palette-green)"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <CheckCircleIcon className="h-4 w-4 shrink-0" />
                                Refleksi berhasil disimpan! Silakan tunggu
                                guru membentuk kelompok atau refresh halaman.
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </Form>
        </motion.div>
    );
}
