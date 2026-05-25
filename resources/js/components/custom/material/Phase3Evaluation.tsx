import {
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Send, Star } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';

interface Phase3EvaluationProps {
    materialSlug: string;
    finalReflection?: string | null;
    questions?: string[];
}

export default function Phase3Evaluation({
    materialSlug,
    finalReflection = '',
    questions = [],
}: Phase3EvaluationProps) {
    const [reflection, setReflection] = useState(finalReflection ?? '');
    const [answers, setAnswers] = useState<string[]>(
        questions && questions.length > 0 ? questions.map(() => '') : ['']
    );

    const parsedReflection = (() => {
        if (!finalReflection) return null;
        try {
            const parsed = JSON.parse(finalReflection);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // fallback to string
        }
        return null;
    })();

    const isQuestionsMode = questions && questions.length > 0;

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

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
                variants={itemVariants}
            >
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-(--palette-sunflower)/8 p-4">
                        <Star className="h-6 w-6 text-(--palette-sunflower)" />
                    </div>
                    <div className="flex-1">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            Fase 3: Evaluasi & Refleksi
                        </h2>
                        <p className="text-muted-foreground">
                            Berikan refleksi akhir Kamu mengenai pembelajaran yang telah dilakukan
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Reflection Content */}
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-6"
                variants={itemVariants}
            >
                {finalReflection ? (
                    <div>
                        <p className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                            <CheckCircleIcon className="h-4 w-4 text-(--palette-green)" />
                            Refleksi Akhir Tersimpan
                        </p>
                        <div className="rounded-lg bg-(--palette-green)/10 p-5 space-y-4 text-sm text-foreground">
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
                                    {finalReflection}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <Form
                        method="post"
                        action={`/material/${materialSlug}/finish`}
                        onSuccess={() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Selamat!',
                                text: 'Kamu telah menyelesaikan seluruh fase pada materi ini.',
                                confirmButtonColor: '#10b981',
                                customClass: {
                                    popup: 'rounded-3xl border-none shadow-2xl',
                                    confirmButton:
                                        'rounded-xl px-8 py-3 font-bold uppercase tracking-wider transition-transform hover:scale-105 active:scale-95',
                                },
                            });
                        }}
                    >
                        {({ errors, processing, wasSuccessful }) => (
                            <div className="space-y-6">
                                {isQuestionsMode ? (
                                    questions.map((qText, index) => (
                                        <div key={index} className="space-y-2">
                                            <label className="block text-sm font-semibold text-foreground leading-relaxed">
                                                {index + 1}. {qText} <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name={`final_reflection[${index}]`}
                                                value={answers[index] || ''}
                                                onChange={(e) => {
                                                    const newAnswers = [...answers];
                                                    newAnswers[index] = e.target.value;
                                                    setAnswers(newAnswers);
                                                }}
                                                placeholder="Tuliskan jawaban refleksi Kamu..."
                                                className="resize-vertical min-h-24 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                                required
                                            />
                                            {errors[`final_reflection.${index}`] && (
                                                <p className="mt-1 text-xs font-semibold text-red-500">
                                                    {errors[`final_reflection.${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-foreground">
                                            Refleksi Akhir Kamu <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="final_reflection"
                                            value={reflection}
                                            onChange={(e) =>
                                                setReflection(e.target.value)
                                            }
                                            placeholder="Tuliskan pengalaman, pembelajaran, dan hal yang dapat ditingkatkan..."
                                            className="resize-vertical min-h-50 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                            required
                                        />
                                        {errors.final_reflection && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.final_reflection}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    {isQuestionsMode ? (
                                        <span>
                                            {answers.filter(ans => ans.trim().length >= 5).length} dari {questions.length} pertanyaan dijawab
                                        </span>
                                    ) : (
                                        <span>{reflection.length} karakter</span>
                                    )}
                                    <span className={
                                        (isQuestionsMode
                                            ? answers.some(ans => ans.trim().length < 5)
                                            : reflection.length < 50)
                                            ? 'text-red-500 font-semibold'
                                            : 'text-(--palette-green) font-semibold'
                                    }>
                                        {isQuestionsMode ? (
                                            answers.some(ans => ans.trim().length < 5)
                                                ? 'Setiap jawaban minimal 5 karakter'
                                                : 'Semua pertanyaan terisi'
                                        ) : (
                                            reflection.length < 50
                                                ? 'Minimal 50 karakter'
                                                : 'Lengkap'
                                        )}
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        wasSuccessful ||
                                        (isQuestionsMode
                                            ? answers.some((ans) => ans.trim().length < 5)
                                            : reflection.length < 50)
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--palette-green) py-3.5 font-semibold text-white hover:shadow-lg disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Kirim Refleksi Akhir
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </Form>
                )}
            </motion.div>
        </motion.div>
    );
}
