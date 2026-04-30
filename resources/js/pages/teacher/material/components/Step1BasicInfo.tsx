import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Clock,
    Layers,
    Layout,
    Lightbulb,
    Target,
    Users,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { cn } from '@/lib/utils';

import type { Classroom, MaterialOption } from './MaterialFormStepper';

interface Step1BasicInfoProps {
    formData: MaterialFormData;
    errors: Record<string, string[]>;
    classrooms: Classroom[];
    prerequisites: MaterialOption[];
    difficultyLevels: Array<{ value: number; label: string }>;
    setFieldValue: (field: keyof MaterialFormData, value: any) => void;
}

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
    visible: { opacity: 1, y: 0 },
};

const SectionHeader = ({
    icon: Icon,
    title,
    description,
}: {
    icon: any;
    title: string;
    description: string;
}) => (
    <div className="mb-8 flex items-start gap-4">
        <div className="rounded-xl border border-(--palette-green)/10 bg-(--palette-green)/8 p-4 shadow-sm">
            <Icon className="h-6 w-6 text-(--palette-green)" />
        </div>
        <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
);

export default function Step1BasicInfo({
    formData,
    errors,
    classrooms,
    prerequisites,
    difficultyLevels,
    setFieldValue,
}: Step1BasicInfoProps) {
    const getError = (field: string) => errors[field]?.[0];

    const difficultyConfig = {
        1: {
            text: 'text-(--palette-green)',
            bg: 'bg-(--palette-green)/8',
            activeBg: 'bg-(--palette-green)',
            border: 'border-(--palette-green)/30',
            label: 'Mudah',
        },
        2: {
            text: 'text-(--palette-yellow-green)',
            bg: 'bg-(--palette-yellow-green)/8',
            activeBg: 'bg-(--palette-yellow-green)',
            border: 'border-(--palette-yellow-green)/30',
            label: 'Sedang',
        },
        3: {
            text: 'text-(--palette-sunflower)',
            bg: 'bg-(--palette-sunflower)/8',
            activeBg: 'bg-(--palette-sunflower)',
            border: 'border-(--palette-sunflower)/30',
            label: 'Sulit',
        },
    };

    return (
        <motion.div
            className="space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Main Header Card */}
            <motion.div
                className="rounded-2xl border border-(--palette-limelight)/20 bg-white p-8 shadow-sm"
                variants={itemVariants}
            >
                <div className="grid grid-cols-1 gap-10">
                    {/* Target & Identity Section */}
                    <div className="space-y-8">
                        <SectionHeader
                            icon={Target}
                            title="Target & Identitas"
                            description="Tentukan kelas tujuan dan berikan judul material yang deskriptif."
                        />

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="title"
                                    className="flex items-center gap-2 text-sm font-bold text-foreground"
                                >
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    Judul Material{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFieldValue(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Pengantar Pemrograman C"
                                        className={cn(
                                            'h-12 rounded-lg border-(--palette-limelight)/20 px-4 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                            getError('title') &&
                                                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                        )}
                                        maxLength={255}
                                    />
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold tracking-tighter text-muted-foreground/50 uppercase">
                                        {formData.title.length}/255
                                    </div>
                                </div>
                                {getError('title') && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {getError('title')}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="classroom_id"
                                    className="flex items-center gap-2 text-sm font-bold text-foreground"
                                >
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    Pilih Kelas{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={
                                        formData.classroom_id?.toString() || ''
                                    }
                                    onValueChange={(value) =>
                                        setFieldValue(
                                            'classroom_id',
                                            parseInt(value, 10),
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="classroom_id"
                                        className={cn(
                                            'min-h-12 min-w-full rounded-lg border-(--palette-limelight)/20 px-4 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                            getError('classroom_id') &&
                                                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                        )}
                                    >
                                        <SelectValue placeholder="Pilih kelas..." />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-64 rounded-2xl border-(--palette-limelight)/20 bg-white/95 p-2 shadow-2xl backdrop-blur-sm">
                                        {classrooms.map((classroom) => (
                                            <SelectItem
                                                key={classroom.id}
                                                value={classroom.id.toString()}
                                                className="mb-1 cursor-pointer rounded-xl px-4 py-3 transition-colors last:mb-0 focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                            >
                                                <span className="font-semibold">
                                                    {classroom.name}
                                                </span>
                                                <span className="ml-2 text-[10px] font-bold tracking-wider uppercase opacity-60">
                                                    ({classroom.academic_year})
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getError('classroom_id') && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {getError('classroom_id')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="flex items-center gap-2 text-sm font-bold text-foreground"
                            >
                                <Layout className="h-4 w-4 text-muted-foreground" />
                                Deskripsi Lengkap{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFieldValue('description', e.target.value)
                                }
                                placeholder="Jelaskan tujuan pembelajaran, topik utama, dan apa yang diharapkan dari siswa..."
                                className={cn(
                                    'min-h-40 w-full resize-none rounded-lg border border-(--palette-limelight)/20 bg-white px-4 py-3 text-sm leading-relaxed transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none',
                                    getError('description') &&
                                        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                )}
                                maxLength={5000}
                            />
                            <div className="flex items-center justify-between px-1">
                                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    {formData.description.length}/5000 Karakter
                                </p>
                                {getError('description') && (
                                    <p className="text-xs font-medium text-red-500">
                                        {getError('description')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Level & Prerequisite Card */}
            <motion.div
                className="rounded-2xl border border-(--palette-limelight)/20 bg-white p-8 shadow-sm"
                variants={itemVariants}
            >
                <SectionHeader
                    icon={Layers}
                    title="Level & Prasyarat"
                    description="Tentukan tingkat kesulitan dan prasyarat sebelum memulai material ini."
                />

                <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            Tingkat Kesulitan{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-3">
                            {difficultyLevels.map((level) => {
                                const config =
                                    (difficultyConfig as any)[level.value] ||
                                    difficultyConfig[1];
                                const isActive =
                                    formData.difficulty_level === level.value;

                                return (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() =>
                                            setFieldValue(
                                                'difficulty_level',
                                                level.value,
                                            )
                                        }
                                        className={cn(
                                            'group relative min-w-28 flex-1 overflow-hidden rounded-xl border-2 px-4 py-3 transition-all',
                                            isActive
                                                ? `${config.border} ${config.bg} shadow-md shadow-black/5`
                                                : 'border-gray-50 bg-gray-50/50 hover:border-(--palette-limelight)/30 hover:bg-white',
                                        )}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span
                                                className={cn(
                                                    'text-xs font-bold tracking-wider uppercase',
                                                    isActive
                                                        ? config.text
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {level.label}
                                            </span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="difficulty-active"
                                                    className={cn(
                                                        'mt-1 h-1 w-6 rounded-full',
                                                        config.activeBg,
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {getError('difficulty_level') && (
                            <p className="mt-2 text-xs font-medium text-red-500">
                                {getError('difficulty_level')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="prerequisite_material_id"
                            className="flex items-center gap-2 text-sm font-bold text-foreground"
                        >
                            <Target className="h-4 w-4 text-muted-foreground" />
                            Material Prasyarat{' '}
                            <span className="ml-1 text-xs font-medium text-muted-foreground/60">
                                (Opsional)
                            </span>
                        </Label>
                        <Select
                            value={
                                formData.prerequisite_material_id?.toString() ||
                                'none'
                            }
                            onValueChange={(value) =>
                                setFieldValue(
                                    'prerequisite_material_id',
                                    value === 'none'
                                        ? null
                                        : parseInt(value, 10),
                                )
                            }
                        >
                            <SelectTrigger
                                id="prerequisite_material_id"
                                className="min-h-12 w-full rounded-lg border-(--palette-limelight)/20 font-semibold focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20"
                            >
                                <SelectValue placeholder="Pilih material prasyarat..." />
                            </SelectTrigger>
                            <SelectContent className="min-w-64 rounded-2xl border-(--palette-limelight)/20 bg-white/95 p-2 shadow-2xl backdrop-blur-sm">
                                <SelectItem
                                    value="none"
                                    className="mb-1 cursor-pointer rounded-xl px-4 py-3 font-semibold transition-colors last:mb-0 focus:bg-gray-100"
                                >
                                    Tidak Ada Prasyarat
                                </SelectItem>
                                {prerequisites.map((material) => (
                                    <SelectItem
                                        key={material.id}
                                        value={material.id.toString()}
                                        className="mb-1 cursor-pointer rounded-xl px-4 py-3 font-semibold transition-colors last:mb-0 focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                    >
                                        {material.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </motion.div>

            {/* Timeline Card */}
            <motion.div
                className="rounded-2xl border border-(--palette-limelight)/20 bg-white p-8 shadow-sm"
                variants={itemVariants}
            >
                <SectionHeader
                    icon={Calendar}
                    title="Penjadwalan"
                    description="Atur rentang waktu ketersediaan materi untuk dipelajari oleh siswa."
                />

                <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label
                            htmlFor="started_at"
                            className="flex items-center gap-2 text-sm font-bold text-foreground"
                        >
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Tanggal Mulai{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="group relative">
                            <Input
                                id="started_at"
                                type="date"
                                value={formData.started_at || ''}
                                onChange={(e) =>
                                    setFieldValue(
                                        'started_at',
                                        e.target.value || null,
                                    )
                                }
                                className={cn(
                                    'h-12 rounded-lg border-(--palette-limelight)/20 pl-11 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                    getError('started_at') &&
                                        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                )}
                            />
                            <Calendar className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-(--palette-green)" />
                        </div>
                        {getError('started_at') && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {getError('started_at')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="finished_at"
                            className="flex items-center gap-2 text-sm font-bold text-foreground"
                        >
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Tanggal Selesai{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="group relative">
                            <Input
                                id="finished_at"
                                type="date"
                                value={formData.finished_at || ''}
                                onChange={(e) =>
                                    setFieldValue(
                                        'finished_at',
                                        e.target.value || null,
                                    )
                                }
                                className={cn(
                                    'h-12 rounded-lg border-(--palette-limelight)/20 pl-11 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                    getError('finished_at') &&
                                        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                )}
                            />
                            <Calendar className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-(--palette-green)" />
                        </div>
                        {getError('finished_at') && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {getError('finished_at')}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Tips/Info Footer */}
            <motion.div
                className="flex items-start gap-4 rounded-2xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-6"
                variants={itemVariants}
            >
                <div className="shrink-0 rounded-xl border border-(--palette-limelight)/20 bg-white p-3 text-(--palette-green) shadow-sm">
                    <Lightbulb className="h-6 w-6" />
                </div>
                <div className="text-sm leading-relaxed">
                    <p className="mb-1 font-bold text-foreground">
                        Tips Penjadwalan & Prasyarat
                    </p>
                    <p className="text-muted-foreground">
                        Siswa hanya dapat mengakses material ini jika sudah
                        melewati Tanggal Mulai dan telah menyelesaikan material
                        prasyarat yang ditentukan. Pastikan rentang waktu yang
                        diberikan cukup bagi siswa untuk berkolaborasi dalam
                        kelompok.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
