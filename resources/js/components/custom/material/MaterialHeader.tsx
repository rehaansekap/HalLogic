import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';

interface MaterialHeaderProps {
    title: string;
    description: string;
    difficulty: 1 | 2 | 3;
    groupStatus?: 'locked' | 'active' | 'completed';
    isLocked: boolean;
}

const difficultyConfig = {
    1: {
        text: 'text-(--palette-green)',
        bg: 'bg-(--palette-green)/8',
        border: 'border-(--palette-green)/30',
        label: 'Mudah',
    },
    2: {
        text: 'text-(--palette-yellow-green)',
        bg: 'bg-(--palette-yellow-green)/8',
        border: 'border-(--palette-yellow-green)/30',
        label: 'Sedang',
    },
    3: {
        text: 'text-(--palette-sunflower)',
        bg: 'bg-(--palette-sunflower)/8',
        border: 'border-(--palette-sunflower)/30',
        label: 'Sulit',
    },
};

export default function MaterialHeader({
    title,
    description,
    difficulty,
    isLocked,
}: MaterialHeaderProps) {
    const config = difficultyConfig[difficulty] || difficultyConfig[1];

    return (
        <motion.div
            className="pt-8 pb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto max-w-7xl px-4">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <Link
                        href="/dashboard"
                        className="group inline-flex items-center gap-2 text-muted-foreground transition-all duration-200 hover:gap-3 hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-semibold">Kembali ke Dashboard</span>
                    </Link>
                </motion.div>

                {/* Banner */}
                <div
                    className={`rounded-xl border ${config.border} overflow-hidden`}
                >
                    <div
                        className={`rounded-xl ${config.bg} p-6 backdrop-blur-sm md:p-8`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className="mb-4 flex items-center gap-3"
                                >
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`inline-block rounded-full border ${config.border} bg-white px-4 py-1.5 text-sm font-bold ${config.text} shadow-sm`}>
                                            {config.label}
                                        </span>
                                        {isLocked && (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-bold text-orange-600 shadow-sm">
                                                <Lock className="h-4 w-4" />
                                                <span>Terkunci</span>
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.h1
                                    className="text-3xl font-bold text-(--palette-green) md:text-4xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    {title}
                                </motion.h1>

                                <motion.p
                                    className="mt-3 text-sm text-muted-foreground md:text-base max-w-3xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {description}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
