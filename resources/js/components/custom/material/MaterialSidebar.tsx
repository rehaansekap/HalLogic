import {
    AcademicCapIcon,
    BeakerIcon,
    CogIcon,
    InboxIcon,
    LinkIcon,
    MicrophoneIcon,
    QuestionMarkCircleIcon,
    SparklesIcon,
    TrophyIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Lock, Users } from 'lucide-react';

interface GroupMember {
    id: number;
    user_id: number;
    group_id: number;
    role: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface MaterialSidebarProps {
    groupMembers: GroupMember[];
    currentUserRole: string;
    groupStatus: 'locked' | 'active' | 'completed' | null;
    collaborationLink?: string | null;
    currentStep: number;
}

const roleColorMap: Record<string, string> = {
    Leader: 'bg-gradient-to-br from-[var(--palette-sunflower)]/25 to-[var(--palette-yellow-green)]/10 text-[var(--palette-sunflower)] border border-[var(--palette-sunflower)]/40 shadow-md',
    Researcher:
        'bg-gradient-to-br from-[var(--palette-green)]/25 to-[var(--palette-chartreuse)]/10 text-[var(--palette-green)] border border-[var(--palette-green)]/40 shadow-md',
    Presenter:
        'bg-gradient-to-br from-[var(--palette-yellow-green)]/25 to-[var(--palette-limelight)]/10 text-[var(--palette-yellow-green)] border border-[var(--palette-yellow-green)]/40 shadow-md',
    Technician:
        'bg-gradient-to-br from-[var(--palette-limelight)]/25 to-[var(--palette-chartreuse)]/10 text-[var(--palette-limelight)] border border-[var(--palette-limelight)]/40 shadow-md',
    'Belum Ada':
        'bg-gradient-to-br from-gray-200/25 to-gray-100/10 text-gray-600 border border-gray-300/40 shadow-sm',
};

const roleIconMap: Record<string, React.ElementType> = {
    Leader: TrophyIcon,
    Researcher: BeakerIcon,
    Presenter: MicrophoneIcon,
    Technician: CogIcon,
    'Belum Ada': QuestionMarkCircleIcon,
};

export default function MaterialSidebar({
    groupMembers,
    currentUserRole,
    groupStatus,
    collaborationLink,
    currentStep,
}: MaterialSidebarProps) {
    const statusConfig = {
        locked: {
            icon: Lock,
            label: 'Terkunci',
            color: 'text-orange-600',
            bg: 'bg-gradient-to-br from-orange-100 to-orange-50',
            border: 'border-orange-300/50',
        },
        active: {
            icon: AlertCircle,
            label: 'Aktif',
            color: 'text-[var(--palette-green)]',
            bg: 'bg-gradient-to-br from-[var(--palette-green)]/10 to-[var(--palette-chartreuse)]/5',
            border: 'border-[var(--palette-green)]/30',
        },
        completed: {
            icon: CheckCircle2,
            label: 'Selesai',
            color: 'text-[var(--palette-limelight)]',
            bg: 'bg-gradient-to-br from-[var(--palette-limelight)]/10 to-[var(--palette-chartreuse)]/5',
            border: 'border-[var(--palette-limelight)]/30',
        },
    };

    const status = statusConfig[groupStatus || 'locked'];
    const StatusIcon = status.icon;

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Group Status */}
            <motion.div
                className="group relative overflow-hidden rounded-xl border-2 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                style={{
                    borderColor:
                        status.color.replace('text-', 'var(--palette-') + ')',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="absolute inset-0 bg-(--palette-limelight)/5 transition-all duration-300 group-hover:from-[--palette-limelight]/10" />
                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-2">
                        <div className={`rounded-lg p-1.5 ${status.bg}`}>
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        </div>
                        <h3 className="text-base font-bold text-foreground">
                            Status Kelompok
                        </h3>
                    </div>
                    <div
                        className={`${status.bg} ${status.border} border ${status.color} rounded-lg px-4 py-2 text-center text-xs font-bold`}
                    >
                        {status.label}
                    </div>
                </div>
            </motion.div>

            {/* Group Members */}
            <motion.div
                className="group relative overflow-hidden rounded-xl border border-[--palette-limelight]/30 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
            >
                <div className="absolute inset-0 bg-(--palette-limelight)/5 transition-all duration-300 group-hover:bg-(--palette-limelight)/10" />
                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-[--palette-limelight]/15 p-1.5">
                            <Users className="h-4 w-4 text-[--palette-limelight]" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">
                            Anggota Kelompok{' '}
                            <span className="font-black text-[--palette-limelight]">
                                ({groupMembers.length})
                            </span>
                        </h3>
                    </div>

                    {groupMembers.length > 0 ? (
                        <div className="space-y-2">
                            {groupMembers.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    className="group/member flex items-start justify-between gap-2 rounded-lg border border-slate-200/50 bg-slate-50 p-3 transition-all duration-200 hover:shadow-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-foreground">
                                            {member.user?.name || 'Unknown'}
                                        </p>
                                        <p className="truncate text-[10px] font-medium text-muted-foreground">
                                            {member.user?.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-md px-2 py-1 text-center text-[10px] font-bold whitespace-nowrap transition-all duration-200 group-hover/member:shadow-sm ${
                                            roleColorMap[member.role] ||
                                            roleColorMap['Belum Ada']
                                        }`}
                                    >
                                        {(() => {
                                            const RoleIcon =
                                                roleIconMap[member.role] ||
                                                roleIconMap['Belum Ada'];

                                            return (
                                                <>
                                                    <RoleIcon className="mr-1 inline-block h-3 w-3" />
                                                    {member.role}
                                                </>
                                            );
                                        })()}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-6 text-center">
                            <InboxIcon className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                            <p className="text-xs font-medium text-muted-foreground">
                                Belum ada anggota kelompok
                            </p>
                        </div>
                    )}

                    {/* Your Role */}
                    {currentUserRole && currentUserRole !== 'Belum Ada' && (
                        <motion.div
                            className="mt-4 border-t border-slate-200/50 pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="mb-2 flex items-center gap-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                <UserIcon className="h-3 w-3" />
                                Peran Anda:
                            </p>
                            <span
                                className={`inline-block rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                                    roleColorMap[currentUserRole] ||
                                    roleColorMap['Belum Ada']
                                }`}
                            >
                                {(() => {
                                    const RoleIcon =
                                        roleIconMap[currentUserRole] ||
                                        roleIconMap['Belum Ada'];

                                    return (
                                        <>
                                            <RoleIcon className="mr-1 inline-block h-3.5 w-3.5" />
                                            {currentUserRole}
                                        </>
                                    );
                                })()}
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Collaboration Link */}
            {collaborationLink && currentStep > 1 && (
                <motion.div
                    className="group relative overflow-hidden rounded-xl border border-[--palette-green]/40 bg-(--palette-green)/8 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="absolute inset-0 bg-(--palette-green)/5 transition-all duration-300 group-hover:bg-(--palette-green)/8" />
                    <div className="relative z-10">
                        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                            <LinkIcon className="h-3.5 w-3.5" />
                            Link Kolaborasi
                        </h3>
                        <a
                            href={collaborationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-(--palette-green) px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                        >
                            <span>Buka Workspace</span>
                        </a>
                        <p className="mt-2 flex items-start gap-1 text-[10px] leading-tight font-medium text-muted-foreground">
                            <SparklesIcon className="h-3 w-3 shrink-0 mt-0.5" />
                            Akses real-time coding bersama dengan tim Anda
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
