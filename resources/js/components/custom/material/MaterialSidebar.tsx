import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileUp, FileText, CheckCircle2, Loader2, X, Inbox, Lock, Download, Award } from 'lucide-react';
import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { savePhase3 } from '@/actions/App/Http/Controllers/Student/MaterialController';
import { Button } from '@/components/ui/button';

const MySwal = withReactContent(Swal);

// Declare route for Ziggy if not available globally in types


interface GroupMember {
    user_id: number;
    name: string;
    username: string;
    is_leader: boolean;
    avatar?: string;
}

interface MaterialSidebarProps {
    groupMembers: GroupMember[];
    currentStep: number;
    slug: string;
    submission?: {
        files: string[] | null;
        submitted_at: string | null;
        grade?: {
            id: number;
            score: number;
            teacher_notes: string | null;
            created_at?: string;
            updated_at?: string;
        } | null;
    } | null;
    attendance?: {
        is_present: boolean;
        updated_at: string;
    } | null;
    materialPdf?: string;
}

export default function MaterialSidebar({
    groupMembers,
    currentStep,
    slug,
    submission,
    attendance,
    materialPdf,
}: MaterialSidebarProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { auth } = usePage<any>().props;
    const isLeader = groupMembers.find(m => m.user_id === auth.user.id)?.is_leader;

    const { data, setData, post, processing, errors, reset } = useForm({
        files: [] as File[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setData('files', [...data.files, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setData('files', data.files.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLeader) {
            return;
        }

        MySwal.fire({
            title: 'Konfirmasi Pengumpulan',
            text: 'Apakah Kamu yakin ingin mengumpulkan berkas ini? Pengumpulan hanya dapat dilakukan satu kali.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Kirim!',
            cancelButtonText: 'Batal',
            background: '#ffffff',
            customClass: {
                title: 'text-lg font-bold text-slate-800',
                htmlContainer: 'text-sm text-slate-600',
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg',
                cancelButton: 'bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                post(savePhase3.url({ slug }), {
                    forceFormData: true,
                    onSuccess: () => {
                        reset();
                        MySwal.fire({
                            title: 'Berhasil!',
                            text: 'Berkas berhasil dikirim.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                });
            }
        });
    };

    const isSubmitted = !!submission?.files && submission.files.length > 0;
    const submittedFiles = submission?.files || [];


    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Nilai & Umpan Balik Guru */}
            {submission?.grade && (
                <motion.div
                    className="group relative overflow-hidden rounded-xl border border-[--palette-green]/30 bg-gradient-to-br from-[--palette-green]/10 to-[--palette-limelight]/5 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between border-b border-[--palette-green]/10 pb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-[--palette-green]/15 p-1.5 text-[--palette-green]">
                                    <Award className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Hasil Evaluasi
                                    </p>
                                    <h3 className="text-xs font-bold text-foreground">
                                        Nilai Tugas
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-0.5 rounded-lg bg-white/70 px-2.5 py-1 shadow-sm border border-[--palette-green]/10">
                                <span className="text-xl font-black text-[--palette-green]">
                                    {submission.grade.score}
                                </span>
                                <span className="text-[10px] font-bold text-slate-450">
                                    /100
                                </span>
                            </div>
                        </div>

                        {submission.grade.teacher_notes && (
                            <div className="rounded-lg bg-white/60 p-2.5 border border-slate-200/50">
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                    Catatan Guru
                                </p>
                                <p className="mt-1 text-xs text-slate-650 line-clamp-3 leading-relaxed italic">
                                    "{submission.grade.teacher_notes}"
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Attendance Status */}
            <motion.div
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className={`absolute inset-0 transition-all duration-300 ${attendance?.is_present ? 'bg-green-50/50 group-hover:bg-green-50' : attendance ? 'bg-red-50/50 group-hover:bg-red-50' : 'bg-amber-50/50 group-hover:bg-amber-50'}`} />
                <div className="relative z-10 flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${attendance?.is_present ? 'bg-green-100' : attendance ? 'bg-red-100' : 'bg-amber-100'}`}>
                        {attendance?.is_present ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : attendance ? (
                            <X className="h-5 w-5 text-red-600" />
                        ) : (
                            <Users className="h-5 w-5 text-amber-600" />
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status Kehadiran
                        </p>
                        <p className={`text-sm font-black ${attendance?.is_present ? 'text-green-600' : attendance ? 'text-red-600' : 'text-amber-600'}`}>
                            {attendance?.is_present ? 'Hadir' : attendance ? 'Tidak Hadir' : 'Belum Diverifikasi Guru'}
                        </p>
                        {(!attendance || !attendance.is_present) && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {attendance ? 'Kehadiran Anda tidak disetujui oleh guru.' : 'Pastikan kehadiranmu diverifikasi oleh guru.'}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Group Members */}
            <motion.div
                className="group relative overflow-hidden rounded-xl border border-[--palette-limelight]/30 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
            >
                <div className="absolute inset-0 bg-(--palette-limelight)/5 transition-all duration-300 group-hover:bg-(--palette-limelight)/10" />
                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-[--palette-limelight]/15 p-1.5">
                            <Users className="h-4 w-4 text-[--palette-limelight]" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">
                            Anggota Kelompok{' '}
                            <span className="font-black text-[--palette-limelight]">
                                ({groupMembers.length})
                            </span>
                        </h3>
                    </div>

                    {groupMembers.length > 0 ? (
                        <div className="space-y-2">
                            {groupMembers.map((member, idx) => (
                                <motion.div
                                    key={member.user_id}
                                    className="group/member flex items-center justify-between gap-2 rounded-lg border border-slate-200/50 bg-slate-50 p-3 transition-all duration-200 hover:shadow-sm"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-foreground">
                                            {member.name || 'Unknown'}
                                        </p>
                                        <p className="truncate text-[10px] font-medium text-muted-foreground">
                                            @{member.username}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {member.is_leader ? (
                                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[8px] font-black tracking-tighter text-amber-700 uppercase ring-1 ring-amber-200">
                                                Ketua
                                            </span>
                                        ) : (
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-black tracking-tighter text-slate-700 uppercase ring-1 ring-slate-200">
                                                Anggota
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-6 text-center">
                            <Inbox className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                            <p className="text-xs font-medium text-muted-foreground">
                                Belum ada anggota kelompok
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

        </motion.div>
    );
}
