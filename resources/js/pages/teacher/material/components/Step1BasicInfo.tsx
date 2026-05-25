import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    Clock,
    Layers,
    Layout,
    Lightbulb,
    Target,
    Users,
    Search,
    ChevronDown,
    Plus,
    Trash2,
    FileText,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

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

interface AccordionSectionProps {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    isOpen: boolean;
    onToggle: () => void;
    hasError?: boolean;
    children: React.ReactNode;
}

const AccordionSection = ({
    title,
    description,
    icon: Icon,
    isOpen,
    onToggle,
    hasError,
    children,
}: AccordionSectionProps) => {
    return (
        <motion.div
            className={cn(
                "rounded-2xl border bg-white p-6 md:p-8 shadow-sm transition-all duration-300",
                isOpen 
                    ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5" 
                    : hasError 
                        ? "border-red-200 hover:border-red-300 bg-red-50/5" 
                        : "border-(--palette-limelight)/20 hover:border-(--palette-green)/20"
            )}
            variants={itemVariants}
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-start justify-between gap-4 text-left focus:outline-none group"
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                        "rounded-xl border p-3.5 shadow-sm transition-colors",
                        isOpen 
                            ? "border-(--palette-green)/10 bg-(--palette-green)/8 text-(--palette-green)" 
                            : hasError
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-(--palette-limelight)/20 bg-gray-50 text-muted-foreground group-hover:text-foreground"
                    )}>
                        <Icon className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className={cn(
                                "text-lg md:text-xl font-bold tracking-tight",
                                hasError ? "text-red-600" : "text-foreground"
                            )}>
                                {title}
                            </h3>
                            {hasError && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100 uppercase tracking-wider animate-pulse">
                                    Error
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs md:text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 pt-2 text-muted-foreground/60 group-hover:text-foreground">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-5 w-5" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function Step1BasicInfo({
    formData,
    errors,
    classrooms,
    prerequisites,
    difficultyLevels,
    setFieldValue,
}: Step1BasicInfoProps) {
    const [classroomSearch, setClassroomSearch] = useState('');
    const [prerequisiteSearch, setPrerequisiteSearch] = useState('');

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        target: true,
        objectives: false,
        level: false,
        timeline: false,
    });

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getError = (field: string) => errors[field]?.[0];

    const hasTargetErrors = useMemo(() => {
        return !!(errors.title || errors.classroom_id || errors.description || errors.summary);
    }, [errors]);

    const hasObjectivesErrors = useMemo(() => {
        return !!errors.learning_objectives;
    }, [errors]);

    const hasLevelErrors = useMemo(() => {
        return !!errors.difficulty_level;
    }, [errors]);

    const hasTimelineErrors = useMemo(() => {
        return !!(errors.started_at || errors.finished_at);
    }, [errors]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setOpenSections((prev) => {
                const next = { ...prev };
                if (errors.title || errors.classroom_id || errors.description || errors.summary) {
                    next.target = true;
                }
                if (errors.learning_objectives) {
                    next.objectives = true;
                }
                if (errors.difficulty_level) {
                    next.level = true;
                }
                if (errors.started_at || errors.finished_at) {
                    next.timeline = true;
                }
                return next;
            });
        }
    }, [errors]);

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

    const filteredClassrooms = useMemo(() => {
        if (!classroomSearch) {
            return classrooms;
        }

        return classrooms.filter((c) =>
            c.name.toLowerCase().includes(classroomSearch.toLowerCase()),
        );
    }, [classrooms, classroomSearch]);

    const filteredPrerequisites = useMemo(() => {
        if (!prerequisiteSearch) {
            return prerequisites;
        }

        return prerequisites.filter((p) =>
            p.title.toLowerCase().includes(prerequisiteSearch.toLowerCase()),
        );
    }, [prerequisites, prerequisiteSearch]);

    const handleAddObjective = () => {
        setFieldValue('learning_objectives', [...formData.learning_objectives, '']);
    };

    const handleObjectiveChange = (index: number, value: string) => {
        const updated = [...formData.learning_objectives];
        updated[index] = value;
        setFieldValue('learning_objectives', updated);
    };

    const handleRemoveObjective = (index: number) => {
        const updated = formData.learning_objectives.filter((_, i) => i !== index);
        setFieldValue('learning_objectives', updated.length > 0 ? updated : ['']);
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Accordion 1: Target & Identitas */}
            <AccordionSection
                id="target"
                title="Target & Identitas"
                description="Tentukan kelas tujuan, berikan judul material yang deskriptif, deskripsi lengkap, serta ringkasan materi."
                icon={Target}
                isOpen={openSections.target}
                onToggle={() => toggleSection('target')}
                hasError={hasTargetErrors}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Judul Material */}
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
                                    onChange={(e) => setFieldValue('title', e.target.value)}
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

                        {/* Pilih Kelas */}
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
                                value={formData.classroom_id?.toString() || ''}
                                onValueChange={(value) =>
                                    setFieldValue('classroom_id', parseInt(value, 10))
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
                                    {classrooms.length > 5 && (
                                        <div className="mb-2 border-b border-(--palette-limelight)/10 p-2">
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                                                <input
                                                    type="text"
                                                    placeholder="Cari kelas..."
                                                    value={classroomSearch}
                                                    onChange={(e) => setClassroomSearch(e.target.value)}
                                                    className="w-full rounded-lg bg-(--palette-limelight)/5 py-1.5 pr-3 pl-8 text-[11px] focus:ring-1 focus:ring-(--palette-green) focus:outline-none"
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="max-h-48 overflow-y-auto">
                                        {filteredClassrooms.length > 0 ? (
                                            filteredClassrooms.map((classroom) => (
                                                <SelectItem
                                                    key={classroom.id}
                                                    value={classroom.id.toString()}
                                                    className="mb-1 cursor-pointer rounded-xl px-4 py-3 transition-colors last:mb-0 focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                                >
                                                    <span className="font-semibold">{classroom.name}</span>
                                                    <span className="ml-2 text-[10px] font-bold tracking-wider uppercase opacity-60">
                                                        ({classroom.academic_year})
                                                    </span>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center text-xs text-muted-foreground">
                                                Kelas tidak ditemukan
                                            </div>
                                        )}
                                    </div>
                                </SelectContent>
                            </Select>
                            {getError('classroom_id') && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {getError('classroom_id')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi Lengkap */}
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
                            onChange={(e) => setFieldValue('description', e.target.value)}
                            placeholder="Jelaskan tujuan pembelajaran, topik utama, dan apa yang diharapkan dari siswa..."
                            className={cn(
                                'min-h-36 w-full resize-none rounded-lg border border-(--palette-limelight)/20 bg-white px-4 py-3 text-sm leading-relaxed transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none',
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

                    {/* Ringkasan Materi (Summary) */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="summary"
                            className="flex items-center gap-2 text-sm font-bold text-foreground"
                        >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Ringkasan Materi <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            id="summary"
                            value={formData.summary}
                            onChange={(e) => setFieldValue('summary', e.target.value)}
                            placeholder="Tuliskan ringkasan materi secara singkat untuk memberikan gambaran umum kepada siswa..."
                            className={cn(
                                'min-h-32 w-full resize-none rounded-lg border border-(--palette-limelight)/20 bg-white px-4 py-3 text-sm leading-relaxed transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none',
                                getError('summary') &&
                                    'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            )}
                            maxLength={2000}
                        />
                        <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                {formData.summary.length}/2000 Karakter
                            </p>
                            {getError('summary') && (
                                <p className="text-xs font-medium text-red-500">
                                    {getError('summary')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionSection>

            {/* Accordion 2: Tujuan Pembelajaran (NEW) */}
            <AccordionSection
                id="objectives"
                title="Tujuan Pembelajaran"
                description="Buat tujuan pembelajaran yang spesifik untuk material ini. Jumlahnya dapat disesuaikan dengan kebutuhan Anda secara dinamis."
                icon={Lightbulb}
                isOpen={openSections.objectives}
                onToggle={() => toggleSection('objectives')}
                hasError={hasObjectivesErrors}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-foreground">
                            Daftar Tujuan Pembelajaran <span className="text-red-500">*</span>
                        </Label>
                        <button
                            type="button"
                            onClick={handleAddObjective}
                            className="flex items-center gap-1.5 rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 px-3.5 py-2 text-xs font-bold text-(--palette-green) transition-colors hover:bg-(--palette-green)/10 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Tujuan
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.learning_objectives.map((objective, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="mt-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-(--palette-green)/10 text-xs font-bold text-(--palette-green) border border-(--palette-green)/20">
                                    {index + 1}
                                </div>
                                <div className="flex-1 relative">
                                    <Input
                                        value={objective}
                                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                        placeholder={`Contoh: Mampu merancang skema sirkuit logika sederhana`}
                                        className={cn(
                                            'h-12 rounded-lg border-(--palette-limelight)/20 px-4 pr-12 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20',
                                            getError('learning_objectives') && !objective.trim() &&
                                                'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                                        )}
                                        maxLength={255}
                                    />
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[9px] font-bold tracking-tighter text-muted-foreground/30 uppercase">
                                        {objective.length}/255
                                    </div>
                                </div>
                                {formData.learning_objectives.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveObjective(index)}
                                        className="mt-1 shrink-0 rounded-xl p-2.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {getError('learning_objectives') && (
                        <p className="text-xs font-medium text-red-500">
                            {getError('learning_objectives')}
                        </p>
                    )}
                </div>
            </AccordionSection>

            {/* Accordion 3: Level & Prasyarat */}
            <AccordionSection
                id="level"
                title="Level & Prasyarat"
                description="Tentukan tingkat kesulitan dan prasyarat sebelum memulai material ini."
                icon={Layers}
                isOpen={openSections.level}
                onToggle={() => toggleSection('level')}
                hasError={hasLevelErrors}
            >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Tingkat Kesulitan */}
                    <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            Tingkat Kesulitan <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-3">
                            {difficultyLevels.map((level) => {
                                const config =
                                    (difficultyConfig as any)[level.value] ||
                                    difficultyConfig[1];
                                const isActive = formData.difficulty_level === level.value;

                                return (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() => setFieldValue('difficulty_level', level.value)}
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

                    {/* Material Prasyarat */}
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
                            value={formData.prerequisite_material_id?.toString() || 'none'}
                            onValueChange={(value) =>
                                setFieldValue(
                                    'prerequisite_material_id',
                                    value === 'none' ? null : parseInt(value, 10),
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
                                {prerequisites.length > 5 && (
                                    <div className="mb-2 border-b border-(--palette-limelight)/10 p-2">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                                            <input
                                                type="text"
                                                placeholder="Cari material..."
                                                value={prerequisiteSearch}
                                                onChange={(e) => setPrerequisiteSearch(e.target.value)}
                                                className="w-full rounded-lg bg-(--palette-limelight)/5 py-1.5 pr-3 pl-8 text-[11px] focus:ring-1 focus:ring-(--palette-green) focus:outline-none"
                                                onKeyDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="max-h-48 overflow-y-auto">
                                    <SelectItem
                                        value="none"
                                        className="mb-1 cursor-pointer rounded-xl px-4 py-3 font-semibold transition-colors last:mb-0 focus:bg-gray-100"
                                    >
                                        Tidak Ada Prasyarat
                                    </SelectItem>
                                    {filteredPrerequisites.length > 0 ? (
                                        filteredPrerequisites.map((material) => (
                                            <SelectItem
                                                key={material.id}
                                                value={material.id.toString()}
                                                className="mb-1 cursor-pointer rounded-xl px-4 py-3 font-semibold transition-colors last:mb-0 focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                            >
                                                {material.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="py-4 text-center text-xs text-muted-foreground">
                                            Material tidak ditemukan
                                        </div>
                                    )}
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </AccordionSection>

            {/* Accordion 4: Penjadwalan */}
            <AccordionSection
                id="timeline"
                title="Penjadwalan"
                description="Atur rentang waktu ketersediaan materi untuk dipelajari oleh siswa."
                icon={Calendar}
                isOpen={openSections.timeline}
                onToggle={() => toggleSection('timeline')}
                hasError={hasTimelineErrors}
            >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Tanggal Mulai */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="started_at"
                            className="flex items-center gap-2 text-sm font-bold text-foreground"
                        >
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Tanggal Mulai <span className="text-red-500">*</span>
                        </Label>
                        <div className="group relative">
                            <Input
                                id="started_at"
                                type="date"
                                value={formData.started_at || ''}
                                onChange={(e) => setFieldValue('started_at', e.target.value || null)}
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

                    {/* Tanggal Selesai */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="finished_at"
                            className="flex items-center gap-2 text-sm font-bold text-foreground"
                        >
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Tanggal Selesai <span className="text-red-500">*</span>
                        </Label>
                        <div className="group relative">
                            <Input
                                id="finished_at"
                                type="date"
                                value={formData.finished_at || ''}
                                onChange={(e) => setFieldValue('finished_at', e.target.value || null)}
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
            </AccordionSection>

            {/* Tips/Info Footer */}
            <motion.div
                className="flex items-start gap-4 rounded-2xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-6"
                variants={itemVariants}
            >
                <div className="shrink-0 rounded-xl border border-(--palette-limelight)/20 bg-white p-3 text-(--palette-green) shadow-sm">
                    <Lightbulb className="h-6 w-6" />
                </div>
                <div className="text-sm leading-relaxed">
                    <p className="mb-1 font-bold text-foreground">Tips Penjadwalan & Prasyarat</p>
                    <p className="text-muted-foreground">
                        Siswa hanya dapat mengakses material ini jika sudah melewati Tanggal Mulai dan telah menyelesaikan material
                        prasyarat yang ditentukan. Pastikan rentang waktu yang diberikan cukup bagi siswa untuk berkolaborasi dalam
                        kelompok.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
