import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Award,
    Crown,
    FileText,
    MessageSquare,
    Save,
    X,
    Download,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import Swal from 'sweetalert2';

import { Button } from '@/components/ui/button';
import { grade } from '@/routes/teacher/submission';

interface GroupMember {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    is_leader: boolean;
}

interface SubmissionData {
    id: number;
    files: string[];
    code_answer: string | null;
    submitted_at: string | null;
}

interface GradeData {
    score: number;
    teacher_notes: string | null;
}

interface SubmissionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupName: string;
    members: GroupMember[];
    submission: SubmissionData | null;
    existingGrade: GradeData | null;
    submissionId: number | null;
}

export default function SubmissionDetailModal({
    isOpen,
    onClose,
    groupName,
    members,
    submission,
    existingGrade,
    submissionId,
}: SubmissionDetailModalProps) {
    const [score, setScore] = useState<number>(existingGrade?.score ?? 0);
    const [teacherNotes, setTeacherNotes] = useState<string>(
        existingGrade?.teacher_notes ?? '',
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveGrade = useCallback(() => {
        if (!submissionId) {
            return;
        }

        setIsSaving(true);
        router.post(
            grade.url(submissionId),
            {
                score,
                teacher_notes: teacherNotes || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Nilai Disimpan!',
                        text: `Nilai ${score} berhasil disimpan.`,
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#ffffff',
                        customClass: {
                            popup: 'rounded-2xl border-2 border-green-50 shadow-xl',
                            title: 'text-xl font-bold text-green-600',
                            htmlContainer: 'text-sm text-gray-600',
                        },
                    });
                    onClose();
                },
                onError: (errors) => {
                    const message =
                        Object.values(errors).flat()[0] ||
                        'Gagal menyimpan nilai.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: message,
                        confirmButtonColor: '#ef4444',
                        background: '#ffffff',
                        customClass: {
                            popup: 'rounded-2xl border-2 border-red-50 shadow-xl',
                            title: 'text-xl font-bold text-red-600',
                        },
                    });
                },
                onFinish: () => setIsSaving(false),
            },
        );
    }, [submissionId, score, teacherNotes, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                className="relative w-full max-w-2xl rounded-2xl border border-(--palette-limelight)/20 bg-white shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-(--palette-limelight)/20 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--palette-green)/10">
                            <FileText className="h-4.5 w-4.5 text-(--palette-green)" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">
                                Submission Detail
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {groupName}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-5 space-y-5">
                    {/* Members */}
                    <div>
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Anggota Kelompok
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-2 rounded-lg border border-(--palette-limelight)/20 px-3 py-1.5"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--palette-green)/10 text-[10px] font-bold text-(--palette-green)">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium">
                                        {member.name}
                                    </span>
                                    {member.is_leader && (
                                        <Crown className="h-3 w-3 text-(--palette-sunflower)" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submission Content */}
                    {submission ? (
                        <div>
                            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                File / Jawaban
                            </h3>
                            <div className="rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-4">
                                {submission.files && submission.files.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        {submission.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-(--palette-green)" />
                                                <a
                                                    href={`/storage/${file}`}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm font-medium text-(--palette-green) underline hover:no-underline truncate"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    {file.split('/').pop()}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {submission.code_answer && (
                                    <div>
                                        <p className="mb-1 text-xs font-semibold text-muted-foreground">
                                            Code Answer:
                                        </p>
                                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-green-400">
                                            <code>
                                                {submission.code_answer}
                                            </code>
                                        </pre>
                                    </div>
                                )}
                                {submission.submitted_at && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Dikumpulkan:{' '}
                                        {new Date(
                                            submission.submitted_at,
                                        ).toLocaleString('id-ID')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-4 text-center text-sm text-muted-foreground">
                            Belum ada submission dari kelompok ini.
                        </div>
                    )}

                    {/* Grading Form */}
                    {submission && submissionId && (
                        <div>
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Award className="h-3.5 w-3.5" />
                                Penilaian
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label
                                        htmlFor={`score-${submissionId}`}
                                        className="mb-1 block text-sm font-semibold text-foreground"
                                    >
                                        Nilai (0 — 100)
                                    </label>
                                    <input
                                        id={`score-${submissionId}`}
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={score}
                                        onChange={(e) =>
                                            setScore(
                                                Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Number(e.target.value),
                                                    ),
                                                ),
                                            )
                                        }
                                        className="w-full rounded-xl border border-(--palette-limelight)/30 px-4 py-2.5 text-sm font-semibold focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor={`notes-${submissionId}`}
                                        className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground"
                                    >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        Catatan Guru (Opsional)
                                    </label>
                                    <textarea
                                        id={`notes-${submissionId}`}
                                        value={teacherNotes}
                                        onChange={(e) =>
                                            setTeacherNotes(e.target.value)
                                        }
                                        rows={3}
                                        placeholder="Tulis catatan untuk kelompok ini..."
                                        className="w-full rounded-xl border border-(--palette-limelight)/30 px-4 py-2.5 text-sm focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                {submission && submissionId && (
                    <div className="flex items-center justify-end gap-2 border-t border-(--palette-limelight)/20 p-5">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="font-semibold"
                        >
                            Batal
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSaveGrade}
                            disabled={isSaving}
                            className="bg-(--palette-green) font-bold text-white hover:bg-(--palette-green)/90 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-(--palette-green)/20"
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
                                    Simpan Nilai
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
