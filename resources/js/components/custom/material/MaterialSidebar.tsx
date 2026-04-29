import {
    InboxIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface GroupMember {
    user_id: number;
    name: string;
    username: string;
    is_leader: boolean;
    avatar?: string;
}

interface MaterialSidebarProps {
    groupMembers: GroupMember[];
}

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
                                    className="group/member flex items-center justify-between gap-2 rounded-lg border border-slate-200/50 bg-slate-50 p-3 transition-all duration-200 hover:shadow-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-foreground">
                                            {member.name || 'Unknown'}
                                        </p>
                                        <p className="truncate text-[10px] font-medium text-muted-foreground">
                                            @{member.username}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {member.is_leader ? (
                                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[8px] font-black tracking-tighter text-amber-700 uppercase ring-1 ring-amber-200">
                                                Ketua
                                            </span>
                                        ) : (
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-black tracking-tighter text-slate-700 uppercase ring-1 ring-slate-200">
                                                Anggota
                                            </span>
                                        )}
                                    </div>
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
