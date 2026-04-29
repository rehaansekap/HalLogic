import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Zap, BookOpen } from 'lucide-react';
import { useState, useMemo } from 'react';
import LevelBar from '@/components/custom/cards/LevelBar';
import MaterialCard from '@/components/custom/cards/MaterialCard';
import EmptyState from '@/components/custom/common/EmptyState';
import FilterButton from '@/components/custom/common/FilterButton';
import Pagination from '@/components/custom/common/Pagination';
import PageHeader from '@/components/custom/layout/PageHeader';
import DashboardSkeleton from '@/components/custom/skeletons/DashboardSkeleton';

interface Material {
    id: number;
    slug: string;
    title: string;
    description: string;
    difficulty_level: 1 | 2 | 3;
    classroom_name: string;
    teacher_name: string;
    status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
    progress?: number;
    prerequisite?: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface StudentDashboardProps {
    materials: Material[];
    teachers: Teacher[];
    userXp: number;
    userLevel: number;
    user: {
        name: string;
    };
}

const MATERIALS_PER_PAGE = 6;

export default function StudentDashboard({
    materials = [],
    teachers = [],
    userXp = 0,
    userLevel = 1,
    user,
}: StudentDashboardProps) {
    const [selectedTeacher, setSelectedTeacher] = useState<
        string | number | null
    >(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading] = useState(false);

    // Filter materials by teacher
    const filteredMaterials = useMemo(() => {
        if (!selectedTeacher) {
            return materials;
        }

        return materials.filter(
            (m) =>
                m.teacher_name ===
                teachers.find((t) => t.id === selectedTeacher)?.name,
        );
    }, [materials, selectedTeacher, teachers]);

    // Paginate materials
    const totalPages = Math.ceil(filteredMaterials.length / MATERIALS_PER_PAGE);
    const paginatedMaterials = filteredMaterials.slice(
        (currentPage - 1) * MATERIALS_PER_PAGE,
        currentPage * MATERIALS_PER_PAGE,
    );

    // Estimate next level XP (simple formula)
    const nextLevelXp = (userLevel + 1) * 1000;
    const currentXp = userXp % nextLevelXp;

    const containerVariants = {
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
                <Head title="Dashboard - Student" />
                <div className="space-y-6">
                    <DashboardSkeleton role="student" />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Dashboard - Student" />

            <motion.div
                className="space-y-6 p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Page Header */}
                <PageHeader
                    title={`Welcome back, ${user?.name || 'Student'}!`}
                    subtitle="Track your materials and level up"
                    icon={<Zap className="h-6 w-6" />}
                    role="student"
                    userName={user?.name}
                />

                {/* Level Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <LevelBar
                        level={userLevel}
                        currentXp={currentXp}
                        nextLevelXp={nextLevelXp}
                        totalXp={userXp}
                        delay={0.3}
                    />
                </motion.div>

                {/* Materials Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                >
                    {/* Header with Filter */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-2xl font-bold">
                                <BookOpen className="h-6 w-6 text-[--palette-green]" />
                                Unlocked Materials
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {filteredMaterials.length} material
                                {filteredMaterials.length !== 1 ? 's' : ''}{' '}
                                Unlocked
                            </p>
                        </div>

                        {teachers.length > 0 && (
                            <FilterButton
                                label="Filter by Teacher"
                                options={teachers}
                                value={selectedTeacher}
                                onChange={setSelectedTeacher}
                                placeholder="All Teachers"
                                color="success"
                            />
                        )}
                    </div>

                    {/* Materials Grid */}
                    {filteredMaterials.length === 0 ? (
                        <EmptyState
                            icon={<BookOpen className="h-8 w-8" />}
                            title="No materials yet"
                            description="Check back soon for new materials from your teachers!"
                            delay={0.45}
                        />
                    ) : paginatedMaterials.length === 0 ? (
                        <EmptyState
                            icon={<BookOpen className="h-8 w-8" />}
                            title="No materials on this page"
                            description="Try a different filter or check the previous page"
                            delay={0.45}
                        />
                    ) : (
                        <>
                            <motion.div
                                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {paginatedMaterials.map((material, idx) => (
                                    <motion.div
                                        key={material.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.45 + idx * 0.05,
                                            duration: 0.4,
                                        }}
                                    >
                                        <MaterialCard
                                            id={material.id}
                                            // pass slug so parent can navigate
                                            // onClick will navigate to the material page
                                            title={material.title}
                                            description={material.description}
                                            difficulty={
                                                material.difficulty_level
                                            }
                                            classroom={material.classroom_name}
                                            teacher={material.teacher_name}
                                            status={material.status}
                                            progress={material.progress || 0}
                                            prerequisite={material.prerequisite}
                                            delay={0}
                                            onClick={() => {
                                                // Navigate to student material page
                                                router.visit(
                                                    `/material/${material.slug}`,
                                                );
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <motion.div
                                    className="mt-8 flex justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.4 }}
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
