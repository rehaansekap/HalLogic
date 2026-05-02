import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileUp, FileText, CheckCircle2, Loader2, X, Inbox, Lock, Download } from 'lucide-react';
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
    } | null;
    materialPdf?: string;
}

export default function MaterialSidebar({
    groupMembers,
    currentStep,
    slug,
    submission,
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
            text: 'Apakah Anda yakin ingin mengumpulkan berkas ini? Pengumpulan hanya dapat dilakukan satu kali.',
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

            {/* Download Material & Tugas - Only in Phase 2+ */}
            {currentStep >= 2 && materialPdf && (
                <motion.div
                    className="group relative overflow-hidden rounded-xl border border-amber-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <div className="absolute inset-0 bg-amber-50/30 transition-all duration-300 group-hover:bg-amber-50" />
                    <div className="relative z-10">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-amber-100 p-1.5">
                                <Download className="h-4 w-4 text-amber-600" />
                            </div>
                            <h3 className="text-base font-bold text-foreground">
                                Materi & Tugas
                            </h3>
                        </div>
                        <p className="mb-4 text-xs text-muted-foreground">
                            Download file materi dan tugas untuk membantu investigasi Anda.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full border-amber-200 bg-white font-bold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                            size="sm"
                            asChild
                        >
                            <a href={`/storage/${materialPdf}`} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-3 w-3" />
                                Download PDF
                            </a>
                        </Button>
                    </div>
                </motion.div>
            )}

        {/* File Upload Section - Only show in Phase 2 Investigation */}
        {currentStep === 2 && (
            <motion.div
                className="group relative overflow-hidden rounded-xl border border-blue-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="absolute inset-0 bg-blue-50/50 transition-all duration-300 group-hover:bg-blue-50" />
                <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-100 p-1.5">
                                <FileUp className="h-4 w-4 text-blue-600" />
                            </div>
                            <h3 className="text-base font-bold text-foreground">
                                Pengumpulan Berkas
                            </h3>
                        </div>
                        {isSubmitted && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Terkirim</span>
                            </div>
                        )}
                    </div>

                    {isSubmitted ? (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-green-100 bg-green-50/50 p-3">
                                <p className="mb-2 text-[10px] font-semibold text-green-700">
                                    Berkas yang telah dikumpulkan:
                                </p>
                                <div className="space-y-1.5">
                                    {submittedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                            <span className="truncate">{file.split('/').pop()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    disabled
                                    className="w-full bg-green-600 font-bold text-white opacity-100 disabled:opacity-100"
                                    size="sm"
                                >
                                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                    Sudah Mengumpulkan
                                </Button>
                            </div>
                        </div>
                    ) : !isLeader ? (
                        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-6 text-center">
                            <Lock className="mx-auto mb-2 h-8 w-8 text-amber-500/50" />
                            <p className="text-sm font-bold text-amber-800">Akses Terkunci</p>
                            <p className="mt-1 text-[10px] leading-relaxed text-amber-700/70">
                                Hanya ketua kelompok yang memiliki otoritas untuk mengumpulkan berkas investigasi ini.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);

                                    if (e.dataTransfer.files) {
                                        setData('files', [...data.files, ...Array.from(e.dataTransfer.files)]);
                                    }
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
                                    isDragging
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                }`}
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    aria-label="Unggah berkas eksperimen"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    accept=".pdf,.doc,.docx,.txt,.c"
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <FileUp className="mx-auto mb-2 h-6 w-6 text-slate-400" />
                                    <p className="text-[10px] font-medium text-slate-500">
                                        Tarik berkas ke sini atau <span className="text-blue-600 font-bold">pilih file</span>
                                    </p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {data.files.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        {data.files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                                                    <span className="truncate">{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    title="Hapus berkas"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(idx);
                                                    }}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {Object.keys(errors).length > 0 && (
                                <div className="space-y-1">
                                    {Object.entries(errors).map(([key, error]) => (
                                        <p key={key} className="text-[10px] font-bold text-red-500">
                                            • {error}
                                    </p>
                                    ))}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={processing || data.files.length === 0}
                                className="w-full bg-blue-600 font-bold text-white hover:bg-blue-700"
                                size="sm"
                            >
                                {processing ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                ) : (
                                    <FileUp className="mr-2 h-3 w-3" />
                                )}
                                Kirim Berkas
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        )}
    </motion.div>
    );
}
