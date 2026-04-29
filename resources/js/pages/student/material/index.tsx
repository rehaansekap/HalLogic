import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import MaterialHeader from '@/components/custom/material/MaterialHeader';
import MaterialSidebar from '@/components/custom/material/MaterialSidebar';
import Phase1Orientation from '@/components/custom/material/Phase1Orientation';
import Phase2Organization from '@/components/custom/material/Phase2Organization';
import Phase3CreativeLab from '@/components/custom/material/Phase3CreativeLab';
import Phase4Submission from '@/components/custom/material/Phase4Submission';
import Phase5Evaluation from '@/components/custom/material/Phase5Evaluation';

interface Material {
    id: number;
    title: string;
    slug: string;
    description: string;
    difficulty_level: 'easy' | 'medium' | 'hard';
    video_url?: string;
}

interface GroupMember {
    id: number;
    user_id: number;
    group_id: number;
    role: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface GallerySubmission {
    id: number;
    group_code: string;
    group_name: string;
    file_url: string;
    file_name: string;
    likes_count: number;
    feedbacks_count: number;
}

interface VotableGroup {
    id: number;
    group_code: string;
    group_name: string;
}

interface MaterialPageProps {
    material: Material;
    currentStep: number;
    groupMembers: GroupMember[];
    currentUserRole: string;
    groupHasSubmitted: boolean;
    initialReflection?: string;
    finalReflection?: string;
    gallerySubmissions: GallerySubmission[];
    groupStatus: 'locked' | 'active' | 'completed' | null;
    unreviewedSubmissions: Array<{ group_name: string; group_code: string }>;
    voteData: {
        has_voted: boolean;
        my_vote?: number;
        votable_groups: VotableGroup[];
        all_groups_submitted: boolean;
    };
    collaborationLink?: string | null;
    leaderRequirementsCompleted: boolean;
}

export default function MaterialPage({
    material,
    currentStep,
    groupMembers,
    currentUserRole,
    groupHasSubmitted,
    initialReflection,
    finalReflection,
    gallerySubmissions,
    groupStatus,
    unreviewedSubmissions,
    voteData,
    collaborationLink,
    leaderRequirementsCompleted,
}: MaterialPageProps) {
    const [pollingActive] = useState(true);
    const lastPollTimeRef = useRef<number>(0);

    // Setup polling untuk real-time updates
    useEffect(() => {
        if (!pollingActive || !initialReflection) {
            return;
        }

        // initialize last poll time once after mount to avoid calling Date.now() during render
        lastPollTimeRef.current = Date.now();

        const pollInterval = setInterval(() => {
            const now = Date.now();

            // Poll every 3 seconds during active phases
            if (now - lastPollTimeRef.current > 3000) {
                router.reload({
                    only: [
                        'groupMembers',
                        'currentStep',
                        'groupStatus',
                        'gallerySubmissions',
                        'voteData',
                        'unreviewedSubmissions',
                    ],
                });
                lastPollTimeRef.current = now;
            }
        }, 1000);

        return () => clearInterval(pollInterval);
    }, [pollingActive, initialReflection]);

    const isLocked = material && !initialReflection;
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

    return (
        <>
            <Head title={material.title} />

            <motion.div
                className="bg-white"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <MaterialHeader
                    title={material.title}
                    description={material.description}
                    difficulty={material.difficulty_level}
                    currentStep={currentStep}
                    groupStatus={groupStatus}
                    isLocked={isLocked}
                />

                {/* Content */}
                <div className="container mx-auto max-w-7xl px-4 py-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <motion.div
                            className="space-y-8 lg:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Phase 1 */}
                            {currentStep >= 1 && (
                                <Phase1Orientation
                                    materialId={material.id}
                                    materialSlug={material.slug}
                                    hasInitialReflection={!!initialReflection}
                                    initialReflectionText={initialReflection}
                                    groupExists={groupMembers.length > 0}
                                />
                            )}

                            {/* Phase 2 */}
                            {currentStep >= 1 && (
                                <Phase2Organization
                                    materialSlug={material.slug}
                                    groupMembers={groupMembers}
                                    currentUserRole={currentUserRole}
                                    isLeader={currentUserRole === 'Leader'}
                                    groupStatus={groupStatus}
                                    currentStep={currentStep}
                                />
                            )}

                            {/* Phase 3 */}
                            {currentStep >= 1 && (
                                <Phase3CreativeLab
                                    materialSlug={material.slug}
                                    currentStep={currentStep}
                                    currentUserRole={currentUserRole}
                                    groupStatus={groupStatus}
                                />
                            )}

                            {/* Phase 4 */}
                            {currentStep >= 1 && (
                                <Phase4Submission
                                    materialSlug={material.slug}
                                    currentStep={currentStep}
                                    currentUserRole={currentUserRole}
                                    groupHasSubmitted={groupHasSubmitted}
                                />
                            )}

                            {/* Phase 5 */}
                            {currentStep >= 1 && (
                                <Phase5Evaluation
                                    materialSlug={material.slug}
                                    currentStep={currentStep}
                                    currentUserRole={currentUserRole}
                                    gallerySubmissions={gallerySubmissions}
                                    votableGroups={voteData.votable_groups}
                                    voteData={voteData}
                                    finalReflection={finalReflection}
                                    unreviewedSubmissions={
                                        unreviewedSubmissions
                                    }
                                    leaderRequirementsCompleted={
                                        leaderRequirementsCompleted
                                    }
                                />
                            )}
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            className="lg:col-span-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="sticky top-6">
                                <MaterialSidebar
                                    groupMembers={groupMembers}
                                    currentUserRole={currentUserRole}
                                    groupStatus={groupStatus}
                                    collaborationLink={collaborationLink}
                                    currentStep={currentStep}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
