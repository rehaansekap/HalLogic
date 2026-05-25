import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    CheckCircle2,
    Clock,
    Eye,
    Lock,
    Loader2,
    MessageCircle,
    Users,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import EmptyState from '@/components/custom/common/EmptyState';
import { Button } from '@/components/ui/button';

import SubmissionDetailModal from './SubmissionDetailModal';
import ReflectionDetailModal from './ReflectionDetailModal';

interface GroupMember {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    is_leader: boolean;
}

interface SubmissionData {
    id: number;
    files: string[];
    code_answer: string | null;
    submitted_at: string | null;
}

interface GradeData {
    score: number;
    teacher_notes: string | null;
}

interface Reflection {
    id: number;
    user_id: number;
    user_name: string;
    username: string;
    avatar: string | null;
    content: string;
    type: string;
    created_at: string;
}

interface MonitoringGroup {
    group_id: number;
    group_name: string;
    group_code: string;
    current_step: number;
    status: string;
    members: GroupMember[];
    submission_id: number | null;
    files: string[];
    code_answer: string | null;
    submitted_at: string | null;
    step3_status: string;
    submission: SubmissionData | null;
    grade: GradeData | null;
    reflections: Reflection[];
}

interface AllReflection {
    user_id: number;
    user_name: string;
    content: string;
    created_at: string;
    type: string;
    group_name: string | null;
}

interface TabMonitoringProps {
    groupsMonitoring: MonitoringGroup[];
    allReflections: AllReflection[];
    preQuestions?: string[];
    postQuestions?: string[];
}

