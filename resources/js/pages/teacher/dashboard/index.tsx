import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Clock,
    Edit2,
    Eye,
    MoreHorizontal,
    Search,
    Users,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import StatCard from '@/components/custom/cards/StatCard';
import EmptyState from '@/components/custom/common/EmptyState';
import FilterButton from '@/components/custom/common/FilterButton';
import Pagination from '@/components/custom/common/Pagination';
import PageHeader from '@/components/custom/layout/PageHeader';
import DashboardSkeleton from '@/components/custom/skeletons/DashboardSkeleton';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import DeleteMaterialButton from '@/pages/teacher/material/components/DeleteMaterialButton';
import { show } from '@/routes/teacher/material';
import { create, edit } from '@/routes/teacher/materials';

interface Material {
    id: number;
    slug: string;
    title: string;
    description: string;
    difficulty_level: 'easy' | 'medium' | 'hard';
    classroom_name: string;
    total_groups: number;
    completed_groups: number;
    needs_review: number;
    started_at: string;
    finished_at?: string;
}

interface Classroom {
    id: number;
    name: string;
}

interface TeacherDashboardProps {
    materials: Material[];
    classrooms: Classroom[];
    totalMaterials: number;
    totalStudents: number;
    activeMaterials: number;
    pendingReview: number;
    user: {
        name: string;
    };
}

const MATERIALS_PER_PAGE = 8;

