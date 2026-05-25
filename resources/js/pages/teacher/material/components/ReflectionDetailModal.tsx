import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    ClipboardList,
    User,
    Calendar,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ReflectionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    reflectionType: 'pre' | 'post';
    questions: string[];
    answerText: string | null;
    submittedAt?: string | null;
}

export default function ReflectionDetailModal({
    isOpen,
    onClose,
    studentName,
    reflectionType,
    questions = [],
    answerText,
    submittedAt,
}: ReflectionDetailModalProps) {
    if (!isOpen) {
        return null;
    }

    const isPre = reflectionType === 'pre';

    const parsedAnswers = (() => {
        if (!answerText) return null;
        try {
            const parsed = JSON.parse(answerText);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            // Not a JSON array, handle as legacy string
        }
        return null;
    })();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal Container */}
                <motion.div
                    className="relative w-full max-w-2xl rounded-2xl border border-(--palette-limelight)/20 bg-white shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-(--palette-limelight)/20 p-5">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                isPre ? 'bg-(--palette-green)/10 text-(--palette-green)' : 'bg-(--palette-sunflower)/10 text-(--palette-sunflower)'
                            }`}>
                                {isPre ? (
                                    <MessageSquare className="h-4.5 w-4.5" />
                                ) : (
                                    <ClipboardList className="h-4.5 w-4.5" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    Detail Refleksi {isPre ? 'Awal' : 'Akhir'}
                                </h2>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {studentName}
                                    </span>
                                    {submittedAt && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(submittedAt).toLocaleString('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Modal Body */}
                    <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                        {answerText ? (
                            parsedAnswers ? (
                                <div className="space-y-6">
                                    {parsedAnswers.map((answer, index) => {
                                        const questionText = questions && questions[index] 
                                            ? questions[index] 
                                            : `Pertanyaan ${index + 1}`;
                                        
                                        return (
                                            <div 
                                                key={index} 
                                                className="rounded-xl border border-(--palette-limelight)/10 bg-gray-50/30 p-5 space-y-2.5 transition-all hover:bg-white hover:shadow-sm"
                                            >
                                                <p className="text-xs font-extrabold uppercase tracking-widest text-(--palette-green) flex items-center gap-2">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-(--palette-green)/10 text-[10px]">
                                                        {index + 1}
                                                    </span>
                                                    {isPre ? 'Pertanyaan Awal' : 'Pertanyaan Akhir'}
                                                </p>
                                                <h4 className="text-sm font-bold text-foreground leading-relaxed pl-7">
                                                    {questionText}
                                                </h4>
                                                <div className="border-t border-gray-100/80 pt-3 mt-1 pl-7">
                                                    <p className="text-sm font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                        {answer}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-(--palette-limelight)/10 bg-gray-50/30 p-5 space-y-3">
                                    <p className="text-xs font-extrabold uppercase tracking-widest text-(--palette-green)">
                                        Refleksi (Legacy / Text)
                                    </p>
                                    {questions && questions.length > 0 && (
                                        <h4 className="text-sm font-bold text-foreground leading-relaxed italic text-muted-foreground/80">
                                            {questions[0]}
                                        </h4>
                                    )}
                                    <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-3">
                                        {answerText}
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground font-semibold">
                                Belum ada jawaban refleksi yang terekam.
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end border-t border-(--palette-limelight)/20 p-5 bg-gray-50/50">
                        <Button
                            size="sm"
                            onClick={onClose}
                            className="bg-(--palette-green) font-bold text-white hover:bg-(--palette-green)/90 transition-all px-6 rounded-xl"
                        >
                            Tutup
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