const statusConfig: Record<
    string,
    { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
    completed: {
        label: 'Selesai',
        color: 'text-(--palette-green)',
        bg: 'bg-(--palette-green)/10',
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    in_progress: {
        label: 'Dalam Pengerjaan',
        color: 'text-(--palette-sunflower)',
        bg: 'bg-(--palette-sunflower)/10',
        icon: <Loader2 className="h-3.5 w-3.5" />,
    },
    locked: {
        label: 'Belum Mulai',
        color: 'text-muted-foreground',
        bg: 'bg-gray-100',
        icon: <Lock className="h-3.5 w-3.5" />,
    },
};

const stepLabels = ['Orientasi', 'Investigasi', 'Presentasi'];

export default function TabMonitoring({
    groupsMonitoring,
    allReflections,
    preQuestions = [],
    postQuestions = [],
}: TabMonitoringProps) {
    const [selectedGroup, setSelectedGroup] = useState<MonitoringGroup | null>(
        null,
    );
    const [selectedReflection, setSelectedReflection] = useState<{
        studentName: string;
        reflectionType: 'pre' | 'post';
        questions: string[];
        answerText: string | null;
        submittedAt?: string | null;
    } | null>(null);

    const openSubmission = useCallback((group: MonitoringGroup) => {
        setSelectedGroup(group);
    }, []);

    const closeSubmission = useCallback(() => {
        setSelectedGroup(null);
    }, []);

    const [isInitialOpen, setIsInitialOpen] = useState(true);
    const [isFinalOpen, setIsFinalOpen] = useState(false);

    if (groupsMonitoring.length === 0) {
        return (
            <EmptyState
                icon={<Users className="h-8 w-8" />}
                title="Belum ada kelompok"
                description="Buat kelompok terlebih dahulu di tab Kelompok."
                delay={0.5}
            />
        );
    }

    const initialReflections = allReflections.filter((r) => r.type === 'initial');
    const finalReflections = allReflections.filter((r) => r.type === 'final');

    const renderReflectionList = (
        reflections: AllReflection[],
        type: 'pre' | 'post',
        questions: string[],
        delayOffset: number
    ) => (
        <div className="overflow-hidden rounded-xl border border-(--palette-limelight)/10 bg-white">
            <div className="min-w-full divide-y divide-gray-150">
                {reflections.length > 0 ? (
                    reflections.map((reflection, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delayOffset + idx * 0.03 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--palette-green)/10 text-xs font-extrabold text-(--palette-green) border border-(--palette-green)/10">
                                    {reflection.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-foreground">
                                            {reflection.user_name}
                                        </span>
                                        {reflection.group_name && (
                                            <span className="rounded-full bg-(--palette-limelight)/10 px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                                {reflection.group_name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-medium text-muted-foreground">
                                        <Clock className="h-3 w-3 opacity-60" />
                                        <span>Dikirim: {new Date(reflection.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-4 text-xs font-bold border-(--palette-green)/20 text-(--palette-green) bg-(--palette-green)/5 hover:bg-(--palette-green)/10 hover:text-(--palette-green) rounded-xl transition-all"
                                onClick={() => setSelectedReflection({
                                    studentName: reflection.user_name,
                                    reflectionType: type,
                                    questions,
                                    answerText: reflection.content,
                                    submittedAt: reflection.created_at,
                                })}
                            >
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                Detail
                            </Button>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-12 text-center text-sm text-muted-foreground italic font-semibold">
                        Belum ada refleksi untuk kategori ini.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Group Progress Cards */}
            <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Progress Kelompok
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {groupsMonitoring.map((group, idx) => {
                        const statusInfo =
                            statusConfig[group.status] ?? statusConfig.locked;
                        const progressPercent =
                            group.status === 'completed'
                                ? 100
                                : Math.round(
                                      ((group.current_step - 1) /
                                          stepLabels.length) *
                                          100,
                                  );

                        return (
                            <motion.div
                                key={group.group_id}
                                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + idx * 0.05 }}
                            >
                                {/* Group Name & Status */}
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="font-bold text-foreground">
                                        {group.group_name}
                                    </h4>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusInfo.bg} ${statusInfo.color}`}
                                    >
                                        {statusInfo.icon}
                                        {statusInfo.label}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                                        <span>Progress</span>
                                        <span className="font-semibold">
                                            {progressPercent}%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-(--palette-limelight)/10">
                                        <motion.div
                                            className="h-full bg-(--palette-green)"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${progressPercent}%`,
                                            }}
                                            transition={{
                                                delay: 0.3 + idx * 0.05,
                                                duration: 0.6,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Step Indicators */}
                                <div className="mb-3 flex gap-1">
                                    {stepLabels.map((label, stepIdx) => {
                                        const stepNum = stepIdx + 1;
                                        let stepClass = 'bg-gray-100 text-muted-foreground';

                                        if (group.status === 'completed') {
                                            stepClass =
                                                'bg-(--palette-green)/15 text-(--palette-green)';
                                        } else if (
                                            group.current_step > stepNum
                                        ) {
                                            stepClass =
                                                'bg-(--palette-green)/15 text-(--palette-green)';
                                        } else if (
                                            group.current_step === stepNum
                                        ) {
                                            stepClass =
                                                'bg-(--palette-sunflower)/15 text-(--palette-sunflower)';
                                        }

                                        return (
                                            <span
                                                key={stepIdx}
                                                className={`flex-1 rounded-md px-2 py-1 text-center text-[10px] font-semibold ${stepClass}`}
                                            >
                                                {label}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Grade Badge */}
                                {group.grade && (
                                    <div className="mb-3 flex items-center gap-2 rounded-lg bg-(--palette-green)/5 px-3 py-2">
                                        <Award className="h-4 w-4 text-(--palette-green)" />
                                        <span className="text-sm font-bold text-(--palette-green)">
                                            Nilai: {group.grade.score}
                                        </span>
                                    </div>
                                )}

                                {/* Members Preview */}
                                <div className="mb-3 flex -space-x-2">
                                    {group.members
                                        .slice(0, 4)
                                        .map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-(--palette-green)/10 text-[10px] font-bold text-(--palette-green)"
                                                title={member.name}
                                            >
                                                {member.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        ))}
                                    {group.members.length > 4 && (
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-muted-foreground">
                                            +{group.members.length - 4}
                                        </div>
                                    )}
                                </div>

                                {/* View Submission Button */}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs font-semibold"
                                    onClick={() => openSubmission(group)}
                                >
                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                    Lihat Submission
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Student Reflections Accordions */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    Refleksi Siswa
                </h3>

                {/* Initial Reflections Accordion */}
                <div className="overflow-hidden rounded-xl border border-(--palette-limelight)/20 bg-white shadow-sm">
                    <button
                        onClick={() => setIsInitialOpen(!isInitialOpen)}
                        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-(--palette-limelight)/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-1.5">
                                <MessageCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-foreground">Refleksi Awal</span>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {initialReflections.length} Siswa telah mengisi
                                </span>
                            </div>
                        </div>
                        {isInitialOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                    </button>
                    <AnimatePresence>
                        {isInitialOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="max-h-80 overflow-y-auto border-t border-(--palette-limelight)/10 p-4">
                                    {renderReflectionList(initialReflections, 'pre', preQuestions, 0.5)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Final Reflections Accordion */}
                <div className="overflow-hidden rounded-xl border border-(--palette-limelight)/20 bg-white shadow-sm">
                    <button
                        onClick={() => setIsFinalOpen(!isFinalOpen)}
                        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-(--palette-limelight)/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-(--palette-green)/10 p-1.5">
                                <CheckCircle2 className="h-4 w-4 text-(--palette-green)" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-foreground">Refleksi Akhir</span>
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {finalReflections.length} Siswa telah mengisi
                                </span>
                            </div>
                        </div>
                        {isFinalOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                    </button>
                    <AnimatePresence>
                        {isFinalOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="max-h-80 overflow-y-auto border-t border-(--palette-limelight)/10 p-4">
                                    {renderReflectionList(finalReflections, 'post', postQuestions, 0.5)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Submission Detail Modal */}
            {selectedGroup && (
                <SubmissionDetailModal
                    isOpen={!!selectedGroup}
                    onClose={closeSubmission}
                    groupName={selectedGroup.group_name}
                    members={selectedGroup.members}
                    submission={selectedGroup.submission}
                    existingGrade={selectedGroup.grade}
                    submissionId={selectedGroup.submission_id}
                />
            )}

            {/* Reflection Detail Modal */}
            {selectedReflection && (
                <ReflectionDetailModal
                    isOpen={!!selectedReflection}
                    onClose={() => setSelectedReflection(null)}
                    studentName={selectedReflection.studentName}
                    reflectionType={selectedReflection.reflectionType}
                    questions={selectedReflection.questions}
                    answerText={selectedReflection.answerText}
                    submittedAt={selectedReflection.submittedAt}
                />
            )}
        </motion.div>
    );
}
