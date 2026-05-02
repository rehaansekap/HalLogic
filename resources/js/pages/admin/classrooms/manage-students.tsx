import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    Check,
    Copy,
    Minus,
    Plus,
    Save,
    Search,
    Users,
    X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import StatCard from '@/components/custom/cards/StatCard';
import PageHeader from '@/components/custom/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { index as classroomsIndex } from '@/routes/admin/classrooms';
import { update } from '@/routes/admin/classrooms/students';

interface Student {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
}

interface ClassroomInfo {
    id: number;
    name: string;
    academic_year: string;
    join_code: string | null;
}

interface ManageStudentsProps {
    classroom: ClassroomInfo;
    classroomStudents: Student[];
    availableStudents: Student[];
}

export default function ManageStudents({
    classroom,
    classroomStudents: initialEnrolled,
    availableStudents: initialAvailable,
}: ManageStudentsProps) {
    const [enrolled, setEnrolled] = useState<Student[]>(initialEnrolled);
    const [available, setAvailable] = useState<Student[]>(initialAvailable);
    const [enrolledSearch, setEnrolledSearch] = useState('');
    const [availableSearch, setAvailableSearch] = useState('');
    const [selectedEnrolled, setSelectedEnrolled] = useState<number[]>([]);
    const [selectedAvailable, setSelectedAvailable] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const filteredEnrolled = useMemo(() => {
        if (!enrolledSearch) {
return enrolled;
}

        const q = enrolledSearch.toLowerCase();

        return enrolled.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.username.toLowerCase().includes(q),
        );
    }, [enrolled, enrolledSearch]);

    const filteredAvailable = useMemo(() => {
        if (!availableSearch) {
return available;
}

        const q = availableSearch.toLowerCase();

        return available.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.username.toLowerCase().includes(q),
        );
    }, [available, availableSearch]);

    const handleAdd = useCallback((student: Student) => {
        setAvailable((prev) => prev.filter((s) => s.id !== student.id));
        setEnrolled((prev) =>
            [...prev, student].sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
        );
        setSelectedAvailable((prev) => prev.filter((id) => id !== student.id));
    }, []);

    const handleRemove = useCallback((student: Student) => {
        setEnrolled((prev) => prev.filter((s) => s.id !== student.id));
        setAvailable((prev) =>
            [...prev, student].sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
        );
        setSelectedEnrolled((prev) => prev.filter((id) => id !== student.id));
    }, []);

    const handleBulkAdd = useCallback(() => {
        const toAdd = available.filter((s) => selectedAvailable.includes(s.id));
        setAvailable((prev) => prev.filter((s) => !selectedAvailable.includes(s.id)));
        setEnrolled((prev) =>
            [...prev, ...toAdd].sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
        );
        setSelectedAvailable([]);
    }, [available, selectedAvailable]);

    const handleBulkRemove = useCallback(() => {
        const toRemove = enrolled.filter((s) => selectedEnrolled.includes(s.id));
        setEnrolled((prev) => prev.filter((s) => !selectedEnrolled.includes(s.id)));
        setAvailable((prev) =>
            [...prev, ...toRemove].sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
        );
        setSelectedEnrolled([]);
    }, [enrolled, selectedEnrolled]);

    const toggleEnrolled = (id: number) => {
        setSelectedEnrolled((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id],
        );
    };

    const toggleAvailable = (id: number) => {
        setSelectedAvailable((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id],
        );
    };

    const toggleAllEnrolled = () => {
        if (selectedEnrolled.length === filteredEnrolled.length) {
            setSelectedEnrolled([]);
        } else {
            setSelectedEnrolled(filteredEnrolled.map((s) => s.id));
        }
    };

    const toggleAllAvailable = () => {
        if (selectedAvailable.length === filteredAvailable.length) {
            setSelectedAvailable([]);
        } else {
            setSelectedAvailable(filteredAvailable.map((s) => s.id));
        }
    };

    const handleSave = useCallback(() => {
        setIsSaving(true);

        router.post(
            update.url(classroom.id),
            { student_ids: enrolled.map((s) => s.id) },
            {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Siswa Berhasil Diperbarui!',
                        text: `${enrolled.length} siswa terdaftar di ${classroom.name}.`,
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl border-none shadow-2xl',
                        },
                    });
                },
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Gagal memperbarui siswa.',
                        confirmButtonColor: '#ef4444',
                        customClass: {
                            popup: 'rounded-2xl border-none shadow-2xl',
                        },
                    });
                },
                onFinish: () => setIsSaving(false),
            },
        );
    }, [enrolled, classroom]);

    const handleCopyCode = useCallback((code: string) => {
        navigator.clipboard.writeText(code);
        Swal.fire({
            icon: 'success',
            title: 'Disalin!',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl border-none shadow-2xl' },
        });
    }, []);

    const hasChanges = useMemo(() => {
        const initialIds = new Set(initialEnrolled.map((s) => s.id));
        const currentIds = new Set(enrolled.map((s) => s.id));

        if (initialIds.size !== currentIds.size) {
return true;
}

        for (const id of initialIds) {
            if (!currentIds.has(id)) {
return true;
}
        }

        return false;
    }, [enrolled, initialEnrolled]);

    return (
        <>
            <Head title={`Kelola Siswa: ${classroom.name} - Admin`} />

            <motion.div
                className="space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title={`Kelola Siswa: ${classroom.name}`}
                    subtitle={`Tahun ajaran ${classroom.academic_year}`}
                    icon={<Users className="h-6 w-6" />}
                    role="admin"
                />

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.08 },
                        },
                    }}
                >
                    <StatCard
                        title="Siswa Terdaftar"
                        value={enrolled.length}
                        icon={<Users className="h-6 w-6" />}
                        color="success"
                        delay={0.05}
                    />
                    <StatCard
                        title="Siswa Tersedia"
                        value={available.length}
                        icon={<Users className="h-6 w-6" />}
                        color="info"
                        delay={0.1}
                    />
                    <StatCard
                        title="Kode Gabung"
                        value={classroom.join_code || '-'}
                        icon={<Copy className="h-6 w-6" />}
                        color="warning"
                        delay={0.15}
                        onClick={() =>
                            classroom.join_code &&
                            handleCopyCode(classroom.join_code)
                        }
                    />
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: Enrolled Students */}
                    <motion.div
                        className="rounded-2xl border border-(--palette-green)/20 bg-white shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="border-b border-(--palette-green)/10 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--palette-green)/10">
                                    <Users className="h-4 w-4 text-(--palette-green)" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">
                                        Siswa di Kelas
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {enrolled.length} siswa terdaftar
                                    </p>
                                </div>
                                {filteredEnrolled.length > 0 && (
                                    <div className="ml-auto flex items-center gap-2">
                                        <Checkbox
                                            checked={
                                                selectedEnrolled.length ===
                                                    filteredEnrolled.length &&
                                                filteredEnrolled.length > 0
                                            }
                                            onCheckedChange={toggleAllEnrolled}
                                            className="border-(--palette-green)/30 data-[state=checked]:bg-(--palette-green) data-[state=checked]:border-(--palette-green)"
                                        />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Pilih Semua
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="enrolled-search"
                                    type="text"
                                    value={enrolledSearch}
                                    onChange={(e) =>
                                        setEnrolledSearch(e.target.value)
                                    }
                                    placeholder="Cari siswa..."
                                    className="w-full rounded-xl border border-(--palette-limelight)/30 bg-(--palette-limelight)/5 py-2 pr-4 pl-10 text-sm focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20"
                                />
                            </div>
                        </div>
                        <div className="max-h-100 overflow-y-auto p-2">
                            {filteredEnrolled.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    {enrolledSearch
                                        ? 'Tidak ditemukan'
                                        : 'Belum ada siswa'}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredEnrolled.map((student) => (
                                        <motion.div
                                            key={student.id}
                                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                                                selectedEnrolled.includes(
                                                    student.id,
                                                )
                                                    ? 'bg-(--palette-green)/5'
                                                    : 'hover:bg-(--palette-limelight)/5'
                                            }`}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedEnrolled.includes(
                                                        student.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleEnrolled(
                                                            student.id,
                                                        )
                                                    }
                                                    className="border-(--palette-green)/30 data-[state=checked]:bg-(--palette-green) data-[state=checked]:border-(--palette-green)"
                                                />
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--palette-green)/10 text-sm font-bold text-(--palette-green)">
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
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                onClick={() =>
                                                    handleRemove(student)
                                                }
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Available Students */}
                    <motion.div
                        className="rounded-2xl border border-(--palette-limelight)/20 bg-white shadow-sm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <div className="border-b border-(--palette-limelight)/10 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--palette-limelight)/10">
                                    <Users className="h-4 w-4 text-(--palette-limelight)" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">
                                        Siswa Tersedia
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {available.length} siswa tersedia
                                    </p>
                                </div>
                                {filteredAvailable.length > 0 && (
                                    <div className="ml-auto flex items-center gap-2">
                                        <Checkbox
                                            checked={
                                                selectedAvailable.length ===
                                                    filteredAvailable.length &&
                                                filteredAvailable.length > 0
                                            }
                                            onCheckedChange={toggleAllAvailable}
                                            className="border-(--palette-limelight)/50 data-[state=checked]:bg-(--palette-limelight) data-[state=checked]:border-(--palette-limelight) data-[state=checked]:text-black"
                                        />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Pilih Semua
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="available-search"
                                    type="text"
                                    value={availableSearch}
                                    onChange={(e) =>
                                        setAvailableSearch(e.target.value)
                                    }
                                    placeholder="Cari siswa..."
                                    className="w-full rounded-xl border border-(--palette-limelight)/30 bg-(--palette-limelight)/5 py-2 pr-4 pl-10 text-sm focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20"
                                />
                            </div>
                        </div>
                        <div className="max-h-100 overflow-y-auto p-2">
                            {filteredAvailable.length === 0 ? (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    {availableSearch
                                        ? 'Tidak ditemukan'
                                        : 'Tidak ada siswa tersedia'}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredAvailable.map((student) => (
                                        <motion.div
                                            key={student.id}
                                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                                                selectedAvailable.includes(
                                                    student.id,
                                                )
                                                    ? 'bg-(--palette-limelight)/10'
                                                    : 'hover:bg-(--palette-limelight)/5'
                                            }`}
                                            layout
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedAvailable.includes(
                                                        student.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleAvailable(
                                                            student.id,
                                                        )
                                                    }
                                                    className="border-(--palette-limelight)/50 data-[state=checked]:bg-(--palette-limelight) data-[state=checked]:border-(--palette-limelight) data-[state=checked]:text-black"
                                                />
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--palette-limelight)/10 text-sm font-bold text-(--palette-limelight)">
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
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-(--palette-green) hover:bg-(--palette-green)/10"
                                                onClick={() =>
                                                    handleAdd(student)
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Save Actions */}
                <motion.div
                    className="flex items-center justify-between rounded-2xl border border-(--palette-limelight)/20 bg-white p-4 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.visit(classroomsIndex.url())
                        }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Kelas
                    </Button>

                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <motion.span
                                className="text-xs font-medium text-(--palette-sunflower)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                ● Ada perubahan belum disimpan
                            </motion.span>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                            className="bg-(--palette-green) font-bold text-white shadow-sm shadow-(--palette-green)/20 transition-all hover:bg-(--palette-green)/90 hover:scale-105 active:scale-95 disabled:opacity-50"
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
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                {/* Bulk Action Toolbar */}
                <AnimatePresence>
                    {(selectedEnrolled.length > 0 ||
                        selectedAvailable.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 50, x: '-50%' }}
                            className="fixed bottom-6 left-1/2 z-50 flex w-[92%] max-w-2xl items-center justify-between gap-4 rounded-2xl border border-(--palette-limelight)/20 bg-white p-3 shadow-2xl shadow-black/10 ring-1 ring-black/5 md:bottom-24 md:w-auto md:justify-start md:gap-10 md:p-4"
                        >
                            <div className="flex items-center gap-2 border-r border-(--palette-limelight)/20 pr-4 md:gap-3 md:pr-10">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--palette-green)/10 text-(--palette-green) md:h-10 md:w-10">
                                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground md:text-sm">
                                        {selectedEnrolled.length ||
                                            selectedAvailable.length}{' '}
                                        Terpilih
                                    </p>
                                    <p className="hidden text-xs text-muted-foreground md:block">
                                        Aksi masal tersedia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedEnrolled([]);
                                        setSelectedAvailable([]);
                                    }}
                                    className="h-9 px-2 text-xs font-medium text-muted-foreground hover:bg-(--palette-limelight)/10 rounded-xl md:h-10 md:px-4 md:text-sm"
                                >
                                    <X className="mr-1 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                                    Batal
                                </Button>

                                {selectedAvailable.length > 0 ? (
                                    <Button
                                        onClick={handleBulkAdd}
                                        className="h-9 bg-(--palette-green) px-3 text-xs font-bold text-white shadow-lg shadow-(--palette-green)/20 transition-all hover:bg-(--palette-green)/90 hover:scale-105 active:scale-95 rounded-xl md:h-10 md:px-6 md:text-sm"
                                    >
                                        <Plus className="mr-1 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                                        Tambah Ke Kelas
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleBulkRemove}
                                        className="h-9 bg-red-500 px-3 text-xs font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 hover:scale-105 active:scale-95 rounded-xl md:h-10 md:px-6 md:text-sm"
                                    >
                                        <Minus className="mr-1 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                                        Keluarkan Dari Kelas
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
