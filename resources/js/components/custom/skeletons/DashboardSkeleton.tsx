import { motion } from 'framer-motion';

interface DashboardSkeletonProps {
    role?: 'student' | 'teacher' | 'admin';
}

export default function DashboardSkeleton({
    role = 'student',
}: DashboardSkeletonProps) {
    const statCards = role === 'admin' || role === 'teacher' ? 4 : 2;

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header Skeleton */}
            <div className="mb-8 space-y-4">
                <div className="rounded-xl border border-(--palette-chartreuse)/10 bg-(--palette-chartreuse)/8 p-6 md:p-8">
                    <div className="space-y-3">
                        <div className="animate-pulse-soft h-4 w-32 rounded-full bg-(--palette-limelight)/20" />
                        <div className="animate-pulse-soft h-8 w-64 rounded-full bg-(--palette-green)/20" />
                        <div className="animate-pulse-soft h-4 w-96 rounded-full bg-(--palette-yellow-green)/20" />
                    </div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div
                className={`grid grid-cols-1 gap-4 md:gap-6 ${statCards >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-2'} ${statCards === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}
            >
                {Array.from({ length: statCards }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="rounded-xl border border-(--palette-limelight)/10 bg-(--palette-limelight)/5 p-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: i * 0.1,
                            duration: 0.4,
                        }}
                    >
                        <div className="space-y-4">
                            <div className="animate-pulse-soft h-4 w-24 rounded-full bg-(--palette-yellow-green)/20" />
                            <div className="flex items-end justify-between">
                                <div className="animate-pulse-soft h-8 w-32 rounded-full bg-(--palette-green)/20" />
                                <div className="animate-pulse-soft h-10 w-10 rounded-lg bg-(--palette-chartreuse)/20" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Skeleton */}
            <div className="mt-8 space-y-4">
                <div className="animate-pulse-soft h-6 w-48 rounded-full bg-(--palette-green)/20" />

                <div className="overflow-hidden rounded-xl border border-(--palette-yellow-green)/10">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="border-b border-(--palette-limelight)/10 p-4 last:border-b-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                delay: 0.4 + i * 0.05,
                                duration: 0.3,
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="animate-pulse-soft h-10 w-10 shrink-0 rounded-full bg-(--palette-chartreuse)/20" />
                                <div className="flex-1 space-y-2">
                                    <div className="animate-pulse-soft h-4 w-40 rounded-full bg-(--palette-green)/20" />
                                    <div className="animate-pulse-soft h-3 w-32 rounded-full bg-(--palette-yellow-green)/20" />
                                </div>
                                <div className="animate-pulse-soft h-4 w-16 shrink-0 rounded-full bg-(--palette-limelight)/20" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
