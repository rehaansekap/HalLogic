import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

interface LevelBarProps {
    currentXp: number;
    nextLevelXp: number;
    level: number;
    totalXp?: number;
    delay?: number;
}

export default function LevelBar({
    currentXp,
    nextLevelXp,
    level,
    totalXp,
    delay = 0,
}: LevelBarProps) {
    const progressPercent = (currentXp / nextLevelXp) * 100;
    const xpNeeded = nextLevelXp - currentXp;

    return (
        <motion.div
            className="rounded-xl border border-(--palette-chartreuse)/30 bg-(--palette-chartreuse)/8 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <div className="space-y-4">
                {/* Header with Level */}
                <div className="flex items-center justify-between">
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + 0.1, duration: 0.4 }}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--palette-sunflower)">
                            <Star className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Level Saat Ini
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                                {level}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-2 rounded-lg border border-(--palette-green)/20 bg-(--palette-green)/10 px-3 py-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + 0.1, duration: 0.4 }}
                    >
                        <TrendingUp className="h-4 w-4 text-(--palette-green)" />
                        <span className="text-xs font-semibold text-(--palette-green)">
                            {currentXp.toLocaleString()} XP
                        </span>
                    </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Progress ke Level {level + 1}
                        </span>
                        <span className="text-xs font-bold text-(--palette-chartreuse)">
                            {progressPercent.toFixed(0)}%
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full border border-(--palette-chartreuse)/20 bg-(--palette-chartreuse)/15">
                        <motion.div
                            className="h-full bg-(--palette-chartreuse)"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{
                                delay: delay + 0.2,
                                duration: 1,
                                ease: 'easeOut',
                            }}
                        />
                    </div>

                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-(--palette-green)">
                            {xpNeeded.toLocaleString()}
                        </span>{' '}
                        XP lagi untuk naik level
                    </p>
                </div>

                {/* Stats Row */}
                {totalXp !== undefined && (
                    <motion.div
                        className="grid grid-cols-3 gap-3 border-t border-(--palette-limelight)/10 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.3, duration: 0.4 }}
                    >
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                Level Saat Ini
                            </p>
                            <p className="text-lg font-bold text-(--palette-green)">
                                {level}
                            </p>
                        </div>
                        <div className="border-r border-l border-(--palette-limelight)/10 text-center">
                            <p className="text-xs text-muted-foreground">
                                XP Saat Ini
                            </p>
                            <p className="text-lg font-bold text-(--palette-chartreuse)">
                                {(currentXp / 1000).toFixed(1)}k
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                Total XP
                            </p>
                            <p className="text-lg font-bold text-(--palette-limelight)">
                                {(totalXp / 1000).toFixed(1)}k
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
