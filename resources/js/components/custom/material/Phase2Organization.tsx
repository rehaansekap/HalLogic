import {
    BeakerIcon,
    CheckCircleIcon,
    LightBulbIcon,
    MicrophoneIcon,
    PuzzlePieceIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crown, Users, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface GroupMember {
    user_id: number;
    name: string;
    role: string;
    username: string;
    avatar?: string;
}

interface Phase2OrganizationProps {
    materialSlug: string;
    groupMembers: GroupMember[];
    currentUserRole: string;
    isLeader: boolean;
    groupStatus: 'locked' | 'active' | 'completed' | null;
    currentStep: number;
}

const roles = [
    {
        id: 'Leader',
        label: 'Ketua',
        Icon: TrophyIcon,
        description: 'Memimpin kelompok, mengumpulkan hasil, dan voting',
        color: 'from-[var(--palette-sunflower)]',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
    },
    {
        id: 'Problem Analyzer',
        label: 'Analis Masalah',
        Icon: BeakerIcon,
        description: 'Menganalisis masalah, meneliti kasus, dan ide-ide',
        color: 'from-[var(--palette-green)]',
        textColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
    },
    {
        id: 'Presenter',
        label: 'Presenter',
        Icon: MicrophoneIcon,
        description: 'Mempresentasikan hasil dan berkomunikasi',
        color: 'from-[var(--palette-yellow-green)]',
        textColor: 'text-lime-600',
        bgColor: 'bg-lime-50',
    },
    {
        id: 'Algorithm Designer',
        label: 'Desainer Algoritma',
        Icon: PuzzlePieceIcon,
        description: 'Merancang algoritma dan solusi teknis',
        color: 'from-[var(--palette-limelight)]',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
    },
];

function RoleDropdown({ 
    value, 
    onChange, 
    disabledRoles 
}: { 
    value: string, 
    onChange: (val: string) => void, 
    disabledRoles: string[] 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = roles.find(r => r.id === value);
    const IconComponent = selectedOption?.Icon;

    return (
        <div className="relative flex-1" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 ${
                    isOpen 
                        ? 'border-[var(--palette-green)] ring-2 ring-[var(--palette-green)]/20' 
                        : 'border-slate-200 hover:border-[var(--palette-green)]/50'
                }`}
            >
                {selectedOption && IconComponent ? (
                    <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${selectedOption.bgColor}`}>
                            <IconComponent className={`h-5 w-5 ${selectedOption.textColor}`} />
                        </div>
                        <div>
                            <div className="font-bold text-foreground">{selectedOption.label}</div>
                            <div className="text-xs text-muted-foreground">{selectedOption.description}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                            <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="font-medium text-slate-500">Pilih Peran Anggota...</div>
                    </div>
                )}
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl"
                    >
                        <div className="max-h-80 overflow-y-auto">
                            {roles.filter(r => r.id !== 'Leader').map(role => {
                                const isDisabled = disabledRoles.includes(role.id) && value !== role.id;
                                const OptIcon = role.Icon;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => { onChange(role.id); setIsOpen(false); }}
                                        className={`flex w-full items-start gap-3 border-b border-slate-50 p-3 text-left transition-colors last:border-0 hover:bg-slate-50 ${isDisabled ? 'cursor-not-allowed bg-slate-50/50 opacity-50' : ''}`}
                                    >
                                        <div className={`rounded-lg p-2 ${role.bgColor}`}>
                                            <OptIcon className={`h-5 w-5 ${role.textColor}`} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground">{role.label}</div>
                                            <div className="text-xs text-muted-foreground">{role.description}</div>
                                        </div>
                                        {isDisabled && (
                                            <div className="ml-auto flex h-full items-center">
                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Sudah Dipilih</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Phase2Organization({
    materialSlug,
    groupMembers,
    isLeader,
    currentStep,
}: Phase2OrganizationProps) {
    const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>(
        groupMembers.reduce(
            (acc, member) => {
                acc[member.user_id] = member.role;
                return acc;
            },
            {} as Record<number, string>,
        ),
    );
    const [isProcessing, setIsProcessing] = useState(false);

    const isPhaseActive = currentStep >= 2;
    const allRolesAssigned = Object.values(selectedRoles).every(
        (role) => role && role !== 'Belum Ada',
    );
    
    const disabledRoles = Object.values(selectedRoles).filter(r => r !== 'Belum Ada');

    const getCookie = (name: string) => {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    };

    const handleComplete = async () => {
        setIsProcessing(true);
        try {
            const token = getCookie('XSRF-TOKEN');
            
            // Send role updates sequentially
            for (const member of groupMembers) {
                if (member.role === 'Leader') continue;
                
                const newRole = selectedRoles[member.user_id];
                if (newRole && newRole !== 'Belum Ada' && newRole !== member.role) {
                    await fetch(`/material/${materialSlug}/update-role`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': token || '',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            target_user_id: member.user_id,
                            role: newRole
                        })
                    });
                }
            }
            // After all roles are updated, complete the step
            router.post(`/material/${materialSlug}/complete-step-2`, {}, {
                onFinish: () => setIsProcessing(false),
                preserveState: true,
            });
        } catch (error) {
            console.error("Error updating roles", error);
            setIsProcessing(false); 
        }
    };

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

    if (!isPhaseActive) {
        return (
            <motion.div
                className="rounded-xl border border-[var(--palette-limelight)]/20 bg-white p-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-4">
                        <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Fase 2: Organisasi Kelompok
                        </h2>
                        <p className="text-muted-foreground">
                            Fase ini akan dibuka setelah Anda menyelesaikan
                            refleksi awal
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="rounded-xl border border-[var(--palette-limelight)]/20 bg-white p-8 shadow-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="mb-8 flex items-start gap-4"
                variants={itemVariants}
            >
                <div className="rounded-lg bg-[var(--palette-yellow-green)]/10 p-4">
                    <Users className="h-6 w-6 text-[var(--palette-green)]" />
                </div>
                <div className="flex-1">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                        Fase 2: Organisasi Kelompok
                    </h2>
                    <p className="text-muted-foreground">
                        {isLeader
                            ? 'Sebagai Ketua, Anda dapat menentukan peran setiap anggota kelompok untuk pembagian tugas'
                            : 'Tunggu Ketua untuk menentukan peran Anda'}
                    </p>
                </div>
            </motion.div>

            {isLeader ? (
                <motion.div
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Member Role Selection */}
                    <div className="space-y-4">
                        {groupMembers.map((member) => (
                            <motion.div
                                key={member.user_id}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:border-[var(--palette-limelight)]/50 hover:shadow-md"
                                variants={itemVariants}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">
                                                {member.name}
                                            </p>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                @{member.username}
                                            </p>
                                        </div>
                                    </div>
                                    {member.role === 'Leader' && (
                                        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600 shadow-sm">
                                            <Crown className="h-4 w-4" />
                                            Ketua
                                        </div>
                                    )}
                                </div>

                                {member.role === 'Leader' ? (
                                    <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-3 text-sm font-semibold text-amber-600">
                                        Peran Ketua Kelompok sudah ditetapkan secara permanen dan tidak dapat diubah.
                                    </div>
                                ) : (
                                    <RoleDropdown 
                                        value={selectedRoles[member.user_id] || 'Belum Ada'} 
                                        onChange={(val) => setSelectedRoles({...selectedRoles, [member.user_id]: val})} 
                                        disabledRoles={disabledRoles}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {!allRolesAssigned && (
                        <motion.div
                            className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm font-medium text-yellow-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="rounded-full bg-yellow-500/20 p-1.5">
                                <LightBulbIcon className="h-5 w-5" />
                            </div>
                            Tentukan peran untuk semua anggota agar dapat melanjutkan ke fase berikutnya.
                        </motion.div>
                    )}

                    {allRolesAssigned && (
                        <motion.div
                            className="pt-4"
                            variants={itemVariants}
                        >
                            <Button
                                type="button"
                                onClick={handleComplete}
                                disabled={isProcessing}
                                className="flex h-auto min-h-[3.5rem] w-full flex-wrap items-center justify-center gap-2 rounded-xl bg-[var(--palette-green)] px-4 py-4 text-center text-sm font-bold text-white transition-all hover:scale-[1.01] hover:bg-[var(--palette-green)]/90 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 sm:py-6 sm:text-base"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Menyimpan Peran & Menyelesaikan Organisasi...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="h-6 w-6" />
                                        Selesaikan Organisasi & Lanjut Fase 3
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 shadow-sm"
                    variants={itemVariants}
                >
                    <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            Menunggu Penetapan Peran
                        </p>
                    </div>
                    <p className="text-muted-foreground">
                        Ketua kelompok sedang menentukan peran untuk setiap
                        anggota. Anda dapat melihat peran Anda di sidebar
                        setelah Ketua menyelesaikannya.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