export default function TeacherDashboard({
    materials = [],
    classrooms = [],
    totalMaterials = 0,
    totalStudents = 0,
    activeMaterials = 0,
    pendingReview = 0,
    user,
}: TeacherDashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState<
        string | number | null
    >(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading] = useState(false);

    // Filter materials by search and classroom
    const filteredMaterials = useMemo(() => {
        return materials.filter((material) => {
            const matchesSearch =
                material.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                material.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesClassroom =
                !selectedClassroom ||
                material.classroom_name ===
                    classrooms.find((c) => c.id === selectedClassroom)?.name;

            return matchesSearch && matchesClassroom;
        });
    }, [materials, searchQuery, selectedClassroom, classrooms]);

    // Paginate materials
    const totalPages = Math.ceil(filteredMaterials.length / MATERIALS_PER_PAGE);
    const paginatedMaterials = filteredMaterials.slice(
        (currentPage - 1) * MATERIALS_PER_PAGE,
        currentPage * MATERIALS_PER_PAGE,
    );

    const statVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    if (isLoading) {
        return (
            <>
                <Head title="Dashboard - Teacher" />
                <div className="space-y-6">
                    <DashboardSkeleton role="teacher" />
                </div>
            </>
        );
    }

    // Console Log All Data from props as JSON in one Console Log
    console.log(
        'All Data:',
        JSON.stringify(
            {
                materials,
                classrooms,
                totalMaterials,
                totalStudents,
                activeMaterials,
                pendingReview,
                user,
            },
            null,
            2,
        ),
    );

    return (
        <>
            <Head title="Dashboard - Teacher" />

            <motion.div
                className="space-y-8 p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* Page Header */}
                <PageHeader
                    title={`Welcome back, ${user?.name || 'Teacher'}!`}
                    subtitle="Manage your materials and student progress"
                    icon={<BookOpen className="h-6 w-6" />}
                    role="teacher"
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
                        title="Total Materials"
                        value={totalMaterials}
                        icon={<BookOpen className="h-6 w-6" />}
                        color="primary"
                        delay={0.1}
                    />
                    <StatCard
                        title="Total Students"
                        value={totalStudents}
                        icon={<Users className="h-6 w-6" />}
                        color="success"
                        delay={0.15}
                    />
                    <StatCard
                        title="Active Materials"
                        value={activeMaterials}
                        icon={<Zap className="h-6 w-6" />}
                        color="warning"
                        delay={0.2}
                    />
                    <StatCard
                        title="Pending Review"
                        value={pendingReview}
                        icon={<Clock className="h-6 w-6" />}
                        color="info"
                        delay={0.25}
                        trend={{
                            value: 12,
                            isPositive: false,
                        }}
                    />
                </motion.div>

                {/* Materials Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    {/* Header with Search and Filter */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h2 className="flex items-center gap-2 text-2xl font-extrabold text-foreground tracking-tight">
                                    <BookOpen className="h-7 w-7 text-(--palette-green)" />
                                    Your Materials
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Manage and monitor your learning content
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row">
                            <div className="w-full min-h-full relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search materials..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="border-(--palette-yellow-green)/30 pl-10 focus:border-(--palette-green) focus:ring-(--palette-limelight)/20"
                                />
                            </div>

                            {classrooms.length > 0 && (
                                <FilterButton
                                    label="Filter by Classroom"
                                    className="max-w-2xl"
                                    options={classrooms}
                                    value={selectedClassroom ?? undefined}
                                    onChange={(val) => {
                                        setSelectedClassroom(val);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="All Classrooms"
                                    color="success"
                                />
                            )}

                            <Link href={create().url}>
                                <Button className="min-w-full bg-(--palette-green) hover:bg-(--palette-green)/90 text-white font-bold shadow-lg shadow-(--palette-green)/20 transition-all hover:scale-105 active:scale-95">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Tambah Material
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Materials Table */}
                    {filteredMaterials.length === 0 ? (
                        <EmptyState
                            icon={<BookOpen className="h-8 w-8" />}
                            title="No materials found"
                            description="Create a new material to get started!"
                            delay={0.35}
                        />
                    ) : (
                        <>
                            <motion.div
                                className="overflow-hidden rounded-xl border border-(--palette-yellow-green)/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-(--palette-limelight)/20 bg-(--palette-limelight)/5">
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Material Details
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Target Class
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Group Progress
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Review Status
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedMaterials.map(
                                                (material, idx) => (
                                                    <motion.tr
                                                        key={material.id}
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
                                                                0.35 +
                                                                idx * 0.05,
                                                        }}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="line-clamp-1 font-semibold text-foreground">
                                                                    {
                                                                        material.title
                                                                    }
                                                                </p>
                                                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                                                    {
                                                                        material.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                                            {
                                                                material.classroom_name
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className="h-2 max-w-xs flex-1 overflow-hidden rounded-full bg-(--palette-limelight)/10">
                                                                    <motion.div
                                                                        className="h-full bg-(--palette-green)"
                                                                        initial={{
                                                                            width: 0,
                                                                        }}
                                                                        animate={{
                                                                            width: `${(material.completed_groups / material.total_groups) * 100}%`,
                                                                        }}
                                                                        transition={{
                                                                            delay:
                                                                                0.35 +
                                                                                idx *
                                                                                    0.05 +
                                                                                0.1,
                                                                            duration: 0.6,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="w-12 text-xs font-semibold text-(--palette-green)">
                                                                    {
                                                                        material.completed_groups
                                                                    }
                                                                    /
                                                                    {
                                                                        material.total_groups
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span
                                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    material.needs_review >
                                                                    0
                                                                        ? 'bg-(--palette-sunflower)/20 text-(--palette-sunflower)'
                                                                        : 'bg-(--palette-green)/20 text-(--palette-green)'
                                                                }`}
                                                            >
                                                                {
                                                                    material.needs_review
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Link
                                                                    href={show.url(
                                                                        material.slug,
                                                                    )}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-9 w-9 rounded-full text-(--palette-green) hover:bg-(--palette-green)/10 transition-transform active:scale-90"
                                                                        title="View Material"
                                                                    >
                                                                        <Eye className="h-5 w-5" />
                                                                    </Button>
                                                                </Link>

                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-9 w-9 rounded-full hover:bg-gray-100 transition-transform active:scale-90"
                                                                        >
                                                                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-(--palette-limelight)/20 bg-white/95 backdrop-blur-sm">
                                                                        <Link href={edit.url(material.slug)}>
                                                                            <DropdownMenuItem className="flex items-center gap-3 cursor-pointer py-3 px-4 rounded-xl focus:bg-(--palette-green)/10 focus:text-(--palette-green) transition-colors mb-1">
                                                                                <Edit2 className="h-4 w-4" />
                                                                                <span className="font-semibold">Edit Material</span>
                                                                            </DropdownMenuItem>
                                                                        </Link>
                                                                        <DropdownMenuSeparator className="my-1 bg-(--palette-limelight)/10" />
                                                                        <div className="p-1">
                                                                            <DeleteMaterialButton
                                                                                materialId={material.id}
                                                                                materialTitle={material.title}
                                                                                variant="dropdown"
                                                                            />
                                                                        </div>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <motion.div
                                    className="mt-8 flex justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}
