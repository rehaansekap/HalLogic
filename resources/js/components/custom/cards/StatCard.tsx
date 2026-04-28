import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'success' | 'warning' | 'info' | 'locked' | 'primary';
    description?: string;
    delay?: number;
    onClick?: () => void;
}

export default function StatCard({
    title,
    value,
    icon,
    trend,
    color = 'primary',
    description,
    delay = 0,
    onClick,
}: StatCardProps) {
    const colorClasses = {
        success: {
            bg: 'bg-[var(--palette-green)]/10',
            border: 'border-[var(--palette-green)]/20',
            icon: 'text-[var(--palette-green)]',
            gradient:
                'from-[var(--palette-green)] to-[var(--palette-chartreuse)]',
        },
        warning: {
            bg: 'bg-[var(--palette-sunflower)]/10',
            border: 'border-[var(--palette-sunflower)]/20',
            icon: 'text-[var(--palette-sunflower)]',
            gradient:
                'from-[var(--palette-sunflower)] to-[var(--palette-yellow-green)]',
        },
        info: {
            bg: 'bg-[var(--palette-limelight)]/10',
            border: 'border-[var(--palette-limelight)]/20',
            icon: 'text-[var(--palette-limelight)]',
            gradient:
                'from-[var(--palette-limelight)] to-[var(--palette-chartreuse)]',
        },
        locked: {
            bg: 'bg-[var(--palette-yellow-green)]/10',
            border: 'border-[var(--palette-yellow-green)]/20',
            icon: 'text-[var(--palette-yellow-green)]',
            gradient:
                'from-[var(--palette-yellow-green)] to-[var(--palette-green)]',
        },
        primary: {
            bg: 'bg-[var(--palette-chartreuse)]/10',
            border: 'border-[var(--palette-chartreuse)]/20',
            icon: 'text-[var(--palette-chartreuse)]',
            gradient:
                'from-[var(--palette-chartreuse)] to-[var(--palette-limelight)]',
        },
    };

    const colorClass = colorClasses[color];

    return (
        <motion.div
            className={`rounded-xl border backdrop-blur-sm ${colorClass.border} ${colorClass.bg} cursor-pointer p-6 transition-all duration-200 hover:shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay,
                duration: 0.4,
                ease: 'easeOut',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                        {title}
                    </p>

                    <div className="flex items-baseline gap-2">
                        <motion.span
                            className={`bg-linear-to-r text-3xl font-bold md:text-4xl ${colorClass.gradient} bg-clip-text text-transparent`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: delay + 0.1,
                                duration: 0.5,
                                type: 'spring',
                            }}
                        >
                            {typeof value === 'number' && value > 999
                                ? `${(value / 1000).toFixed(1)}k`
                                : value}
                        </motion.span>

                        {trend && (
                            <motion.div
                                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                                    trend.isPositive
                                        ? 'bg-[--palette-green]/20 text-[--palette-green]'
                                        : 'bg-[--palette-sunflower]/20 text-[--palette-sunflower]'
                                }`}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: delay + 0.2,
                                    duration: 0.4,
                                }}
                            >
                                {trend.isPositive ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {trend.value}%
                            </motion.div>
                        )}
                    </div>

                    {description && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {icon && (
                    <motion.div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br ${colorClass.gradient} ml-4 p-3 text-white`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            delay: delay + 0.1,
                            duration: 0.5,
                            type: 'spring',
                        }}
                    >
                        {icon}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
