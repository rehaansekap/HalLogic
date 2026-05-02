import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Save, UserCheck, UserX, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import EmptyState from '@/components/custom/common/EmptyState';
import { Button } from '@/components/ui/button';
import { attendance } from '@/routes/teacher/material';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
}

interface AttendanceRecord {
    student_id: number;
    is_present: boolean;
}

interface TabAttendanceProps {
    materialId: number;
    students: Student[];
    initialAttendance: AttendanceRecord[];
}

export default function TabAttendance({
    materialId,
    students,
    initialAttendance,
}: TabAttendanceProps) {
    const [attendanceData, setAttendanceData] = useState<
        Record<number, boolean>
    >(() => {
        const map: Record<number, boolean> = {};
        for (const record of initialAttendance) {
            map[record.student_id] = record.is_present;
        }

        return map;
    });
    const [isSaving, setIsSaving] = useState(false);

    const toggleAttendance = useCallback((studentId: number) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    }, []);

    const markAll = useCallback(
        (present: boolean) => {
            const map: Record<number, boolean> = {};
            for (const student of students) {
                map[student.id] = present;
            }

            setAttendanceData(map);
        },
        [students],
    );

    const summary = useMemo(() => {
        const present = students.filter(
            (s) => attendanceData[s.id] === true,
        ).length;

        return { present, absent: students.length - present };
    }, [students, attendanceData]);

    const handleSave = useCallback(() => {
        setIsSaving(true);

        const payload = students.map((s) => ({
            student_id: s.id,
            is_present: attendanceData[s.id] ?? false,
        }));

        router.post(
            attendance.url(materialId),
            { attendance: payload },
            {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Kehadiran Disimpan!',
                        text: 'Data kehadiran siswa berhasil diperbarui.',
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
                        'Gagal menyimpan kehadiran.';
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
    }, [materialId, students, attendanceData]);

    if (students.length === 0) {
        return (
            <EmptyState
                icon={<UserCheck className="h-8 w-8" />}
                title="Belum ada siswa"
                description="Belum ada siswa yang terdaftar di kelas ini."
                delay={0.5}
            />
        );
    }

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Summary & Bulk Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 rounded-full bg-(--palette-green)/10 px-3 py-1 text-xs font-bold text-(--palette-green)">
                        <UserCheck className="h-3.5 w-3.5" />
                        Hadir: {summary.present}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500">
                        <UserX className="h-3.5 w-3.5" />
                        Tidak Hadir: {summary.absent}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAll(true)}
                        className="text-xs font-semibold"
                    >
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Semua Hadir
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAll(false)}
                        className="text-xs font-semibold"
                    >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Semua Tidak Hadir
                    </Button>
                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-(--palette-green) font-bold text-white shadow-(--palette-green)/20 shadow-sm transition-all hover:scale-105 hover:bg-(--palette-green)/90 active:scale-95"
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
                                    Simpan Kehadiran
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="overflow-hidden rounded-xl border border-(--palette-limelight)/20">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-(--palette-limelight)/20 bg-(--palette-limelight)/5">
                                <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    Siswa
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => {
                                const isPresent =
                                    attendanceData[student.id] ?? false;

                                return (
                                    <motion.tr
                                        key={student.id}
                                        className="cursor-pointer border-b border-(--palette-limelight)/10 transition-colors hover:bg-(--palette-limelight)/5"
                                        onClick={() =>
                                            toggleAttendance(student.id)
                                        }
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.5 + idx * 0.03,
                                        }}
                                    >
                                        <td className="px-6 py-3 text-sm text-muted-foreground">
                                            {idx + 1}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--palette-green)/10 text-xs font-bold text-(--palette-green)">
                                                    {student.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        @{student.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleAttendance(
                                                        student.id,
                                                    );
                                                }}
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
                                                    isPresent
                                                        ? 'bg-(--palette-green)/15 text-(--palette-green) hover:bg-(--palette-green)/25'
                                                        : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                }`}
                                            >
                                                {isPresent ? (
                                                    <>
                                                        <Check className="h-3 w-3" />
                                                        Hadir
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-3 w-3" />
                                                        Tidak Hadir
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-(--palette-green) font-bold text-white shadow-(--palette-green)/20 shadow-sm transition-all hover:scale-105 hover:bg-(--palette-green)/90 active:scale-95"
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
                            Simpan Kehadiran
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
