import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Crown,
    GripVertical,
    Plus,
    Save,
    Shuffle,
    Trash2,
    UserMinus,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import EmptyState from '@/components/custom/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateGroups } from '@/routes/teacher/material';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
}

interface GroupMember {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    is_leader: boolean;
}

interface Group {
    group_id: number;
    group_name: string;
    group_code: string;
    current_step: number;
    status: string;
    members: GroupMember[];
}

interface TabGroupManagementProps {
    materialId: number;
    students: Student[];
    groups: Group[];
}

let tempIdCounter = Date.now();

export default function TabGroupManagement({
    materialId,
    students,
    groups: initialGroups,
}: TabGroupManagementProps) {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isSaving, setIsSaving] = useState(false);

    const assignedStudentIds = useMemo(() => {
        const ids = new Set<number>();

        for (const group of groups) {
            for (const member of group.members) {
                ids.add(member.id);
            }
        }

        return ids;
    }, [groups]);

    const unassignedStudents = useMemo(() => {
        return students.filter((s) => !assignedStudentIds.has(s.id));
    }, [students, assignedStudentIds]);

    const addGroup = useCallback(() => {
        const newId = ++tempIdCounter;
        const groupNum = groups.length + 1;
        setGroups((prev) => [
            ...prev,
            {
                group_id: newId,
                group_name: `Kelompok ${groupNum}`,
                group_code: `NEW-${newId}`,
                current_step: 1,
                status: 'in_progress',
                members: [],
            },
        ]);
    }, [groups.length]);

    const removeGroup = useCallback((groupId: number) => {
        setGroups((prev) => prev.filter((g) => g.group_id !== groupId));
    }, []);

    const renameGroup = useCallback((groupId: number, newName: string) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.group_id === groupId ? { ...g, group_name: newName } : g,
            ),
        );
    }, []);

    const addMemberToGroup = useCallback(
        (groupId: number, student: Student) => {
            setGroups((prev) =>
                prev.map((g) =>
                    g.group_id === groupId
                        ? {
                              ...g,
                              members: [
                                  ...g.members,
                                  {
                                      id: student.id,
                                      name: student.name,
                                      username: student.username,
                                      avatar: student.avatar,
                                      is_leader: g.members.length === 0,
                                  },
                              ],
                          }
                        : g,
                ),
            );
        },
        [],
    );

    const removeMemberFromGroup = useCallback(
        (groupId: number, studentId: number) => {
            setGroups((prev) =>
                prev.map((g) => {
                    if (g.group_id !== groupId) {
                        return g;
                    }

                    const newMembers = g.members.filter(
                        (m) => m.id !== studentId,
                    );

                    if (
                        newMembers.length > 0 &&
                        !newMembers.some((m) => m.is_leader)
                    ) {
                        newMembers[0].is_leader = true;
                    }

                    return { ...g, members: newMembers };
                }),
            );
        },
        [],
    );

    const setLeader = useCallback((groupId: number, studentId: number) => {
        setGroups((prev) =>
            prev.map((g) =>
                g.group_id === groupId
                    ? {
                          ...g,
                          members: g.members.map((m) => ({
                              ...m,
                              is_leader: m.id === studentId,
                          })),
                      }
                    : g,
            ),
        );
    }, []);

    const autoGroup = useCallback(() => {
        const shuffled = [...students].sort(() => Math.random() - 0.5);
        const groupSize = Math.max(3, Math.ceil(shuffled.length / 5));
        const numGroups = Math.ceil(shuffled.length / groupSize);
        const newGroups: Group[] = [];

        for (let i = 0; i < numGroups; i++) {
            const start = i * groupSize;
            const members = shuffled
                .slice(start, start + groupSize)
                .map((s, idx) => ({
                    id: s.id,
                    name: s.name,
                    username: s.username,
                    avatar: s.avatar,
                    is_leader: idx === 0,
                }));

            newGroups.push({
                group_id: ++tempIdCounter,
                group_name: `Kelompok ${i + 1}`,
                group_code: `AUTO-${tempIdCounter}`,
                current_step: 1,
                status: 'in_progress',
                members,
            });
        }

        setGroups(newGroups);
    }, [students]);

    const resetGroups = useCallback(() => {
        Swal.fire({
            title: 'Reset Kelompok?',
            text: 'Semua kelompok akan dihapus. Lanjutkan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Reset',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setGroups([]);
            }
        });
    }, []);

    const handleSave = useCallback(() => {
        setIsSaving(true);

        const payload = groups.map((g) => ({
            group_id: g.group_id,
            group_name: g.group_name,
            group_code: g.group_code,
            members: g.members.map((m) => ({
                user_id: m.id,
                is_leader: m.is_leader,
            })),
        }));

        router.post(
            updateGroups.url(materialId),
            { groups: payload },
            {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Kelompok Disimpan!',
                        text: 'Struktur kelompok berhasil diperbarui.',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#ffffff',
                        customClass: {
                            popup: 'rounded-2xl border-2 border-green-50 shadow-xl',
                            title: 'text-xl font-bold text-green-600',
                            htmlContainer: 'text-sm text-gray-600',
                        },
                    });
                },
                onError: (errors) => {
                    const message =
                        Object.values(errors).flat()[0] ||
                        'Gagal menyimpan kelompok.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: message,
                        confirmButtonColor: '#ef4444',
                        background: '#ffffff',
                        customClass: {
                            popup: 'rounded-2xl border-2 border-red-50 shadow-xl',
                            title: 'text-xl font-bold text-red-600',
                        },
                    });
                },
                onFinish: () => setIsSaving(false),
            },
        );
    }, [materialId, groups]);

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    onClick={addGroup}
                    className="bg-(--palette-green) font-semibold text-white hover:bg-(--palette-green)/90 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Tambah Kelompok
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={autoGroup}
                    className="font-semibold"
                >
                    <Shuffle className="mr-1.5 h-4 w-4" />
                    Auto Group
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={resetGroups}
                    className="font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Reset
                </Button>
            </div>

            {/* Unassigned Students Pool */}
            {unassignedStudents.length > 0 && (
                <motion.div
                    className="rounded-xl border border-(--palette-sunflower)/30 bg-(--palette-sunflower)/5 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-(--palette-sunflower)">
                        Belum Ditempatkan ({unassignedStudents.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {unassignedStudents.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center gap-2 rounded-lg border border-(--palette-sunflower)/20 bg-white px-3 py-1.5 text-sm"
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--palette-sunflower)/15 text-[10px] font-bold text-(--palette-sunflower)">
                                    {student.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-foreground">
                                    {student.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Groups Grid */}
            {groups.length === 0 ? (
                <EmptyState
                    icon={<Users className="h-8 w-8" />}
                    title="Belum ada kelompok"
                    description='Buat kelompok baru dengan tombol "Tambah Kelompok" atau "Auto Group".'
                    delay={0.3}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {groups.map((group, idx) => (
                        <motion.div
                            key={group.group_id}
                            className="rounded-xl border border-(--palette-limelight)/20 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                        >
                            {/* Group Header */}
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                    <Input
                                        value={group.group_name}
                                        onChange={(e) =>
                                            renameGroup(
                                                group.group_id,
                                                e.target.value,
                                            )
                                        }
                                        className="h-8 border-transparent bg-transparent px-1 text-sm font-bold hover:border-(--palette-limelight)/30 focus:border-(--palette-green) transition-colors"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0 text-red-400 hover:bg-red-50 hover:text-red-600"
                                    onClick={() =>
                                        removeGroup(group.group_id)
                                    }
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            {/* Members */}
                            <div className="space-y-1.5">
                                {group.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-(--palette-limelight)/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--palette-green)/10 text-[10px] font-bold text-(--palette-green)">
                                                {member.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-foreground truncate">
                                                {member.name}
                                            </span>
                                            {member.is_leader && (
                                                <Crown className="h-3.5 w-3.5 text-(--palette-sunflower) shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!member.is_leader && (
                                                <button
                                                    onClick={() =>
                                                        setLeader(
                                                            group.group_id,
                                                            member.id,
                                                        )
                                                    }
                                                    className="rounded p-1 text-muted-foreground hover:bg-(--palette-sunflower)/10 hover:text-(--palette-sunflower) transition-colors"
                                                    title="Jadikan Leader"
                                                >
                                                    <Crown className="h-3 w-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    removeMemberFromGroup(
                                                        group.group_id,
                                                        member.id,
                                                    )
                                                }
                                                className="rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                                                title="Keluarkan"
                                            >
                                                <UserMinus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Member */}
                            {unassignedStudents.length > 0 && (
                                <div className="mt-2 border-t border-(--palette-limelight)/10 pt-2">
                                    <div className="relative">
                                        <select
                                            aria-label="Tambah anggota kelompok"
                                            className="w-full appearance-none rounded-lg border border-(--palette-limelight)/20 bg-transparent px-3 py-1.5 text-xs text-muted-foreground focus:border-(--palette-green) focus:outline-none transition-colors"
                                            value=""
                                            onChange={(e) => {
                                                const studentId = Number(
                                                    e.target.value,
                                                );

                                                const student =
                                                    unassignedStudents.find(
                                                        (s) =>
                                                            s.id === studentId,
                                                    );

                                                if (student) {
                                                    addMemberToGroup(
                                                        group.group_id,
                                                        student,
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="" disabled>
                                                + Tambah Anggota
                                            </option>
                                            {unassignedStudents.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                        <UserPlus className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                                    </div>
                                </div>
                            )}

                            {/* Member Count Badge */}
                            <div className="mt-2 flex justify-end">
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        group.members.length < 3
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-(--palette-green)/10 text-(--palette-green)'
                                    }`}
                                >
                                    {group.members.length} anggota
                                    {group.members.length < 3 &&
                                        ' (min. 3)'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Save Button */}
            {groups.length > 0 && (
                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-(--palette-green) font-bold text-white hover:bg-(--palette-green)/90 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-(--palette-green)/20"
                    >
                        {isSaving ? (
                            <>
                                <motion.div
                                    className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.8,
                                        ease: 'linear',
                                    }}
                                />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Kelompok
                            </>
                        )}
                    </Button>
                </div>
            )}
        </motion.div>
    );
}
