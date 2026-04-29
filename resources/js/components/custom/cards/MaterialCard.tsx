import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Prerequisite {
    id: number;
    title: string;
    slug: string;
}

interface MaterialCardProps {
    id: number;
    title: string;
    description: string;
    difficulty: 1 | 2 | 3;
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
    const difficultyColors = {
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
            bg: 'bg-[var(--palette-yellow-green)]/10',
            text: 'text-[var(--palette-yellow-green)]',
            border: 'border-[var(--palette-yellow-green)]/20',
        },
    };

    const difficultyTextMap = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard',
    } as const;

    const statusConfig = {
        locked: {
            icon: <Lock className="h-5 w-5" />,
            label: 'Locked',
            color: 'bg-[var(--palette-yellow-green)]/10',
            textColor: 'text-[var(--palette-yellow-green)]',
        },
        unlocked: {
            icon: <BookOpen className="h-5 w-5" />,
            label: 'Unlocked',
            color: 'bg-[var(--palette-limelight)]/10',
            textColor: 'text-[var(--palette-limelight)]',
        },
        in_progress: {
            icon: <Play className="h-5 w-5" />,
            label: 'In Progress',
            color: 'bg-[var(--palette-sunflower)]/10',
            textColor: 'text-[var(--palette-sunflower)]',
        },
        completed: {
            icon: <CheckCircle2 className="h-5 w-5" />,
            label: 'Completed',
            color: 'bg-[var(--palette-green)]/10',
            textColor: 'text-[var(--palette-green)]',
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
            className="cursor-pointer overflow-hidden rounded-xl border border-[--palette-chartreuse]/20 bg-white transition-all duration-200 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay,
                duration: 0.4,
                ease: 'easeOut',
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 25px -5px rgba(212, 241, 0, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
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
                        className="rounded-lg border border-[--palette-yellow-green]/20 bg-[--palette-yellow-green]/10 p-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.2 }}
                    >
                        <p className="text-xs text-[--palette-yellow-green]">
                            <span className="font-semibold">Prerequisite:</span>{' '}
                            {prerequisiteLabel}
                        </p>
                    </motion.div>
                )}

                {/* Action Button */}
                <motion.button
                    className="mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    style={{
                        background:
                            status === 'locked'
                                ? 'var(--palette-yellow-green)'
                                : status === 'completed'
                                  ? 'var(--palette-green)'
                                  : 'var(--palette-chartreuse)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="font-semibold text-white">
                        {status === 'locked'
                            ? 'Locked'
                            : status === 'completed'
                              ? 'Completed'
                              : status === 'in_progress'
                                ? 'Continue'
                                : 'Start Material'}
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
}
