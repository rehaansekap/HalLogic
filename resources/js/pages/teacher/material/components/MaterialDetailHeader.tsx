import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    BookOpen,
    Edit2,
    GraduationCap,
    Sparkles,
    Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/teacher';
import { edit } from '@/routes/teacher/materials';
import DeleteMaterialButton from '@/pages/teacher/material/components/DeleteMaterialButton';

interface MaterialDetailHeaderProps {
    material: {
        id: number;
        title: string;
        description: string;
        difficulty_level: number;
        slug: string;
    };
}

const difficultyConfig: Record<
    number,
    { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
    1: {
        label: 'Mudah',
        color: 'text-(--palette-green)',
        bg: 'bg-(--palette-green)/15 border-(--palette-green)/30',
        icon: <Sparkles className="h-3.5 w-3.5" />,
    },
    2: {
        label: 'Sedang',
        color: 'text-(--palette-sunflower)',
        bg: 'bg-(--palette-sunflower)/15 border-(--palette-sunflower)/30',
        icon: <Zap className="h-3.5 w-3.5" />,
    },
    3: {
        label: 'Sulit',
        color: 'text-red-500',
        bg: 'bg-red-500/15 border-red-500/30',
        icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
    4: {
        label: 'Expert',
        color: 'text-orange-500',
        bg: 'bg-orange-500/15 border-orange-500/30',
        icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
    5: {
        label: 'Master',
        color: 'text-purple-500',
        bg: 'bg-purple-500/15 border-purple-500/30',
        icon: <GraduationCap className="h-3.5 w-3.5" />,
    },
};

export default function MaterialDetailHeader({
    material,
}: MaterialDetailHeaderProps) {
    const difficulty =
        difficultyConfig[Number(material.difficulty_level)] ?? difficultyConfig[1];

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Back Button */}
            <Link href={dashboard.url()}>
                <Button
                    variant="ghost"
                    size="sm"
                    className="group gap-2 text-muted-foreground hover:text-foreground transition-all"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Kembali ke Dashboard
                </Button>
            </Link>

            {/* Header Card */}
            <div className="rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 p-6 backdrop-blur-sm md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: 'spring',
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--palette-green)/10"
                            >
                                <BookOpen className="h-5 w-5 text-(--palette-green)" />
                            </motion.div>

                            <motion.h1
                                className="text-2xl font-bold text-foreground md:text-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {material.title}
                            </motion.h1>

                            {/* Difficulty Badge */}
                            <motion.span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${difficulty.bg} ${difficulty.color}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {difficulty.icon}
                                {difficulty.label}
                            </motion.span>
                        </div>

                        {material.description && (
                            <motion.p
                                className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                {material.description}
                            </motion.p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href={edit.url(material.slug)}>
                            <Button
                                size="sm"
                                className="bg-(--palette-green) font-bold text-white hover:bg-(--palette-green)/90 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-(--palette-green)/20"
                            >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>

                        <DeleteMaterialButton
                            materialId={material.id}
                            materialTitle={material.title}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
