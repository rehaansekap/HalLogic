import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    Check,
    Edit,
    Plus,
    Search,
    Shield,
    Trash,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import StatCard from '@/components/custom/cards/StatCard';
import AvatarWithBadge from '@/components/custom/common/AvatarWithBadge';
import EmptyState from '@/components/custom/common/EmptyState';
import FilterButton from '@/components/custom/common/FilterButton';
import Pagination from '@/components/custom/common/Pagination';
import PageHeader from '@/components/custom/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    index as usersIndex,
    create,
    edit,
    destroy,
    bulkDestroy,
} from '@/routes/admin/users';

interface UserData {
    id: number;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    avatar: string | null;
    xp: number;
    level: number;
    created_at: string;
}

interface PaginatedUsers {
    data: UserData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UserStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
}

interface Filters {
    role: string;
    search: string;
}

interface AdminUsersIndexProps {
    users: PaginatedUsers;
    stats: UserStats;
    filters: Filters;
}

const ROLE_BADGE_CLASSES: Record<string, string> = {
    admin: 'bg-(--palette-sunflower)/20 text-(--palette-sunflower)',
    teacher: 'bg-(--palette-yellow-green)/20 text-(--palette-yellow-green)',
    student: 'bg-(--palette-limelight)/20 text-(--palette-limelight)',
};

const ROLE_OPTIONS = [
    { value: 'all', label: 'Semua Role' },
    { value: 'student', label: 'Siswa' },
    { value: 'teacher', label: 'Guru' },
    { value: 'admin', label: 'Admin' },
];

