import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6 md:p-10">
            {/* Gradient Background - using color palette */}
            <div className="absolute inset-0 -z-10">
                <div className="animate-gradient-shift absolute inset-0 bg-[linear-gradient(135deg,var(--palette-limelight)_0%,var(--palette-chartreuse)_25%,var(--palette-white)_50%,var(--palette-yellow-green)_75%,var(--palette-limelight)_100%)] bg-size-[200%_200%] opacity-[0.05]" />
                {/* Secondary gradient overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,128,0,0.02))]" />
            </div>

            <motion.div
                className="w-full max-w-sm"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="flex flex-col gap-8"
                    variants={itemVariants}
                >
                    <motion.div
                        className="flex flex-col items-center gap-4"
                        variants={itemVariants}
                    >
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium transition-transform hover:scale-110"
                        >
                            <motion.div
                                className="mb-1 flex h-9 w-9 items-center justify-center rounded-md bg-linear-to-br from-(--palette-limelight) to-(--palette-chartreuse)"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <AppLogoIcon className="size-9 fill-current text-(--palette-white)" />
                            </motion.div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <motion.div
                            className="space-y-2 text-center"
                            variants={itemVariants}
                        >
                            <h1 className="bg-linear-to-r from-(--palette-green) to-(--palette-chartreuse) bg-clip-text text-2xl font-bold text-transparent">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </motion.div>
                    </motion.div>
                    <motion.div variants={itemVariants}>{children}</motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
