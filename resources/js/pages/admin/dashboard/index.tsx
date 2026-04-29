import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    BookOpen,
    Building2,
    CheckCircle2,
    Cpu,
    Database,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import StatCard from '@/components/custom/cards/StatCard';
import AvatarWithBadge from '@/components/custom/common/AvatarWithBadge';
import Pagination from '@/components/custom/common/Pagination';
import PageHeader from '@/components/custom/layout/PageHeader';
import DashboardSkeleton from '@/components/custom/skeletons/DashboardSkeleton';
import { Badge } from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    avatar?: string;
    created_at: string;
}

interface AdminDashboardProps {
    totalStudents: number;
    totalTeachers: number;
    totalClassrooms: number;
    totalMaterials: number;
    latestUsers: User[];
    user: {
        name: string;
    };
}

const USERS_PER_PAGE = 5;

export default function AdminDashboard({
    totalStudents = 0,
    totalTeachers = 0,
    totalClassrooms = 0,
    totalMaterials = 0,
    latestUsers = [],
    user,
}: AdminDashboardProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading] = useState(false);

    const totalPages = Math.ceil(latestUsers.length / USERS_PER_PAGE);
    const paginatedUsers = latestUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE,
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const statVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    if (isLoading) {
        return (
            <>
                <Head title="Dashboard - Admin" />
                <div className="space-y-6">
                    <DashboardSkeleton role="admin" />
                </div>
            </>
        );
    }

    // Console Log All Data from props as JSON in one Console Log
    console.log(
        'All Data:',
        JSON.stringify(
            {
                totalStudents,
                totalTeachers,
                totalClassrooms,
                totalMaterials,
                latestUsers,
                user,
            },
            null,
            2,
        ),
    );

    return (
        <>
            <Head title="Dashboard - Admin" />

            <motion.div
                className="space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Page Header */}
                <PageHeader
                    title={`Welcome back, ${user?.name || 'Admin'}!`}
                    subtitle="System monitoring and management dashboard"
                    icon={<Zap className="h-6 w-6" />}
                    role="admin"
                    userName={user?.name}
                />

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
                    variants={statVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <StatCard
                        title="Total Students"
                        value={totalStudents}
                        icon={<Users className="h-6 w-6" />}
                        color="success"
                        delay={0.05}
                        trend={{
                            value: 8,
                            isPositive: true,
                        }}
                    />
                    <StatCard
                        title="Total Teachers"
                        value={totalTeachers}
                        icon={<BookOpen className="h-6 w-6" />}
                        color="info"
                        delay={0.1}
                        trend={{
                            value: 2,
                            isPositive: true,
                        }}
                    />
                    <StatCard
                        title="Total Classrooms"
                        value={totalClassrooms}
                        icon={<Building2 className="h-6 w-6" />}
                        color="warning"
                        delay={0.15}
                    />
                    <StatCard
                        title="Total Materials"
                        value={totalMaterials}
                        icon={<Zap className="h-6 w-6" />}
                        color="primary"
                        delay={0.2}
                        trend={{
                            value: 15,
                            isPositive: true,
                        }}
                    />
                </motion.div>

                {/* System Health & Latest Users Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* System Health Panel */}
                    <motion.div
                        className="rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/8 p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                    >
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                            <Activity className="h-5 w-5 text-(--palette-green)" />
                            System Health
                        </h3>

                        <div className="space-y-3">
                            {/* Database Status */}
                            <motion.div
                                className="flex items-center justify-between rounded-lg border border-(--palette-green)/20 bg-white/50 p-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-(--palette-green)/20"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                        }}
                                    >
                                        <Database className="h-4 w-4 text-(--palette-green)" />
                                    </motion.div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Database
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Connected
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                    }}
                                >
                                    <CheckCircle2 className="h-5 w-5 text-(--palette-green)" />
                                </motion.div>
                            </motion.div>

                            {/* Cache Status */}
                            <motion.div
                                className="flex items-center justify-between rounded-lg border border-(--palette-limelight)/20 bg-white/50 p-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-(--palette-limelight)/20"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                        }}
                                    >
                                        <Cpu className="h-4 w-4 text-(--palette-limelight)" />
                                    </motion.div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Cache
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Optimal
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                    }}
                                >
                                    <CheckCircle2 className="h-5 w-5 text-(--palette-limelight)" />
                                </motion.div>
                            </motion.div>

                            {/* Queue Status */}
                            <motion.div
                                className="flex items-center justify-between rounded-lg border border-(--palette-chartreuse)/20 bg-white/50 p-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-(--palette-chartreuse)/20"
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                        }}
                                    >
                                        <Activity className="h-4 w-4 text-(--palette-chartreuse)" />
                                    </motion.div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Queue
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Processing
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        delay: 0.5,
                                    }}
                                >
                                    <CheckCircle2 className="h-5 w-5 text-(--palette-chartreuse)" />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Overall Status */}
                        <motion.div
                            className="mt-4 rounded-lg border border-(--palette-green)/20 bg-(--palette-green)/10 p-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.4 }}
                        >
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-(--palette-green)">
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                All systems operational
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Latest Users Table */}
                    <motion.div
                        className="overflow-hidden rounded-xl border border-(--palette-yellow-green)/10 bg-white lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.4 }}
                    >
                        <div className="border-b border-(--palette-limelight)/10 p-6">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <Users className="h-5 w-5 text-(--palette-green)" />
                                Latest Users
                            </h3>
                        </div>

                        {latestUsers.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                No users yet
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-(--palette-limelight)/10 bg-(--palette-limelight)/5">
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                                                    Joined
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedUsers.map((user, idx) => (
                                                <motion.tr
                                                    key={user.id}
                                                    className="border-b border-(--palette-yellow-green)/10 transition-colors hover:bg-(--palette-limelight)/5"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.35 + idx * 0.05,
                                                    }}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <AvatarWithBadge
                                                                src={
                                                                    user.avatar
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
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge
                                                            className={`capitalize ${user.role ===
                                                                'admin'
                                                                ? 'bg-(--palette-sunflower)/20 text-(--palette-sunflower)'
                                                                : user.role ===
                                                                    'teacher'
                                                                    ? 'bg-(--palette-yellow-green)/20 text-(--palette-yellow-green)'
                                                                    : 'bg-(--palette-limelight)/20 text-(--palette-limelight)'
                                                                }`}
                                                        >
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                        {formatDate(
                                                            user.created_at,
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <motion.div
                                        className="flex justify-center border-t border-(--palette-limelight)/10 p-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.55,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Pagination>
                                            <PaginationContent>
                                                {currentPage > 1 && (
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    currentPage -
                                                                    1,
                                                                )
                                                            }
                                                            className="cursor-pointer hover:bg-(--palette-limelight)/10"
                                                        />
                                                    </PaginationItem>
                                                )}

                                                {Array.from({
                                                    length: totalPages,
                                                }).map((_, idx) => {
                                                    const pageNum = idx + 1;
                                                    const shouldShow =
                                                        pageNum === 1 ||
                                                        pageNum ===
                                                        totalPages ||
                                                        Math.abs(
                                                            pageNum -
                                                            currentPage,
                                                        ) <= 1;

                                                    if (!shouldShow) {
                                                        return null;
                                                    }

                                                    return (
                                                        <PaginationItem
                                                            key={pageNum}
                                                            isActive={
                                                                pageNum ===
                                                                currentPage
                                                            }
                                                        >
                                                            <PaginationLink
                                                                onClick={() =>
                                                                    setCurrentPage(
                                                                        pageNum,
                                                                    )
                                                                }
                                                                className={`cursor-pointer transition-all ${pageNum ===
                                                                    currentPage
                                                                    ? 'bg-(--palette-green) text-white'
                                                                    : 'hover:bg-(--palette-limelight)/10'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                })}

                                                {currentPage < totalPages && (
                                                    <PaginationItem>
                                                        <PaginationNext
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    currentPage +
                                                                    1,
                                                                )
                                                            }
                                                            className="cursor-pointer hover:bg-(--palette-limelight)/10"
                                                        />
                                                    </PaginationItem>
                                                )}
                                            </PaginationContent>
                                        </Pagination>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
