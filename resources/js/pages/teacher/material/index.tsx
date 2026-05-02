import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import MaterialDetailHeader from './components/MaterialDetailHeader';
import MaterialStats from './components/MaterialStats';
import MaterialTabs from './components/MaterialTabs';
import TabAttendance from './components/TabAttendance';
import TabGroupManagement from './components/TabGroupManagement';
import TabMonitoring from './components/TabMonitoring';

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

interface SubmissionData {
    id: number;
    file_path: string | null;
    code_answer: string | null;
    submitted_at: string | null;
}

interface GradeData {
    score: number;
    teacher_notes: string | null;
}

interface Reflection {
    id: number;
    user_id: number;
    user_name: string;
    username: string;
    avatar: string | null;
    content: string;
    type: string;
    created_at: string;
}

interface MonitoringGroup {
    group_id: number;
    group_name: string;
    group_code: string;
    current_step: number;
    status: string;
    members: GroupMember[];
    submission_id: number | null;
    file_path: string | null;
    code_answer: string | null;
    submitted_at: string | null;
    step3_status: string;
    submission: SubmissionData | null;
    grade: GradeData | null;
    reflections: Reflection[];
}

interface AllReflection {
    user_id: number;
    user_name: string;
    content: string;
    created_at: string;
    type: string;
    group_name: string | null;
}

interface AttendanceRecord {
    student_id: number;
    is_present: boolean;
}

interface Classroom {
    id: number;
    name: string;
    academic_year: string;
}

interface Stats {
    totalGroups: number;
    completedGroups: number;
    inProgressGroups: number;
    notStartedGroups: number;
}

interface MaterialDetailProps {
    material: {
        id: number;
        title: string;
        description: string;
        difficulty_level: string;
        slug: string;
    };
    classroom: Classroom;
    students: Student[];
    groups: Group[];
    groupsMonitoring: MonitoringGroup[];
    allReflections: AllReflection[];
    stats: Stats;
    initialAttendance: AttendanceRecord[];
}

export default function MaterialDetail({
    material,
    students = [],
    groups = [],
    groupsMonitoring = [],
    allReflections = [],
    stats = {
        totalGroups: 0,
        completedGroups: 0,
        inProgressGroups: 0,
        notStartedGroups: 0,
    },
    initialAttendance = [],
}: MaterialDetailProps) {
    const [activeTab, setActiveTab] = useState('attendance');

    return (
        <>
            <Head title={`${material.title} - Material Detail`} />

            <motion.div
                className="space-y-6 p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <MaterialDetailHeader material={material} />

                {/* Stats */}
                <MaterialStats stats={stats} />

                {/* Tabs */}
                <MaterialTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'attendance' && (
                        <TabAttendance
                            materialId={material.id}
                            students={students}
                            initialAttendance={initialAttendance}
                        />
                    )}

                    {activeTab === 'groups' && (
                        <TabGroupManagement
                            materialId={material.id}
                            students={students}
                            groups={groups}
                        />
                    )}

                    {activeTab === 'monitoring' && (
                        <TabMonitoring
                            groupsMonitoring={groupsMonitoring}
                            allReflections={allReflections}
                        />
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}
