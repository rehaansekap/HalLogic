import {
    BeakerIcon,
    CheckCircleIcon,
    LightBulbIcon,
    MicrophoneIcon,
    PuzzlePieceIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Users, Zap } from 'lucide-react';
import { useState } from 'react';
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
    },
    {
        id: 'Problem Analyzer',
        label: 'Analis Masalah',
        Icon: BeakerIcon,
        description: 'Menganalisis masalah, meneliti kasus, dan ide-ide',
        color: 'from-[var(--palette-green)]',
    },
    {
        id: 'Presenter',
        label: 'Presenter',
        Icon: MicrophoneIcon,
        description: 'Mempresentasikan hasil dan berkomunikasi',
        color: 'from-[var(--palette-yellow-green)]',
    },
    {
        id: 'Algorithm Designer',
        label: 'Desainer Algoritma',
        Icon: PuzzlePieceIcon,
        description: 'Merancang algoritma dan solusi teknis',
        color: 'from-[var(--palette-limelight)]',
    },
];

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

    const isPhaseActive = currentStep >= 2;
    const allRolesAssigned = Object.values(selectedRoles).every(
        (role) => role && role !== 'Belum Ada',
    );

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
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8 opacity-60"
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
            className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="mb-8 flex items-start gap-4"
                variants={itemVariants}
            >
                <div className="rounded-lg bg-(--palette-yellow-green)/8 p-4">
                    <Users className="h-6 w-6 text-(--palette-green)" />
                </div>
                <div className="flex-1">
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                        Fase 2: Organisasi Kelompok
                    </h2>
                    <p className="text-muted-foreground">
                        {isLeader
                            ? 'Sebagai Ketua, Anda dapat menentukan peran setiap anggota kelompok'
                            : 'Tunggu Ketua untuk menentukan peran Anda'}
                    </p>
                </div>
            </motion.div>

            {/* Role Reference */}
            <motion.div
                className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        className={`${role.color} rounded-lg border border-(--palette-limelight)/20 p-4`}
                        variants={itemVariants}
                    >
                        <div className="mb-2 flex items-center gap-2">
                            <role.Icon className="h-5 w-5 shrink-0" />
                            <span className="font-bold text-foreground">
                                {role.label}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {role.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Role Assignment — Per-member forms */}
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
                                className="rounded-lg border border-(--palette-limelight)/20 p-4"
                                variants={itemVariants}
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {member.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {member.username}
                                        </p>
                                    </div>
                                    {member.role === 'Leader' && (
                                        <Crown className="h-5 w-5 text-(--palette-sunflower)" />
                                    )}
                                </div>

                                {member.role === 'Leader' ? (
                                    <div className="rounded-lg bg-(--palette-sunflower)/10 px-3 py-2 text-sm font-semibold text-(--palette-sunflower)">
                                        Ketua (tidak bisa diubah)
                                    </div>
                                ) : (
                                    <Form
                                        method="post"
                                        action={`/material/${materialSlug}/update-role`}
                                    >
                                        {({ processing, wasSuccessful }) => (
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="hidden"
                                                    name="target_user_id"
                                                    value={member.user_id}
                                                />
                                                <select
                                                    name="role"
                                                    aria-label={`Pilih peran untuk ${member.name}`}
                                                    value={
                                                        selectedRoles[member.user_id] ||
                                                        'Belum Ada'
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedRoles({
                                                            ...selectedRoles,
                                                            [member.user_id]:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="flex-1 rounded-lg border border-(--palette-limelight)/20 px-3 py-2 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                                >
                                                    <option value="Belum Ada">
                                                        Belum Ada Peran
                                                    </option>
                                                    {roles
                                                        .filter((r) => r.id !== 'Leader')
                                                        .map((role) => (
                                                            <option
                                                                key={role.id}
                                                                value={role.id}
                                                                disabled={
                                                                    Object.values(
                                                                        selectedRoles,
                                                                    ).includes(role.id) &&
                                                                    selectedRoles[
                                                                        member.user_id
                                                                    ] !== role.id
                                                                }
                                                            >
                                                                {role.label}
                                                            </option>
                                                        ))}
                                                </select>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        !selectedRoles[member.user_id] ||
                                                        selectedRoles[member.user_id] === 'Belum Ada' ||
                                                        wasSuccessful
                                                    }
                                                    className="rounded-lg bg-(--palette-green) px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                                                >
                                                    {processing ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    ) : wasSuccessful ? (
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    ) : (
                                                        'Simpan'
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </Form>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {!allRolesAssigned && (
                        <motion.div
                            className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-700"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <LightBulbIcon className="h-4 w-4 shrink-0" />
                            Tentukan peran untuk semua anggota, lalu simpan
                            masing-masing peran
                        </motion.div>
                    )}

                    {allRolesAssigned && (
                        <Form
                            method="post"
                            action={`/material/${materialSlug}/complete-step-2`}
                        >
                            {({ processing, wasSuccessful }) => (
                                <motion.div
                                    className="flex gap-3 pt-4"
                                    variants={itemVariants}
                                >
                                    <Button
                                        type="submit"
                                        disabled={processing || wasSuccessful}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all ${
                                            wasSuccessful
                                                ? 'bg-(--palette-green) text-white'
                                                : 'bg-(--palette-green) text-white hover:shadow-lg disabled:opacity-50'
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Memproses...
                                            </>
                                        ) : wasSuccessful ? (
                                            <>
                                                <Zap className="h-5 w-5" />
                                                Selesai!
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRight className="h-5 w-5" />
                                                Selesaikan Organisasi & Lanjut Fase 3
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </Form>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-6"
                    variants={itemVariants}
                >
                    <div className="mb-3 flex items-center gap-3">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <p className="font-semibold text-foreground">
                            Menunggu Penetapan Peran
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Ketua kelompok sedang menentukan peran untuk setiap
                        anggota. Anda dapat melihat peran Anda di sidebar
                        setelah Ketua menyelesaikannya.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
