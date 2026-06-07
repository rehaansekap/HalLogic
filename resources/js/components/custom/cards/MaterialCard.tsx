import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Prerequisite {
    id: number;
    title: string;
    slug: string;
}

interface MaterialCardProps {
    id: number;
    title: string;
    description: string;
    difficulty: number;
    classroom?: string;
    teacher?: string;
    status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
    progress?: number;
    prerequisite?: string | Prerequisite;
    onClick?: () => void;
    delay?: number;
}

export default function MaterialCard({
    title,
    description,
    difficulty,
    classroom,
    teacher,
    status,
    progress = 0,
    prerequisite,
    onClick,
    delay = 0,
}: MaterialCardProps) {
    const difficultyColors: Record<number, { bg: string; text: string; border: string }> = {
        1: {
            bg: 'bg-[var(--palette-green)]/10',
            text: 'text-[var(--palette-green)]',
            border: 'border-[var(--palette-green)]/20',
        },
        2: {
            bg: 'bg-[var(--palette-sunflower)]/10',
            text: 'text-[var(--palette-sunflower)]',
            border: 'border-[var(--palette-sunflower)]/20',
        },
        3: {
            bg: 'bg-red-500/10',
            text: 'text-red-500',
            border: 'border-red-500/20',
        },
        4: {
            bg: 'bg-orange-500/10',
            text: 'text-orange-500',
            border: 'border-orange-500/20',
        },
        5: {
            bg: 'bg-purple-500/10',
            text: 'text-purple-500',
            border: 'border-purple-500/20',
        },
    };

    const difficultyTextMap: Record<number, string> = {
        1: 'Mudah',
        2: 'Sedang',
        3: 'Sulit',
        4: 'Expert',
        5: 'Master',
    };

    const statusConfig = {
        locked: {
            icon: <Lock className="h-5 w-5" />,
            label: 'Terkunci',
            color: 'bg-[var(--palette-yellow-green)]/10',
            textColor: 'text-[var(--palette-yellow-green)]',
        },
        unlocked: {
            icon: <BookOpen className="h-5 w-5" />,
            label: 'Terbuka',
            color: 'bg-[var(--palette-limelight)]/10',
            textColor: 'text-[var(--palette-limelight)]',
        },
        in_progress: {
            icon: <Play className="h-5 w-5" />,
            label: 'Sedang Berjalan',
            color: 'bg-[var(--palette-sunflower)]/10',
            textColor: 'text-[var(--palette-sunflower)]',
        },
        completed: {
            icon: <CheckCircle2 className="h-5 w-5" />,
            label: 'Selesai',
            color: 'bg-(--palette-green)',
            textColor: 'text-white',
        },
    };

    const difficultyColor = difficultyColors[difficulty] ?? difficultyColors[1];
    const difficultyLabel = difficultyTextMap[difficulty] ?? 'Easy';
    const statusInfo = statusConfig[status] ?? statusConfig.unlocked;

    const prerequisiteLabel =
        typeof prerequisite === 'string'
            ? prerequisite
            : (prerequisite?.title ?? '');

    return (
        <motion.div
            className={cn(
                "overflow-hidden rounded-xl border transition-all duration-200",
                status === 'completed'
                    ? "cursor-pointer border-(--palette-green)/40 bg-(--palette-green)/8 hover:shadow-lg animate-fade-in"
                    : status !== 'locked' 
                        ? "cursor-pointer border-[--palette-chartreuse]/20 bg-white hover:shadow-lg" 
                        : "cursor-not-allowed border-gray-200 bg-gray-50/80 opacity-80"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay,
                duration: 0.4,
                ease: 'easeOut',
            }}
            whileHover={status !== 'locked' ? {
                scale: 1.02,
                boxShadow: status === 'completed'
                    ? '0 20px 25px -5px rgba(16, 185, 129, 0.15)'
                    : '0 20px 25px -5px rgba(212, 241, 0, 0.1)',
            } : {}}
            whileTap={status !== 'locked' ? { scale: 0.98 } : {}}
            onClick={status !== 'locked' ? onClick : undefined}
        >
            <div className="space-y-4 p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="mb-1 line-clamp-2 text-lg font-bold text-foreground">
                            {title}
                        </h3>
                        {classroom && (
                            <p className="text-xs text-muted-foreground">
                                {classroom}
                            </p>
                        )}
                    </div>
                    <motion.div
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 ${statusInfo.color} shrink-0`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay + 0.1, type: 'spring' }}
                    >
                        <span className={`${statusInfo.textColor}`}>
                            {statusInfo.icon}
                        </span>
                    </motion.div>
                </div>

                {/* Description */}
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {description}
                </p>

                {/* Difficulty & Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                    <Badge
                        className={`${difficultyColor.bg} ${difficultyColor.text} border ${difficultyColor.border}`}
                    >
                        {difficultyLabel}
                    </Badge>

                    {teacher && (
                        <Badge variant="outline" className="text-xs">
                            {teacher}
                        </Badge>
                    )}
                </div>

                {/* Progress Bar - only show if in_progress or completed */}
                {(status === 'in_progress' || status === 'completed') && (
                    <motion.div
                        className="space-y-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.2 }}
                    >
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                                Progress
                            </span>
                            <span className="font-semibold text-[-palette-green]">
                                {progress}%
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[--palette-limelight]/10">
                            <motion.div
                                className="h-full bg-(--palette-green)"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{
                                    delay: delay + 0.3,
                                    duration: 0.8,
                                    ease: 'easeOut',
                                }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Locked Message */}
                {status === 'locked' && prerequisiteLabel && (
                    <motion.div
                        className="rounded-lg border border-gray-200 bg-gray-100 p-3 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.2 }}
                    >
                        <p className="text-xs text-gray-500 leading-relaxed">
                            <span className="font-bold flex items-center gap-1.5 mb-1 text-gray-700">
                                <Lock className="w-3 h-3" />
                                Materi Terkunci
                            </span>{' '}
                            Selesaikan materi <span className="font-semibold text-gray-900">"{prerequisiteLabel}"</span> terlebih dahulu.
                        </p>
                    </motion.div>
                )}

                {/* Action Button */}
                <motion.button
                    className={cn(
                        "mt-4 w-full rounded-lg px-4 py-2 text-sm font-bold transition-all",
                        status === 'locked' && "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                    style={status !== 'locked' ? {
                        background:
                                status === 'completed'
                                  ? 'var(--palette-green)'
                                  : 'var(--palette-chartreuse)',
                    } : {}}
                    whileHover={status !== 'locked' ? { scale: 1.05 } : {}}
                    whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                    disabled={status === 'locked'}
                >
                    <span className={status === 'locked' ? "text-gray-500" : "text-white"}>
                        {status === 'locked'
                            ? 'Terkunci'
                            : status === 'completed'
                              ? 'Selesai'
                              : status === 'in_progress'
                                ? 'Lanjutkan'
                                : 'Mulai Belajar'}
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
}
