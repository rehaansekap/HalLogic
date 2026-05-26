import { motion } from 'framer-motion';
import {
    AlertCircle,
    Check,
    FileText,
    Play,
    User,
    CheckCircle2,
    Calendar,
    Code2,
    BookOpen,
    Edit3,
    Info,
    Layers,
    Link,
    MessageSquare,
    Users,
    ClipboardList,
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';

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

interface Step4ReviewProps {
    formData: MaterialFormData;
    classrooms: Classroom[];
    prerequisites: MaterialOption[];
    difficultyLevels: Array<{ value: number; label: string }>;
    onEditStep: (step: number) => void;
}

export default function Step4Review({
    formData,
    classrooms,
    prerequisites,
    difficultyLevels,
    onEditStep,
}: Step4ReviewProps) {
    const classroomName =
        classrooms.find((c) => c.id === formData.classroom_id)?.name ||
        'Tidak terpilih';
    const difficultyLabel =
        difficultyLevels.find((l) => l.value === formData.difficulty_level)
            ?.label || 'Tidak terpilih';
    const prerequisiteTitle =
        prerequisites.find((p) => p.id === formData.prerequisite_material_id)
            ?.title || 'Tidak Ada';

    const hasReflections = 
        (formData.pre_reflection_questions && formData.pre_reflection_questions.length > 0) ||
        (formData.post_reflection_questions && formData.post_reflection_questions.length > 0);

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
                            <InfoRow
                                label="Ringkasan Materi"
                                value={formData.summary}
                                isFullWidth
                            />
                            <div className="col-span-full space-y-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Tujuan Pembelajaran
                                </p>
                                {formData.learning_objectives && formData.learning_objectives.length > 0 ? (
                                    <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-(--palette-limelight)/10">
                                        {formData.learning_objectives.map((objective, idx) => (
                                            <div key={idx} className="flex gap-2 text-sm font-semibold text-foreground">
                                                <span className="text-(--palette-green) font-bold shrink-0">{idx + 1}.</span>
                                                <p className="leading-relaxed">{objective}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-semibold text-muted-foreground/40 italic">
                                        Tidak ada tujuan pembelajaran
                                    </p>
                                )}
                            </div>
                        </div>
                    </ReviewSection>

                    {/* Learning Resources Section */}
                    <ReviewSection
                        icon={BookOpen}
                        title="Sumber Pembelajaran & LKPD"
                        step={2}
                        onEditStep={onEditStep}
                    >
                        <div className="grid grid-cols-1 gap-8">
                            {/* Sub Materials Review */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-(--palette-green)" />
                                    <span>Materi Pembelajaran ({formData.sub_materials?.length || 0})</span>
                                </h4>
                                {formData.sub_materials && formData.sub_materials.length > 0 ? (
                                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-(--palette-limelight)/10">
                                        {formData.sub_materials.map((sub, idx) => (
                                            <div key={idx} className="flex gap-3 text-sm border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                                <span className="text-(--palette-green) font-bold shrink-0">{idx + 1}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-bold text-slate-800">{sub.title}</p>
                                                        {(sub.image || sub.image_path) && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-(--palette-green)/10 px-1.5 py-0.5 text-[9px] font-bold text-(--palette-green) uppercase">
                                                                Ilustrasi Gambar
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {sub.content ? sub.content.replace(/<[^>]*>?/gm, '') : 'Tidak ada konten.'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-semibold text-muted-foreground/45 italic pl-6">
                                        Belum ada sub-materi yang ditambahkan
                                    </p>
                                )}
                            </div>

                            {/* Code Examples Review */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                                    <Code2 className="h-4 w-4 text-(--palette-green)" />
                                    <span>Contoh Kode Program ({formData.code_examples?.length || 0})</span>
                                </h4>
                                {formData.code_examples && formData.code_examples.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.code_examples.map((ex, idx) => (
                                            <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-(--palette-limelight)/10 space-y-2">
                                                <p className="font-bold text-xs text-slate-800 uppercase tracking-wider">{ex.title || `Contoh ${idx + 1}`}</p>
                                                <div className="rounded overflow-hidden border border-(--palette-limelight)/10 min-h-[96px]">
                                                    <Editor
                                                        height="96px"
                                                        language="c"
                                                        theme="vs-dark"
                                                        value={ex.code}
                                                        options={{
                                                            readOnly: true,
                                                            minimap: { enabled: false },
                                                            fontSize: 10,
                                                            lineNumbers: 'on',
                                                            scrollBeyondLastLine: false,
                                                            wordWrap: 'on',
                                                            padding: { top: 8, bottom: 8 },
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    <strong>Output:</strong> <code className="bg-slate-100 px-1 rounded font-mono text-[10px]">{ex.output}</code>
                                                </div>
                                                <div 
                                                    className="text-xs text-slate-600 line-clamp-2 max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4"
                                                    dangerouslySetInnerHTML={{ __html: ex.explanation }} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-semibold text-muted-foreground/45 italic pl-6">
                                        Tidak ada contoh kode program yang ditambahkan
                                    </p>
                                )}
                            </div>

                            {/* LKPD & Media Review */}
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                                    <Play className="h-4 w-4 text-(--palette-green)" />
                                    <span>LKPD & Media</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 p-4 rounded-xl border border-(--palette-limelight)/10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">File LKPD</span>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mt-1">
                                            <FileText className="h-4 w-4 text-amber-600" />
                                            <span className="truncate max-w-40">{formData.material_pdf?.name || formData.material_pdf_existing || 'Belum diunggah'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Video (YouTube / Google Drive)</span>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mt-1">
                                            <Link className="h-4 w-4 text-blue-600" />
                                            <span className="truncate max-w-40">{formData.video_url || 'Tidak disertakan'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Narasi Kasus</span>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{formData.case_narrative || 'Tidak disertakan'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ReviewSection>

                    {/* Reflections Section (NEW) */}
                    <ReviewSection
                        icon={MessageSquare}
                        title="Refleksi Pembelajaran"
                        step={3}
                        onEditStep={onEditStep}
                    >
                        {hasReflections ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Refleksi Awal */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                        <MessageSquare className="h-4 w-4 text-(--palette-green)" />
                                        <span>Refleksi Awal ({formData.pre_reflection_questions?.length || 0})</span>
                                    </div>
                                    {formData.pre_reflection_questions && formData.pre_reflection_questions.length > 0 ? (
                                        <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-(--palette-limelight)/10">
                                            {formData.pre_reflection_questions.map((question, idx) => (
                                                <div key={idx} className="flex gap-2 text-sm font-semibold text-foreground">
                                                    <span className="text-(--palette-green) font-bold shrink-0">{idx + 1}.</span>
                                                    <p className="leading-relaxed">{question}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm font-semibold text-muted-foreground/45 italic pl-6">
                                            Tidak ada pertanyaan refleksi awal yang dikonfigurasi
                                        </p>
                                    )}
                                </div>

                                {/* Refleksi Akhir */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                        <ClipboardList className="h-4 w-4 text-(--palette-green)" />
                                        <span>Refleksi Akhir ({formData.post_reflection_questions?.length || 0})</span>
                                    </div>
                                    {formData.post_reflection_questions && formData.post_reflection_questions.length > 0 ? (
                                        <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-(--palette-limelight)/10">
                                            {formData.post_reflection_questions.map((question, idx) => (
                                                <div key={idx} className="flex gap-2 text-sm font-semibold text-foreground">
                                                    <span className="text-(--palette-green) font-bold shrink-0">{idx + 1}.</span>
                                                    <p className="leading-relaxed">{question}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm font-semibold text-muted-foreground/45 italic pl-6">
                                            Tidak ada pertanyaan refleksi akhir yang dikonfigurasi
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm font-semibold text-muted-foreground/40 italic">
                                Tidak ada pertanyaan refleksi yang dikonfigurasi
                            </p>
                        )}
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