export default function AdminUsersIndex({
    users,
    stats,
    filters,
}: AdminUsersIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const applyFilters = useCallback(
        (newRole?: string, newSearch?: string) => {
            const role = newRole ?? roleFilter;
            const search = newSearch ?? searchValue;

            router.get(
                usersIndex.url(),
                {
                    ...(role !== 'all' ? { role } : {}),
                    ...(search ? { search } : {}),
                },
                { preserveState: true, preserveScroll: true },
            );
        },
        [roleFilter, searchValue],
    );

    const handleRoleChange = useCallback(
        (role: string) => {
            setRoleFilter(role);
            applyFilters(role, searchValue);
        },
        [applyFilters, searchValue],
    );

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            applyFilters(roleFilter, searchValue);
        },
        [applyFilters, roleFilter, searchValue],
    );

    const handleDelete = useCallback((user: UserData) => {
        Swal.fire({
            title: 'Hapus User?',
            html: `User <strong>${user.name}</strong> akan dihapus permanen.`,
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
                router.delete(destroy.url(user.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Dihapus!',
                            text: `User ${user.name} berhasil dihapus.`,
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

    const handlePageChange = useCallback(
        (page: number) => {
            router.get(
                usersIndex.url(),
                {
                    page,
                    ...(roleFilter !== 'all' ? { role: roleFilter } : {}),
                    ...(searchValue ? { search: searchValue } : {}),
                },
                { preserveState: true, preserveScroll: true },
            );
        },
        [roleFilter, searchValue],
    );

    const toggleSelectAll = useCallback(() => {
        if (selectedIds.length === users.data.length && users.data.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(users.data.map((u) => u.id));
        }
    }, [selectedIds.length, users.data]);

    const toggleSelectUser = useCallback((id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }, []);

    const handleBulkDelete = useCallback(() => {
        Swal.fire({
            title: 'Hapus Users Terpilih?',
            html: `<strong>${selectedIds.length}</strong> user akan dihapus permanen.`,
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
                router.delete(bulkDestroy.url(), {
                    data: { ids: selectedIds },
                    preserveScroll: true,
                    onSuccess: () => {
                        const count = selectedIds.length;
                        setSelectedIds([]);
                        Swal.fire({
                            icon: 'success',
                            title: 'Dihapus!',
                            text: `${count} user berhasil dihapus.`,
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
    }, [selectedIds]);

    return (
        <>
            <Head title="Kelola User - Admin" />

            <motion.div
                className="space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <PageHeader
                    title="Kelola User"
                    subtitle="Manajemen seluruh user dalam sistem"
                    icon={<Users className="h-6 w-6" />}
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
                        title="Total User"
                        value={stats.totalUsers}
                        icon={<Users className="h-6 w-6" />}
                        color="primary"
                        delay={0.05}
                    />
                    <StatCard
                        title="Siswa"
                        value={stats.totalStudents}
                        icon={<Users className="h-6 w-6" />}
                        color="success"
                        delay={0.1}
                    />
                    <StatCard
                        title="Guru"
                        value={stats.totalTeachers}
                        icon={<BookOpen className="h-6 w-6" />}
                        color="info"
                        delay={0.15}
                    />
                    <StatCard
                        title="Admin"
                        value={stats.totalAdmins}
                        icon={<Shield className="h-6 w-6" />}
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
                        {/* Role filter */}
                        <FilterButton
                            label="Filter Role"
                            options={ROLE_OPTIONS.filter((opt) => opt.value !== 'all').map((opt) => ({
                                id: opt.value,
                                name: opt.label,
                            }))}
                            value={roleFilter === 'all' ? undefined : roleFilter}
                            onChange={(val) => handleRoleChange(val?.toString() || 'all')}
                            placeholder="Semua Role"
                            color="primary"
                            className="w-48"
                        />

                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center gap-2"
                        >
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="user-search"
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    placeholder="Cari nama, email, username..."
                                    className="w-64 rounded-xl border border-(--palette-limelight)/30 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20 transition-all"
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

                    {/* Add button */}
                    <Link href={create.url()}>
                        <Button className="bg-(--palette-green) font-bold text-white shadow-sm shadow-(--palette-green)/20 transition-all hover:bg-(--palette-green)/90 hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah User
                        </Button>
                    </Link>
                </motion.div>

                {/* Table */}
                {users.data.length === 0 ? (
                    <EmptyState
                        icon={<Users className="h-8 w-8" />}
                        title="Belum ada user"
                        description="Tambahkan user baru untuk memulai."
                        action={{
                            label: 'Tambah User',
                            onClick: () => router.visit(create.url()),
                        }}
                    />
                ) : (
                    <motion.div
                        className="overflow-hidden rounded-xl border border-(--palette-yellow-green)/10 bg-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-(--palette-limelight)/10 bg-(--palette-limelight)/5">
                                        <th className="w-10 px-6 py-3">
                                            <Checkbox
                                                checked={
                                                    users.data.length > 0 &&
                                                    selectedIds.length ===
                                                        users.data.length
                                                }
                                                onCheckedChange={
                                                    toggleSelectAll
                                                }
                                                className="border-(--palette-limelight)/30 data-[state=checked]:bg-(--palette-green) data-[state=checked]:border-(--palette-green)"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                                            Username
                                        </th>
                                        <th className="hidden px-6 py-3 text-left text-sm font-semibold text-foreground md:table-cell">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                                            Role
                                        </th>
                                        <th className="hidden px-6 py-3 text-center text-sm font-semibold text-foreground lg:table-cell">
                                            XP / Level
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user, idx) => (
                                        <motion.tr
                                            key={user.id}
                                            className="border-b border-(--palette-yellow-green)/10 transition-colors hover:bg-(--palette-limelight)/5"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.35 + idx * 0.03,
                                            }}
                                        >
                                            <td className="px-6 py-4">
                                                <Checkbox
                                                    checked={selectedIds.includes(
                                                        user.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleSelectUser(
                                                            user.id,
                                                        )
                                                    }
                                                    className="border-(--palette-limelight)/30 data-[state=checked]:bg-(--palette-green) data-[state=checked]:border-(--palette-green)"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <AvatarWithBadge
                                                        src={
                                                            user.avatar
                                                                ? `/storage/${user.avatar}`
                                                                : undefined
                                                        }
                                                        name={user.name}
                                                        role={user.role}
                                                        size="md"
                                                    />
                                                    <span className="font-semibold text-foreground">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                @{user.username}
                                            </td>
                                            <td className="hidden px-6 py-4 text-sm text-muted-foreground md:table-cell">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    className={`capitalize ${ROLE_BADGE_CLASSES[user.role] || ''}`}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="hidden px-6 py-4 text-center lg:table-cell">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    {user.xp} XP / Lv.
                                                    {user.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={edit.url(
                                                            user.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-(--palette-green) hover:bg-(--palette-green)/10"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                        onClick={() =>
                                                            handleDelete(user)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="border-t border-(--palette-limelight)/10 p-4">
                            <Pagination
                                currentPage={users.current_page}
                                totalPages={users.last_page}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Bulk Actions Toolbar */}
                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 50, x: '-50%' }}
                            className="fixed bottom-6 left-1/2 z-50 flex w-[92%] max-w-2xl items-center justify-between gap-4 rounded-2xl border border-(--palette-limelight)/20 bg-white p-3 shadow-2xl shadow-black/10 ring-1 ring-black/5 md:bottom-8 md:w-auto md:justify-start md:gap-10 md:p-4"
                        >
                            <div className="flex items-center gap-2 border-r border-(--palette-limelight)/20 pr-4 md:gap-3 md:pr-10">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--palette-green)/10 text-(--palette-green) md:h-10 md:w-10">
                                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground md:text-sm">
                                        {selectedIds.length} Terpilih
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
                                    onClick={() => setSelectedIds([])}
                                    className="h-9 px-2 text-xs font-medium text-muted-foreground hover:bg-(--palette-limelight)/10 rounded-xl md:h-10 md:px-4 md:text-sm"
                                >
                                    <X className="mr-1 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleBulkDelete}
                                    className="h-9 bg-red-500 px-3 text-xs font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 hover:scale-105 active:scale-95 rounded-xl md:h-10 md:px-6 md:text-sm"
                                >
                                    <Trash className="mr-1 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                                    Hapus
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
