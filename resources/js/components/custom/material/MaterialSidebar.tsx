import {
    BeakerIcon,
    InboxIcon,
    MicrophoneIcon,
    PuzzlePieceIcon,
    QuestionMarkCircleIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface GroupMember {
    user_id: number;
    name: string;
    role: string;
    username: string;
    avatar?: string;
}

interface MaterialSidebarProps {
    groupMembers: GroupMember[];
}

const roleColorMap: Record<string, string> = {
    Leader: 'bg-amber-50 text-amber-600 border border-amber-200 shadow-sm',
    'Problem Analyzer': 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm',
    Presenter: 'bg-lime-50 text-lime-600 border border-lime-200 shadow-sm',
    'Algorithm Designer': 'bg-green-50 text-green-600 border border-green-200 shadow-sm',
    'Belum Ada': 'bg-slate-100 text-slate-500 border border-slate-200 shadow-sm',
};

const roleIconMap: Record<string, React.ElementType> = {
    Leader: TrophyIcon,
    'Problem Analyzer': BeakerIcon,
    Presenter: MicrophoneIcon,
    'Algorithm Designer': PuzzlePieceIcon,
    'Belum Ada': QuestionMarkCircleIcon,
};

export default function MaterialSidebar({
    groupMembers,
}: MaterialSidebarProps) {


    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
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
                                    key={member.user_id}
                                    className="group/member flex items-start justify-between gap-2 rounded-lg border border-slate-200/50 bg-slate-50 p-3 transition-all duration-200 hover:shadow-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-foreground">
                                            {member.name || 'Unknown'}
                                        </p>
                                        <p className="truncate text-[10px] font-medium text-muted-foreground">
                                            {member.role}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-md px-2 py-1 text-center text-[10px] font-bold whitespace-nowrap transition-all duration-200 group-hover/member:shadow-sm ${roleColorMap[member.role] ||
                                            roleColorMap['Belum Ada']
                                            }`}
                                    >
                                        {(() => {
                                            const RoleIcon =
                                                roleIconMap[member.role] ||
                                                roleIconMap['Belum Ada'];

                                            return (
                                                <>
                                                    <RoleIcon className="inline-block h-3 w-3" />
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
                </div>
            </motion.div>

        </motion.div>
    );
}
