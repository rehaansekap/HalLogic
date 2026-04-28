import { motion } from 'framer-motion';

interface CardSkeletonProps {
    count?: number;
    delay?: number;
}

export default function CardSkeleton({
    count = 3,
    delay = 0,
}: CardSkeletonProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className="space-y-4 rounded-xl border border-(--palette-limelight)/10 bg-white p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: delay + i * 0.1,
                        duration: 0.4,
                    }}
                >
                    <div className="space-y-3">
                        <div className="animate-pulse-soft h-4 w-3/4 rounded-full bg-(--palette-limelight)/20" />
                        <div className="animate-pulse-soft h-3 w-full rounded-full bg-(--palette-yellow-green)/20" />
                        <div className="animate-pulse-soft h-3 w-5/6 rounded-full bg-(--palette-yellow-green)/20" />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <div className="animate-pulse-soft h-6 w-16 rounded-full bg-(--palette-green)/20" />
                        <div className="animate-pulse-soft h-6 w-20 rounded-full bg-(--palette-chartreuse)/20" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
