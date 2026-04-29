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
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Group Status */}
            <motion.div
                className="group relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
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
                    <div className="mb-5 flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${status.bg}`}>
                            <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">
                            Status Kelompok
                        </h3>
                    </div>
                    <div
                        className={`${status.bg} ${status.border} border-2 ${status.color} rounded-xl px-5 py-3 text-center text-sm font-bold shadow-md`}
                    >
                        {status.label}
                    </div>
                </div>
            </motion.div>

            {/* Group Members */}
            <motion.div
                className="group relative overflow-hidden rounded-2xl border-2 border-[--palette-limelight]/30 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
            >
                <div className="absolute inset-0 bg-(--palette-limelight)/8 transition-all duration-300 group-hover:bg-(--palette-limelight)/10" />
                <div className="relative z-10">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-[--palette-limelight]/15 p-2">
                            <Users className="h-5 w-5 text-[--palette-limelight]" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">
                            Anggota Kelompok{' '}
                            <span className="font-black text-[--palette-limelight]">
                                ({groupMembers.length})
                            </span>
                        </h3>
                    </div>

                    {groupMembers.length > 0 ? (
                        <div className="space-y-2.5">
                            {groupMembers.map((member, idx) => (
                                <motion.div
                                    key={member.id}
                                    className="group/member flex items-start justify-between gap-3 rounded-xl border border-slate-200/50 bg-slate-50 p-4 transition-all duration-200 hover:shadow-md"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-foreground">
                                            {member.user?.name || 'Unknown'}
                                        </p>
                                        <p className="truncate text-xs font-medium text-muted-foreground">
                                            {member.user?.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-lg px-3 py-1.5 text-center text-xs font-bold whitespace-nowrap transition-all duration-200 group-hover/member:shadow-md ${
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
                                                    <RoleIcon className="mr-1 inline-block h-3.5 w-3.5" />
                                                    {member.role}
                                                </>
                                            );
                                        })()}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <InboxIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Belum ada anggota kelompok
                            </p>
                        </div>
                    )}

                    {/* Your Role */}
                    {currentUserRole && currentUserRole !== 'Belum Ada' && (
                        <motion.div
                            className="mt-5 border-t-2 border-slate-200/50 pt-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="mb-3 flex items-center gap-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                <UserIcon className="h-3.5 w-3.5" />
                                Peran Anda:
                            </p>
                            <span
                                className={`inline-block rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${
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
                                            <RoleIcon className="mr-1 inline-block h-4 w-4" />
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
                    className="group relative overflow-hidden rounded-2xl border-2 border-[--palette-green]/40 bg-(--palette-green)/8 p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="absolute inset-0 bg-(--palette-green)/5 transition-all duration-300 group-hover:bg-(--palette-green)/8" />
                    <div className="relative z-10">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-foreground uppercase">
                            <LinkIcon className="h-4 w-4" />
                            Link Kolaborasi
                        </h3>
                        <a
                            href={collaborationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-(--palette-green) px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
                        >
                            <span>Buka Workspace</span>
                        </a>
                        <p className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <SparklesIcon className="h-3.5 w-3.5" />
                            Akses real-time coding bersama dengan tim Anda
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
