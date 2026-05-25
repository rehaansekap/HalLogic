import { Head, usePoll } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MaterialHeader from '@/components/custom/material/MaterialHeader';
import MaterialProgress from '@/components/custom/material/MaterialProgress';
import MaterialSidebar from '@/components/custom/material/MaterialSidebar';
import Phase1Orientation from '@/components/custom/material/Phase1Orientation';
import Phase2Investigation from '@/components/custom/material/Phase2Investigation';
import Phase3Evaluation from '@/components/custom/material/Phase3Evaluation';

interface Material {
    id: number;
    title: string;
    slug: string;
    description: string;
    difficulty_level: 'easy' | 'medium' | 'hard';
    video_url?: string;
    material_pdf?: string;
    learning_objectives?: string[];
    summary?: string;
    pre_reflection_questions?: string[];
    post_reflection_questions?: string[];
    sub_materials?: Array<{
        title: string;
        content: string;
        image_path?: string;
    }>;
    code_examples?: Array<{
        title: string;
        code: string;
        output: string;
        explanation: string;
    }>;
}

interface GroupMember {
    user_id: number;
    name: string;
    username: string;
    is_leader: boolean;
    avatar?: string;
}

interface MaterialPageProps {
    material: Material;
    currentStep: number;
    groupMembers: GroupMember[];
    initialReflection?: string;
    finalReflection?: string;
    groupStatus: 'locked' | 'active' | 'completed' | null;
    submission?: {
        files: string[] | null;
        submitted_at: string | null;
    } | null;
    attendance?: {
        is_present: boolean;
        updated_at: string;
    } | null;
}

export default function MaterialPage({
    material,
    currentStep,
    groupMembers,
    initialReflection,
    finalReflection,
    groupStatus,
    submission,
    attendance,
}: MaterialPageProps) {
    const [activePhase, setActivePhase] = useState(currentStep > 0 ? currentStep : 1);
    const [lastCurrentStep, setLastCurrentStep] = useState(currentStep);

    // Update activePhase if currentStep advances
    if (currentStep !== lastCurrentStep) {
        setLastCurrentStep(currentStep);

        if (currentStep > activePhase) {
            setActivePhase(currentStep);
        }
    }

    // Setup polling untuk real-time updates (Inertia v3)
    usePoll(3000, {
        only: ['groupMembers', 'currentStep', 'groupStatus', 'submission', 'attendance'],
    });

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
                    difficulty={material.difficulty_level === 'easy' ? 1 : material.difficulty_level === 'medium' ? 2 : 3}
                    groupStatus={groupStatus as any}
                    isLocked={isLocked}
                />

                {/* Content */}
                <div className="container mx-auto max-w-7xl px-4 pb-12 pt-2">
                    <MaterialProgress
                        currentStep={currentStep}
                        activePhase={activePhase}
                        onPhaseChange={setActivePhase}
                    />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Main Content */}
                        <motion.div
                            className="space-y-8 lg:col-span-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >

                            {/* Phase 1 */}
                            {activePhase === 1 && (
                                <Phase1Orientation
                                    material={material}
                                    hasInitialReflection={!!initialReflection}
                                    initialReflectionText={initialReflection}
                                    groupExists={groupMembers.length > 0}
                                />
                            )}

                            {/* Phase 2 */}
                            {activePhase === 2 && (
                                 <Phase2Investigation
                                     material={material}
                                     currentStep={currentStep}
                                     groupMembers={groupMembers}
                                     submission={submission}
                                 />
                            )}

                            {/* Phase 3 - Evaluation */}
                            {activePhase === 3 && (
                                <Phase3Evaluation
                                    materialSlug={material.slug}
                                    finalReflection={finalReflection}
                                    questions={material.post_reflection_questions}
                                />
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                                <button
                                    onClick={() => setActivePhase((prev) => Math.max(1, prev - 1))}
                                    disabled={activePhase === 1}
                                    className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200 ${activePhase === 1
                                        ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                        : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    Sebelumnya
                                </button>
                                <button
                                    onClick={() => {
                                        if (activePhase < currentStep && activePhase < 3) {
                                            setActivePhase((prev) => prev + 1);
                                        }
                                    }}
                                    disabled={activePhase >= currentStep || activePhase === 3}
                                    className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
                                        activePhase >= currentStep || activePhase === 3
                                            ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                            : 'bg-(--palette-limelight) text-white hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'
                                    }`}
                                >
                                    Selanjutnya
                                </button>
                            </div>
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
                                    currentStep={currentStep}
                                    slug={material.slug}
                                    submission={submission}
                                    attendance={attendance}
                                    materialPdf={material.material_pdf}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
