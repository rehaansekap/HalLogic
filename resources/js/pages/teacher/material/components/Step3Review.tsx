import { motion } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Edit3,
    FileText,
    Info,
    Layers,
    Link,
    MessageSquare,
    Play,
    Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { MaterialFormData } from '@/hooks/useMaterialForm';

import { cn } from '@/lib/utils';

import type { Classroom, MaterialOption } from './MaterialFormStepper';

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

const ReviewSection = ({
    icon: Icon,
    title,
    step,
    children,
    onEditStep,
}: {
    icon: any;
    title: string;
    step: number;
    children: React.ReactNode;
    onEditStep: (step: number) => void;
}) => (
    <div className="overflow-hidden rounded-2xl border border-(--palette-limelight)/20 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between border-b border-(--palette-limelight)/10 bg-(--palette-limelight)/5 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-(--palette-green)/10 p-2 text-(--palette-green)">
                    <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-foreground tracking-tight">{title}</h3>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(step)}
                className="flex h-8 gap-1.5 rounded-lg text-xs font-bold text-(--palette-green) hover:bg-(--palette-green)/10 transition-colors"
            >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
            </Button>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const InfoRow = ({
    label,
    value,
    icon: Icon,
    isFullWidth = false,
}: {
    label: string;
    value: string | null | undefined;
    icon?: any;
    isFullWidth?: boolean;
}) => (
    <div className={cn("flex flex-col gap-1.5", isFullWidth ? "col-span-full" : "")}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            {label}
        </p>
        <div className="flex items-start gap-2.5">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />}
            <p className={cn(
                "text-sm font-semibold text-foreground leading-relaxed",
                !value && "text-muted-foreground/40 italic"
            )}>
                {value || 'Tidak diatur'}
            </p>
        </div>
    </div>
);

interface Step3ReviewProps {
    formData: MaterialFormData;
    classrooms: Classroom[];
    prerequisites: MaterialOption[];
    difficultyLevels: Array<{ value: number; label: string }>;
    onEditStep: (step: number) => void;
}

export default function Step3Review({
    formData,
    classrooms,
    prerequisites,
    difficultyLevels,
    onEditStep,
}: Step3ReviewProps) {
    const classroomName =
        classrooms.find((c) => c.id === formData.classroom_id)?.name ||
        'Tidak terpilih';
    const difficultyLabel =
        difficultyLevels.find((l) => l.value === formData.difficulty_level)
            ?.label || 'Tidak terpilih';
    const prerequisiteTitle =
        prerequisites.find((p) => p.id === formData.prerequisite_material_id)
            ?.title || 'Tidak Ada';

    return (
        <motion.div
            className="space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="rounded-2xl border border-(--palette-limelight)/20 bg-white p-8 shadow-sm"
                variants={itemVariants}
            >
                <div className="grid grid-cols-1 gap-8">
                {/* Basic Info Section */}
                    <ReviewSection
                        icon={Info}
                        title="Informasi Dasar"
                        step={1}
                        onEditStep={onEditStep}
                    >
                        <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
                            <InfoRow
                                label="Judul Material"
                                value={formData.title}
                                isFullWidth
                            />
                            <InfoRow
                                label="Kelas"
                                value={classroomName}
                                icon={Users}
                            />
                            <InfoRow
                                label="Tingkat Kesulitan"
                                value={difficultyLabel}
                                icon={Layers}
                            />
                            <InfoRow
                                label="Material Prasyarat"
                                value={prerequisiteTitle}
                                icon={BookOpen}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InfoRow
                                    label="Tanggal Mulai"
                                    value={formData.started_at}
                                    icon={Calendar}
                                />
                                <InfoRow
                                    label="Tanggal Selesai"
                                    value={formData.finished_at}
                                    icon={Calendar}
                                />
                            </div>
                            <InfoRow
                                label="Deskripsi Lengkap"
                                value={formData.description}
                                isFullWidth
                            />
                        </div>
                    </ReviewSection>

                {/* Learning Resources Section */}
                    <ReviewSection
                        icon={BookOpen}
                        title="Sumber Pembelajaran"
                        step={2}
                        onEditStep={onEditStep}
                    >
                        <div className="grid grid-cols-1 gap-10">
                            <div>
                                <InfoRow
                                    label="URL Video YouTube"
                                    value={formData.video_url}
                                    icon={Link}
                                />
                                {formData.video_url && (
                                    <div className="min-w-full min-h-auto mt-4 flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-(--palette-limelight)/20 bg-gray-50/50 text-muted-foreground transition-colors hover:bg-white hover:border-(--palette-green)/30">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-3 rounded-full bg-white shadow-sm border border-(--palette-limelight)/10 text-(--palette-green)">
                                                <Play className="h-5 w-5 fill-current" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                                Video Orientasi Tersedia
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <InfoRow
                                        label="Dokumen PDF"
                                        value={
                                            formData.material_pdf?.name ||
                                            formData.material_pdf_existing ||
                                            'Tidak ada file'
                                        }
                                        icon={FileText}
                                    />
                                    {(formData.material_pdf || formData.material_pdf_existing) && (
                                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--palette-green)/10 text-(--palette-green) text-[10px] font-bold uppercase tracking-wider border border-(--palette-green)/20">
                                            <FileText className="h-3 w-3" />
                                            <span>PDF Aktif</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <InfoRow
                                        label="Narasi Kasus"
                                        value={formData.case_narrative}
                                        icon={MessageSquare}
                                    />
                                </div>
                            </div>
                        </div>
                    </ReviewSection>
                </div>
            </motion.div>

            {/* Publication Warning */}
            <motion.div
                className="flex items-start gap-4 rounded-2xl border border-(--palette-green)/20 bg-(--palette-green)/10 p-6"
                variants={itemVariants}
            >
                <div className="shrink-0 rounded-xl bg-white p-3 text-(--palette-green) shadow-sm border border-(--palette-green)/20">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="mb-1 font-bold text-foreground">
                        Siap untuk publikasi?
                    </h4>
                    <p className="leading-relaxed text-sm text-muted-foreground">
                        Dengan menekan tombol simpan, material ini akan dapat
                        diakses oleh siswa di kelas yang telah dipilih sesuai
                        dengan jadwal yang ditentukan. Pastikan semua informasi
                        sudah benar.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
