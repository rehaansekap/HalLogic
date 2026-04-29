import {
    ArrowDownTrayIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    PhotoIcon,
    StarIcon as StarHeroIcon,
} from '@heroicons/react/24/outline';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Heart, MessageSquare, Send, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GallerySubmission {
    id: number;
    group_code: string;
    group_name: string;
    files: string[];
    likes_count: number;
    feedbacks_count: number;
}

interface VotableGroup {
    id: number;
    group_code: string;
    group_name: string;
}

interface Phase3EvaluationProps {
    materialSlug: string;
    currentStep: number;
    gallerySubmissions: GallerySubmission[];
    votableGroups: VotableGroup[];
    voteData: {
        has_voted: boolean;
        my_vote?: number;
        all_groups_submitted: boolean;
    };
    finalReflection?: string;
    unreviewedSubmissions: Array<{ group_name: string; group_code: string }>;
    requirementsCompleted: boolean;
}

export default function Phase3Evaluation({
    materialSlug,
    currentStep,
    gallerySubmissions,
    votableGroups,
    voteData,
    finalReflection = '',
    unreviewedSubmissions,
    requirementsCompleted,
}: Phase3EvaluationProps) {
    const [selectedVote, setSelectedVote] = useState<number | null>(
        voteData.my_vote || null,
    );
    const [reflection, setReflection] = useState(finalReflection);
    const [activeTab, setActiveTab] = useState<
        'gallery' | 'voting' | 'reflection'
    >('gallery');

    const isPhaseActive = currentStep >= 3;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    if (!isPhaseActive) {
        return (
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-4">
                        <Star className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Fase 3: Evaluasi & Penilaian
                        </h2>
                        <p className="text-muted-foreground">
                            Fase ini akan dibuka setelah eksperimen selesai
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
                variants={itemVariants}
            >
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-(--palette-sunflower)/8 p-4">
                        <Star className="h-6 w-6 text-(--palette-sunflower)" />
                    </div>
                    <div className="flex-1">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            Fase 3: Evaluasi & Penilaian
                        </h2>
                        <p className="text-muted-foreground">
                            Lihat karya kelompok lain, berikan feedback, voting,
                            dan refleksi akhir Anda
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Group Requirements */}
            {!requirementsCompleted && (
                <motion.div
                    className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4"
                    variants={itemVariants}
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                    <div>
                        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <ClipboardDocumentListIcon className="h-4 w-4 shrink-0" />
                            Tugas Kelompok yang Belum Selesai
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {unreviewedSubmissions.length > 0 && (
                                <li>
                                    • Berikan feedback untuk{' '}
                                    {unreviewedSubmissions.length} karya
                                </li>
                            )}
                            {!voteData.has_voted && (
                                <li>• Pilih kelompok terbaik untuk voting</li>
                            )}
                        </ul>
                    </div>
                </motion.div>
            )}

            {/* Tabs */}
            <motion.div
                className="flex gap-2 border-b border-(--palette-limelight)/20"
                variants={itemVariants}
            >
                {['gallery', 'voting', 'reflection'].map((tab) => (
                    <button
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                            activeTab === tab
                                ? 'border-(--palette-green) text-(--palette-green)'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab === 'gallery' && (
                            <>
                                <PhotoIcon className="mr-1.5 inline-block h-4 w-4" />
                                Galeri Karya
                            </>
                        )}
                        {tab === 'voting' && (
                            <>
                                <StarHeroIcon className="mr-1.5 inline-block h-4 w-4" />
                                Voting
                            </>
                        )}
                        {tab === 'reflection' && (
                            <>
                                <ChatBubbleLeftRightIcon className="mr-1.5 inline-block h-4 w-4" />
                                Refleksi Akhir
                            </>
                        )}
                    </button>
                ))}
            </motion.div>

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
                <motion.div
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {gallerySubmissions.length > 0 ? (
                        gallerySubmissions.map((submission) => (
                            <motion.div
                                key={submission.id}
                                className="overflow-hidden rounded-lg border border-(--palette-limelight)/20 bg-white transition-shadow hover:shadow-lg"
                                variants={itemVariants}
                            >
                                <div className="border-b border-(--palette-limelight)/10 p-4">
                                    <p className="font-semibold text-foreground">
                                        {submission.group_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Kode: {submission.group_code}
                                    </p>
                                </div>
                                <div className="space-y-3 p-4">
                                    <div className="space-y-2">
                                        {submission.files && submission.files.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={`/storage/${file}`}
                                                download
                                                className="flex items-center justify-between gap-2 w-full rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <ArrowDownTrayIcon className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">{file.split('/').pop()}</span>
                                                </div>
                                                <span className="shrink-0 text-[10px] opacity-60">Unduh</span>
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Heart className="h-4 w-4" />
                                            {submission.likes_count} suka
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            {submission.feedbacks_count}{' '}
                                            feedback
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full py-8 text-center"
                            variants={itemVariants}
                        >
                            <p className="text-muted-foreground">
                                Belum ada karya yang dikumpulkan
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Voting Tab */}
            {activeTab === 'voting' && (
                <motion.div
                    className="rounded-xl border border-(--palette-limelight)/20 bg-white p-6"
                    variants={itemVariants}
                >
                    {!voteData.all_groups_submitted ? (
                        <div className="py-8 text-center">
                            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-500 opacity-50" />
                            <p className="text-muted-foreground">
                                Tunggu semua kelompok menyelesaikan pengumpulan
                                sebelum voting
                            </p>
                        </div>
                    ) : voteData.has_voted ? (
                        <div className="py-8 text-center">
                            <Star className="mx-auto mb-4 h-12 w-12 text-(--palette-sunflower) opacity-50" />
                            <p className="font-semibold text-foreground">
                                Kelompok Anda sudah memberikan suara
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Pilihan: Kelompok #{voteData.my_vote}
                            </p>
                        </div>
                    ) : (
                        <Form
                            method="post"
                            action={`/material/${materialSlug}/vote`}
                        >
                            {({ processing, wasSuccessful }) => (
                                <div className="space-y-4">
                                    <p className="mb-4 text-sm font-semibold text-foreground">
                                        Pilih kelompok terbaik:
                                    </p>
                                    <div className="space-y-2">
                                        {votableGroups.map((group) => (
                                            <label
                                                key={group.id}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-(--palette-limelight)/20 p-3 transition-colors hover:bg-(--palette-limelight)/5"
                                            >
                                                <input
                                                    type="radio"
                                                    name="voted_group_id"
                                                    value={group.id}
                                                    checked={
                                                        selectedVote ===
                                                        group.id
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedVote(
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="h-4 w-4 cursor-pointer"
                                                />
                                                <span className="flex-1 font-semibold text-foreground">
                                                    {group.group_name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {group.group_code}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !selectedVote ||
                                            wasSuccessful
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--palette-sunflower) py-3 font-semibold text-white hover:shadow-lg disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Voting...
                                            </>
                                        ) : (
                                            <>
                                                <Star className="h-5 w-5" />
                                                Berikan Suara
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    )}
                </motion.div>
            )}

            {/* Reflection Tab */}
            {activeTab === 'reflection' && (
                <motion.div
                    className="rounded-xl border border-(--palette-limelight)/20 bg-white p-6"
                    variants={itemVariants}
                >
                    {finalReflection ? (
                        <div>
                            <p className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                                <CheckCircleIcon className="h-4 w-4 text-(--palette-green)" />
                                Refleksi Akhir Tersimpan
                            </p>
                            <div className="rounded-lg bg-(--palette-green)/10 p-4 text-sm text-foreground">
                                {finalReflection}
                            </div>
                        </div>
                    ) : (
                        <Form
                            method="post"
                            action={`/material/${materialSlug}/finish`}
                        >
                            {({ processing, wasSuccessful }) => (
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-foreground">
                                        Refleksi Akhir Anda
                                    </label>
                                    <textarea
                                        name="final_reflection"
                                        value={reflection}
                                        onChange={(e) =>
                                            setReflection(e.target.value)
                                        }
                                        placeholder="Tuliskan pengalaman, pembelajaran, dan hal yang dapat ditingkatkan..."
                                        className="resize-vertical min-h-50 w-full rounded-lg border border-(--palette-limelight)/20 px-4 py-3 focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/20 focus:outline-none"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            reflection.length < 50 ||
                                            wasSuccessful
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--palette-green) py-3 font-semibold text-white hover:shadow-lg disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Kirim Refleksi Akhir
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
