import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useMemo } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    role?: 'student' | 'teacher' | 'admin';
    userName?: string;
}

export default function PageHeader({
    title,
    subtitle,
    icon,
    role,
    userName,
}: PageHeaderProps) {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return 'Good morning';
        }

        if (hour < 18) {
            return 'Good afternoon';
        }

        return 'Good evening';
    }, []);

    const roleColors = {
        student: 'from-(--palette-limelight) to-(--palette-chartreuse)',
        teacher: 'from-(--palette-yellow-green) to-(--palette-green)',
        admin: 'from-(--palette-sunflower) to-(--palette-green)',
    };

    const roleBgColors = {
        student: 'bg-(--palette-limelight)/10',
        teacher: 'bg-(--palette-yellow-green)/10',
        admin: 'bg-(--palette-sunflower)/10',
    };

    const roleBorderColors = {
        student: 'border-(--palette-limelight)/30',
        teacher: 'border-(--palette-yellow-green)/30',
        admin: 'border-(--palette-sunflower)/30',
    };

    return (
        <motion.div
            className="mb-8 space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Gradient Banner */}
            <div
                className={`rounded-xl bg-linear-to-r ${role ? roleColors[role] : 'from-(--palette-chartreuse) to-(--palette-green)'} overflow-hidden p-px`}
            >
                <div
                    className={`rounded-xl ${role ? roleBgColors[role] : 'bg-white'} p-6 backdrop-blur-sm md:p-8`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="mb-3 flex items-center gap-3"
                            >
                                {icon && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.2,
                                            type: 'spring',
                                        }}
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                            role
                                                ? roleBgColors[role]
                                                : 'bg-(--palette-limelight)/20'
                                        }`}
                                    >
                                        {icon}
                                    </motion.div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {greeting}
                                    </p>
                                    {role && (
                                        <p className="text-xs text-muted-foreground/70 capitalize">
                                            {role} dashboard
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.h1
                                className="bg-linear-to-r from-(--palette-green) to-(--palette-chartreuse) bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {title}
                            </motion.h1>

                            {subtitle && (
                                <motion.p
                                    className="mt-2 text-sm text-muted-foreground md:text-base"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                        </div>

                        {/* Time Display */}
                        <motion.div
                            className={`hidden flex-col items-end gap-2 rounded-lg p-3 md:flex ${role ? roleBgColors[role] : 'bg-(--palette-limelight)/10'} border ${role ? roleBorderColors[role] : 'border-(--palette-limelight)/20'}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <Clock className="h-4 w-4 text-(--palette-green)" />
                            <div className="text-right">
                                <p className="text-lg font-bold text-foreground">
                                    {new Date().toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date().toLocaleDateString('en-US', {
                                        weekday: 'short',
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* User Info */}
            {userName && (
                <motion.div
                    className="flex items-center justify-between px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <p className="text-sm text-muted-foreground">
                        Welcome back,{' '}
                        <span className="font-semibold text-foreground">
                            {userName}
                        </span>
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
