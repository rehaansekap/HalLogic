import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Building2,
    Copy,
    Edit,
    Plus,
    Search,
    Star,
    Trash2,
    TrendingUp,
    Users,
    UserPlus,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import StatCard from '@/components/custom/cards/StatCard';
import EmptyState from '@/components/custom/common/EmptyState';
import FilterButton from '@/components/custom/common/FilterButton';
import Pagination from '@/components/custom/common/Pagination';
import PageHeader from '@/components/custom/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    index as classroomsIndex,
    create,
    edit,
    destroy,
} from '@/routes/admin/classrooms';
import { manage } from '@/routes/admin/classrooms/students';

interface ClassroomData {
    id: number;
    name: string;
    academic_year: string;
    join_code: string | null;
    teacher_id: number;
    teacher_name: string;
    teacher_avatar: string | null;
    students_count: number;
    created_at: string;
}

interface PaginatedClassrooms {
    data: ClassroomData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ClassroomStats {
    totalClassrooms: number;
    totalStudents: number;
    averageStudents: number;
    mostPopular: { name: string; count: number } | null;
}

interface Teacher {
    id: number;
    name: string;
    avatar: string | null;
}

interface Filters {
    teacher_id: string;
    academic_year: string;
    search: string;
}

interface AdminClassroomsIndexProps {
    classrooms: PaginatedClassrooms;
    stats: ClassroomStats;
    teachers: Teacher[];
    academicYears: string[];
    filters: Filters;
}

export default function AdminClassroomsIndex({
    classrooms,
    stats,
    teachers,
    academicYears,
    filters,
}: AdminClassroomsIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [teacherFilter, setTeacherFilter] = useState(
        filters.teacher_id || 'all',
    );
    const [yearFilter, setYearFilter] = useState(
        filters.academic_year || 'all',
    );

    const applyFilters = useCallback(
        (newTeacher?: string, newYear?: string, newSearch?: string) => {
            const teacher_id = newTeacher ?? teacherFilter;
            const academic_year = newYear ?? yearFilter;
            const search = newSearch ?? searchValue;

            router.get(
                classroomsIndex.url(),
                {
                    ...(teacher_id !== 'all' ? { teacher_id } : {}),
                    ...(academic_year !== 'all' ? { academic_year } : {}),
                    ...(search ? { search } : {}),
                },
                { preserveState: true, preserveScroll: true },
            );
        },
        [teacherFilter, yearFilter, searchValue],
    );

    const handleTeacherChange = useCallback(
        (value: string) => {
            setTeacherFilter(value);
            applyFilters(value, yearFilter, searchValue);
        },
        [applyFilters, yearFilter, searchValue],
    );

    const handleYearChange = useCallback(
        (value: string) => {
            setYearFilter(value);
            applyFilters(teacherFilter, value, searchValue);
        },
        [applyFilters, teacherFilter, searchValue],
    );

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            applyFilters(teacherFilter, yearFilter, searchValue);
        },
        [applyFilters, teacherFilter, yearFilter, searchValue],
    );

    const handleDelete = useCallback((classroom: ClassroomData) => {
        Swal.fire({
            title: 'Hapus Kelas?',
            html: `Kelas <strong>${classroom.name}</strong> dan semua data terkait akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-2xl border-none shadow-2xl',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(destroy.url(classroom.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Dihapus!',
                            text: `Kelas ${classroom.name} berhasil dihapus.`,
                            timer: 2000,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'rounded-2xl border-none shadow-2xl',
                            },
                        });
                    },
                });
            }
        });
    }, []);

    const handleCopyCode = useCallback((code: string) => {
        navigator.clipboard.writeText(code);
        Swal.fire({
            icon: 'success',
            title: 'Disalin!',
            text: `Kode ${code} berhasil disalin.`,
            timer: 1500,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl border-none shadow-2xl',
            },
        });
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            router.get(
                classroomsIndex.url(),
                {
                    page,
                    ...(teacherFilter !== 'all'
                        ? { teacher_id: teacherFilter }
                        : {}),
                    ...(yearFilter !== 'all'
                        ? { academic_year: yearFilter }
                        : {}),
                    ...(searchValue ? { search: searchValue } : {}),
                },
                { preserveState: true, preserveScroll: true },
            );
        },
        [teacherFilter, yearFilter, searchValue],
    );

    return (
        <>
            <Head title="Kelola Kelas - Admin" />

            <motion.div
                className="space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Kelola Kelas"
                    subtitle="Manajemen seluruh kelas dalam sistem"
                    icon={<Building2 className="h-6 w-6" />}
                    role="admin"
                />

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
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
                        title="Total Kelas"
                        value={stats.totalClassrooms}
                        icon={<Building2 className="h-6 w-6" />}
                        color="primary"
                        delay={0.05}
                    />
                    <StatCard
                        title="Total Siswa"
                        value={stats.totalStudents}
                        icon={<Users className="h-6 w-6" />}
                        color="success"
                        delay={0.1}
                    />
                    <StatCard
                        title="Rata-rata / Kelas"
                        value={stats.averageStudents}
                        icon={<TrendingUp className="h-6 w-6" />}
                        color="info"
                        delay={0.15}
                    />
                    <StatCard
                        title="Paling Populer"
                        value={
                            stats.mostPopular
                                ? `${stats.mostPopular.name} (${stats.mostPopular.count})`
                                : '-'
                        }
                        icon={<Star className="h-6 w-6" />}
                        color="warning"
                        delay={0.2}
                    />
                </motion.div>

                {/* Filters & Actions */}
                <motion.div
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <FilterButton
                            label="Filter Guru"
                            options={teachers.map((t) => ({
                                id: t.id.toString(),
                                name: t.name,
                            }))}
                            value={
                                teacherFilter === 'all'
                                    ? undefined
                                    : teacherFilter
                            }
                            onChange={(val) =>
                                handleTeacherChange(val?.toString() || 'all')
                            }
                            placeholder="Semua Guru"
                            color="success"
                            className="w-48"
                        />

                        <FilterButton
                            label="Filter Tahun"
                            options={academicYears.map((y) => ({
                                id: y,
                                name: y,
                            }))}
                            value={
                                yearFilter === 'all' ? undefined : yearFilter
                            }
                            onChange={(val) =>
                                handleYearChange(val?.toString() || 'all')
                            }
                            placeholder="Semua Tahun"
                            color="warning"
                            className="w-40"
                        />

                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
                        >
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="classroom-search"
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Cari nama kelas..."
                                    className="w-52 rounded-xl border border-(--palette-limelight)/30 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20 transition-all"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-(--palette-green) text-white hover:bg-(--palette-green)/90"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    <Link href={create.url()}>
                        <Button className="bg-(--palette-green) font-bold text-white shadow-sm shadow-(--palette-green)/20 transition-all hover:bg-(--palette-green)/90 hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kelas
                        </Button>
                    </Link>
                </motion.div>

                {/* Classroom Cards */}
                {classrooms.data.length === 0 ? (
                    <EmptyState
                        icon={<Building2 className="h-8 w-8" />}
                        title="Belum ada kelas"
                        description="Buat kelas baru untuk memulai."
                        action={{
                            label: 'Tambah Kelas',
                            onClick: () => router.visit(create.url()),
                        }}
                    />
                ) : (
                    <>
                        <motion.div
                            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.06 },
                                },
                            }}
                        >
                            {classrooms.data.map((classroom) => (
                                <motion.div
                                    key={classroom.id}
                                    className="group rounded-xl border border-(--palette-limelight)/20 bg-white p-5 shadow-sm transition-all hover:border-(--palette-green)/30 hover:shadow-md"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    whileHover={{ y: -2 }}
                                >
                                    {/* Card Header */}
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">
                                                {classroom.name}
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className="mt-1 border-(--palette-limelight)/30 text-xs"
                                            >
                                                {classroom.academic_year}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-lg bg-(--palette-green)/10 px-2 py-1">
                                            <Users className="h-3.5 w-3.5 text-(--palette-green)" />
                                            <span className="text-sm font-bold text-(--palette-green)">
                                                {classroom.students_count}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Teacher */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--palette-yellow-green)/20 text-xs font-bold text-(--palette-yellow-green)">
                                            {classroom.teacher_name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {classroom.teacher_name}
                                        </span>
                                    </div>

                                    {/* Join Code */}
                                    {classroom.join_code && (
                                        <div className="mb-4 flex items-center gap-2">
                                            <div className="flex flex-1 items-center gap-2 rounded-lg border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 px-3 py-1.5">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    Kode:
                                                </span>
                                                <span className="font-mono text-sm font-bold text-(--palette-green)">
                                                    {classroom.join_code}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-(--palette-green) hover:bg-(--palette-green)/10"
                                                onClick={() =>
                                                    handleCopyCode(
                                                        classroom.join_code!,
                                                    )
                                                }
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 border-t border-(--palette-limelight)/10 pt-3">
                                        <Link
                                            href={edit.url(classroom.id)}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs"
                                            >
                                                <Edit className="mr-1 h-3 w-3" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link
                                            href={manage.url(classroom.id)}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs text-(--palette-green) border-(--palette-green)/30 hover:bg-(--palette-green)/10"
                                            >
                                                <UserPlus className="mr-1 h-3 w-3" />
                                                Siswa
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                                            onClick={() =>
                                                handleDelete(classroom)
                                            }
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        <div className="mt-4">
                            <Pagination
                                currentPage={classrooms.current_page}
                                totalPages={classrooms.last_page}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </motion.div>
        </>
    );
}
