import {
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Send, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Phase3EvaluationProps {
    materialSlug: string;
    finalReflection?: string | null;
}

export default function Phase3Evaluation({
    materialSlug,
    finalReflection = '',
}: Phase3EvaluationProps) {
    const [reflection, setReflection] = useState(finalReflection ?? '');

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
                            Berikan refleksi akhir Anda mengenai pembelajaran yang telah dilakukan
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
                        <p className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                            <CheckCircleIcon className="h-4 w-4 text-(--palette-green)" />
                            Refleksi Akhir Tersimpan
                        </p>
                        <div className="rounded-lg bg-(--palette-green)/10 p-4 text-sm text-foreground">
                            {finalReflection}
                        </div>
                    </div>
                ) : (
                    <Form
                        method="post"
                        action={`/material/${materialSlug}/finish`}
                    >
                        {({ processing, wasSuccessful }) => (
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-foreground">
                                    Refleksi Akhir Anda
                                </label>
                                <textarea
                                    name="final_reflection"
                                    value={reflection}
                                    onChange={(e) =>
                                        setReflection(e.target.value)
                                    }
                                    placeholder="Tuliskan pengalaman, pembelajaran, dan hal yang dapat ditingkatkan..."
                                    className="resize-vertical min-h-50 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                />
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        reflection.length < 50 ||
                                        wasSuccessful
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--palette-green) py-3 font-semibold text-white hover:shadow-lg disabled:opacity-50"
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
