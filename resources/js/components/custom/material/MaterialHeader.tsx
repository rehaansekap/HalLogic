import { ChartBarIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface MaterialHeaderProps {
    title: string;
    description: string;
    difficulty: 1 | 2 | 3;
    currentStep: number;
    groupStatus?: 'locked' | 'active' | 'completed';
    isLocked: boolean;
}

const difficultyConfig = {
    1: {
        color: 'bg-gradient-to-br from-[var(--palette-green)] via-[var(--palette-chartreuse)] to-[var(--palette-limelight)]',
        label: 'Mudah',
    },
    2: {
        color: 'bg-gradient-to-br from-[var(--palette-yellow-green)] via-[var(--palette-sunflower)] to-[var(--palette-green)]',
        label: 'Sedang',
    },
    3: {
        color: 'bg-gradient-to-br from-[var(--palette-sunflower)] via-[var(--palette-yellow-green)] to-[var(--palette-green)]',
        label: 'Sulit',
    },
};

export default function MaterialHeader({
    title,
    description,
    difficulty,
    currentStep,
    isLocked,
}: MaterialHeaderProps) {
    const config = difficultyConfig[difficulty];
    const steps = [
        'Refleksi',
        'Organisasi',
        'Eksperimen',
        'Pengumpulan',
        'Evaluasi',
    ];

    return (
        <motion.div
            className={`${config.color} relative overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated background elements */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
                <motion.div
                    className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/20 blur-2xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{ repeat: Infinity, duration: 8 }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/15 blur-2xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ repeat: Infinity, duration: 10, delay: 1 }}
                />
            </div>

            <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Link
                        href="/dashboard"
                        className="group inline-flex items-center gap-2 text-white/90 transition-all duration-200 hover:gap-3 hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-semibold">Kembali</span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Title section */}
                    <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mb-5 flex flex-wrap items-center gap-3">
                            <span className="inline-block rounded-full border border-white/30 bg-white/25 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                                {config.label}
                            </span>
                            {isLocked && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/30 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-sm">
                                    <Lock className="h-4 w-4" />
                                    <span>Terkunci</span>
                                </span>
                            )}
                        </div>
                        <h1 className="mb-4 text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-5xl">
                            {title}
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed font-medium text-white/95">
                            {description}
                        </p>
                    </motion.div>

                    {/* Progress section */}
                    <motion.div
                        className="rounded-2xl border border-white/30 bg-white/15 p-7 shadow-xl backdrop-blur-md"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="mb-5 flex items-center gap-2 text-base font-bold tracking-wide text-white/95">
                            <ChartBarIcon className="h-5 w-5" />
                            Status Progres
                        </h3>
                        <div className="space-y-3">
                            {steps.map((step, idx) => {
                                const isActive = idx + 1 <= currentStep;
                                const isCurrentStep = idx + 1 === currentStep;

                                return (
                                    <motion.div
                                        key={idx}
                                        className={`flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                                            isActive
                                                ? 'border border-white/40 bg-white/25 text-white shadow-md'
                                                : 'border border-white/10 text-white/60'
                                        }`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                    >
                                        {isActive ? (
                                            <CheckCircle2 className="h-5 w-5 shrink-0 animate-pulse text-white" />
                                        ) : (
                                            <div className="h-5 w-5 shrink-0 rounded-full border-2 border-white/30" />
                                        )}
                                        <span className="flex-1 text-sm font-semibold">
                                            {step}
                                        </span>
                                        {isCurrentStep && (
                                            <span className="flex items-center gap-1 rounded-lg border border-white/30 bg-white/40 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                                                <PlayIcon className="h-3 w-3" />
                                                Aktif
                                            </span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
