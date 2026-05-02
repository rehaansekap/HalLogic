import { motion } from 'framer-motion';
import {
    Award,
    CheckCircle2,
    Clock,
    Eye,
    Lock,
    Loader2,
    MessageCircle,
    Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import EmptyState from '@/components/custom/common/EmptyState';
import { Button } from '@/components/ui/button';

import SubmissionDetailModal from './SubmissionDetailModal';

interface GroupMember {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    is_leader: boolean;
}

interface SubmissionData {
    id: number;
    file_path: string | null;
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
    file_path: string | null;
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
}: TabMonitoringProps) {
    const [selectedGroup, setSelectedGroup] = useState<MonitoringGroup | null>(
        null,
    );

    const openSubmission = useCallback((group: MonitoringGroup) => {
        setSelectedGroup(group);
    }, []);

    const closeSubmission = useCallback(() => {
        setSelectedGroup(null);
    }, []);

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
                                        let stepClass =
                                            'bg-gray-100 text-muted-foreground';
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

            {/* All Reflections */}
            {allReflections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        Refleksi Siswa ({allReflections.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto rounded-xl border border-(--palette-limelight)/20 p-4">
                        {allReflections.map((reflection, idx) => (
                            <motion.div
                                key={idx}
                                className="rounded-lg border border-(--palette-limelight)/10 p-3 hover:bg-(--palette-limelight)/5 transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.55 + idx * 0.03 }}
                            >
                                <div className="mb-1.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--palette-green)/10 text-[10px] font-bold text-(--palette-green)">
                                            {reflection.user_name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                            {reflection.user_name}
                                        </span>
                                        {reflection.group_name && (
                                            <span className="rounded-full bg-(--palette-limelight)/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                {reflection.group_name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {new Date(
                                            reflection.created_at,
                                        ).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {reflection.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

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
        </motion.div>
    );
}
