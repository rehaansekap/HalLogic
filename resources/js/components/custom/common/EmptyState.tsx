import { motion } from 'framer-motion';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    delay?: number;
}

export default function EmptyState({
    icon,
    title,
    description,
    action,
    delay = 0,
}: EmptyStateProps) {
    return (
        <motion.div
            className="rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay,
                duration: 0.4,
            }}
        >
            {icon && (
                <motion.div
                    className="mb-4 flex justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: delay + 0.1,
                        type: 'spring',
                        stiffness: 100,
                    }}
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--palette-chartreuse) text-white">
                        {icon}
                    </div>
                </motion.div>
            )}

            <motion.h3
                className="mb-2 text-lg font-bold text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: delay + 0.15,
                    duration: 0.4,
                }}
            >
                {title}
            </motion.h3>

            {description && (
                <motion.p
                    className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: delay + 0.2,
                        duration: 0.4,
                    }}
                >
                    {description}
                </motion.p>
            )}

            {action && (
                <motion.button
                    className="rounded-lg bg-(--palette-green) px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: delay + 0.25,
                        duration: 0.4,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    );
}
