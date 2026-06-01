import { Editor } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code2,
    Copy,
    Play,
    Download,
    Keyboard,
    BookOpen,
    FileText,
    FileUp,
    CheckCircle2,
    Loader2,
    X,
    Lock,
    ChevronDown,
    Check,
    Star,
    Lightbulb,
    ClipboardCheck,
    Monitor,
    PartyPopper,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Button } from '@/components/ui/button';
import { savePhase3 } from '@/actions/App/Http/Controllers/Student/MaterialController';
import { cn } from '@/lib/utils';

const MySwal = withReactContent(Swal);

interface Phase2InvestigationProps {
    material: {
        id: number;
        title: string;
        slug: string;
        description: string;
        difficulty_level: string;
        material_pdf?: string;
        video_url?: string;
        case_narrative?: string;
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
    };
    currentStep: number;
    groupMembers: Array<{
        user_id: number;
        name: string;
        username: string;
        is_leader: boolean;
        avatar?: string;
    }>;
    submission?: {
        files: string[] | null;
        submitted_at: string | null;
    } | null;
}

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

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

export default function Phase2Investigation({
    material,
    currentStep,
    groupMembers,
    submission,
}: Phase2InvestigationProps) {
    const [activeTab, setActiveTab] = useState<'materi' | 'contoh' | 'editor' | 'tugas'>('materi');

    // Accordion expansion states
    const [expandedSubIndices, setExpandedSubIndices] = useState<number[]>([0]);
    const [expandedExampleIndices, setExpandedExampleIndices] = useState<number[]>([0]);

    const toggleSubIndex = (index: number) => {
        setExpandedSubIndices(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleExampleIndex = (index: number) => {
        setExpandedExampleIndices(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    // C compiler states
    const localStorageKey = `compiler_code_${material.slug}`;
    const defaultCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

    const [code, setCode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(localStorageKey);
            if (saved) return saved;
        }
        return defaultCode;
    });
    const [codeOutput, setCodeOutput] = useState('');
    const [stdin, setStdin] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(localStorageKey, code);
        }
    }, [code, localStorageKey]);

    // File submission states (relocated from sidebar)
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { auth } = usePage<any>().props;
    const isLeader = groupMembers.find(m => m.user_id === auth.user.id)?.is_leader;

    const { data, setData, post, processing, errors, reset } = useForm({
        files: [] as File[],
    });

    const isPhaseActive = currentStep >= 2;

    // Actions
    const handleRunCode = async () => {
        setIsRunning(true);
        try {
            const response = await fetch(`/material/${material.slug}/run-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ code, language: 'c', stdin }),
            });

            const data = await response.json();
            let outputResult = '';

            if (data.status) {
                outputResult += `[Status: ${data.status}]\n`;
                if (data.time !== null && data.time !== undefined) {
                    outputResult += `Execution Time: ${data.time}ms\n`;
                }
                outputResult += `----------------------------------------\n\n`;
            }

            if (data.compile_output) {
                outputResult += `[Compilation Output]\n${data.compile_output}\n\n`;
            }

            if (data.stderr) {
                outputResult += `[Error Output]\n${data.stderr}\n\n`;
            }

            if (data.stdout) {
                outputResult += `${data.stdout}\n`;
            }

            if (!data.compile_output && !data.stderr && !data.stdout) {
                outputResult += data.error || 'Tidak ada output dari program.';
            }

            setCodeOutput(outputResult.trim());
        } catch (error) {
            setCodeOutput(
                `Error: ${error instanceof Error ? error.message : 'Gagal menjalankan kode'}`,
            );
        } finally {
            setIsRunning(false);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Kode disalin ke clipboard',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleCopyExampleCode = (exampleCode: string) => {
        navigator.clipboard.writeText(exampleCode);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Contoh kode disalin',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleApplyExampleToEditor = (exampleCode: string) => {
        setCode(exampleCode);
        setActiveTab('editor');
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Kode dimuat ke Editor',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleExportCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code_phase2.c';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setData('files', [...data.files, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setData('files', data.files.filter((_, i) => i !== index));
    };

    const formatSubmittedDate = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }) + ', ' + date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace('.', ':');
    };

    const handleSubmitSubmission = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLeader) return;

        MySwal.fire({
            title: '<span class="text-xl font-bold text-slate-900">Konfirmasi Pengumpulan</span>',
            html: `
                <div class="space-y-4 text-center mt-2">
                    <p class="text-sm text-slate-600">
                        Apakah kamu yakin ingin mengumpulkan berkas ini?<br/>
                        Pengumpulan hanya dapat dilakukan satu kali.
                    </p>
                    <div class="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-left flex items-start gap-2.5">
                        <div class="text-amber-600 mt-0.5 shrink-0">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <p class="text-xs text-amber-900 leading-relaxed font-semibold">
                            Pastikan file yang diunggah sudah lengkap dan sesuai sebelum kamu mengirimnya.
                        </p>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '<span class="flex items-center gap-1.5"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Ya, Kirim!</span>',
            cancelButtonText: '<span class="flex items-center gap-1.5"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>Batal</span>',
            buttonsStyling: false,
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl p-6',
                confirmButton: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm',
                cancelButton: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm mr-3'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                post(savePhase3.url({ slug: material.slug }), {
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

    if (!isPhaseActive) {
        return (
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-4">
                        <Code2 className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Fase 2: Penyelidikan
                        </h2>
                        <p className="text-muted-foreground">
                            Fase ini akan dibuka setelah refleksi awal selesai
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
            {/* Tab Navigation Menu */}
            <motion.div
                className="flex flex-wrap md:flex-nowrap gap-1.5 rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-1 mb-6"
                variants={itemVariants}
            >
                <button
                    type="button"
                    onClick={() => setActiveTab('materi')}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'materi'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                >
                    <BookOpen className="h-4 w-4" />
                    <span>Materi</span>
                    {activeTab === 'materi' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30 pointer-events-none"
                            layoutId="activePhase2Tab"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('contoh')}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'contoh'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                >
                    <Code2 className="h-4 w-4" />
                    <span>Contoh Kasus</span>
                    {activeTab === 'contoh' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30 pointer-events-none"
                            layoutId="activePhase2Tab"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'editor'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                >
                    <Monitor className="h-4 w-4" />
                    <span>Coba Kode</span>
                    {activeTab === 'editor' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30 pointer-events-none"
                            layoutId="activePhase2Tab"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('tugas')}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'tugas'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    )}
                >
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Tugas</span>
                    {activeTab === 'tugas' && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30 pointer-events-none"
                            layoutId="activePhase2Tab"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
            </motion.div>

            {/* TAB CONTENT PANELS */}
            <AnimatePresence mode="wait">
                {activeTab === 'materi' && (
                    <motion.div
                        key="materi"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Video Pembelajaran Box */}
                        {material.video_url && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm mb-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="rounded-xl border border-(--palette-green)/10 bg-(--palette-green)/8 p-3 text-(--palette-green)">
                                        <Play className="h-6 w-6 shrink-0" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm md:text-base tracking-tight">
                                            Video Pembelajaran
                                        </h3>
                                        <p className="mt-1 text-xs md:text-sm leading-relaxed text-muted-foreground">
                                            Simak video berikut untuk memahami materi pada pertemuan ini.
                                        </p>
                                    </div>
                                </div>

                                {(() => {
                                    const ytMatch = material.video_url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                                    let embedUrl = null;
                                    if (ytMatch && ytMatch[2].length === 11) {
                                        embedUrl = `https://www.youtube.com/embed/${ytMatch[2]}`;
                                    } else {
                                        const gdMatch = material.video_url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                                                        material.video_url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
                                        if (gdMatch) {
                                            embedUrl = `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
                                        }
                                    }

                                    return embedUrl ? (
                                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto mb-4">
                                            <div className="relative w-full pt-[56.25%]">
                                                <iframe
                                                    className="absolute inset-0 h-full w-full"
                                                    src={embedUrl}
                                                    title="Video Pembelajaran"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-xl bg-slate-900 aspect-video flex flex-col items-center justify-center text-white p-6 relative max-w-2xl mx-auto mb-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-4 border border-white/20">
                                                <Play className="h-8 w-8 text-white fill-white" />
                                            </div>
                                            <p className="font-bold text-base text-slate-100">Video tidak dapat diputar.</p>
                                            <p className="text-slate-400 text-sm mt-1">Silakan gunakan tombol di bawah untuk membuka video.</p>
                                        </div>
                                    );
                                })()}

                                <div className="flex justify-start">
                                    <a
                                        href={material.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-(--palette-green) hover:bg-green-600 text-white font-bold py-2.5 px-5 shadow-sm transition-all text-xs hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Play className="h-3.5 w-3.5 fill-current" />
                                        Tonton Video
                                    </a>
                                </div>
                            </div>
                        )}

                        {material.sub_materials && material.sub_materials.length > 0 ? (
                            material.sub_materials.map((sub, index) => {
                                const isOpen = expandedSubIndices.includes(index);
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "rounded-2xl border bg-white p-5 md:p-6 shadow-sm transition-all duration-300",
                                            isOpen ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5" : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleSubIndex(index);
                                            }}
                                            className="flex w-full items-center justify-between text-left focus:outline-none group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black transition-colors border",
                                                    isOpen
                                                        ? "bg-(--palette-green)/10 text-(--palette-green) border-(--palette-green)/20"
                                                        : "bg-gray-50 text-slate-400 border-slate-200 group-hover:text-slate-600"
                                                )}>
                                                    {index + 1}
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-sm md:text-base tracking-tight group-hover:text-(--palette-green) transition-colors">
                                                    {sub.title}
                                                </h3>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-slate-400 group-hover:text-slate-600"
                                            >
                                                <ChevronDown size={18} />
                                            </motion.div>
                                        </button>

                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-5 border-t border-slate-100 pt-5 flex flex-col md:flex-row gap-6 items-start">
                                                    <div
                                                        className="flex-1 text-slate-700 text-sm leading-relaxed max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-slate-900"
                                                        dangerouslySetInnerHTML={{ __html: sub.content }}
                                                    />
                                                    {sub.image_path && (
                                                        <div className="w-full md:w-80 shrink-0 border border-slate-100 p-3 rounded-2xl bg-slate-50 flex items-center justify-center">
                                                            <img
                                                                src={`/storage/${sub.image_path}`}
                                                                alt={sub.title}
                                                                className="rounded-xl max-h-56 object-contain cursor-pointer transition-transform hover:scale-105"
                                                                onClick={() => {
                                                                    MySwal.fire({
                                                                        imageUrl: `/storage/${sub.image_path}`,
                                                                        imageAlt: sub.title,
                                                                        width: 'auto',
                                                                        showConfirmButton: false,
                                                                        showCloseButton: true,
                                                                        background: 'transparent',
                                                                        backdrop: `rgba(0,0,0,0.8)`,
                                                                        customClass: {
                                                                            image: 'max-h-[85vh] object-contain rounded-xl',
                                                                            popup: 'p-0 bg-transparent',
                                                                            closeButton: 'text-white hover:text-gray-300'
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                                <p className="text-sm font-bold text-muted-foreground">Tidak ada materi pembelajaran</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">Guru belum menambahkan materi untuk pembelajaran ini.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'contoh' && (
                    <motion.div
                        key="contoh"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {material.code_examples && material.code_examples.length > 0 ? (
                            material.code_examples.map((ex, index) => {
                                const isOpen = expandedExampleIndices.includes(index);
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "rounded-2xl border bg-white p-5 md:p-6 shadow-sm transition-all duration-300",
                                            isOpen ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5" : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleExampleIndex(index);
                                            }}
                                            className="flex w-full items-center justify-between text-left focus:outline-none group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black transition-colors border",
                                                    isOpen
                                                        ? "bg-(--palette-green)/10 text-(--palette-green) border-(--palette-green)/20"
                                                        : "bg-gray-50 text-slate-400 border-slate-200 group-hover:text-slate-600"
                                                )}>
                                                    C{index + 1}
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-sm md:text-base tracking-tight group-hover:text-(--palette-green) transition-colors">
                                                    {ex.title}
                                                </h3>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-slate-400 group-hover:text-slate-600"
                                            >
                                                <ChevronDown size={18} />
                                            </motion.div>
                                        </button>

                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-5 border-t border-slate-100 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {/* Code Block Container */}
                                                    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                                                        <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">program.c</span>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleCopyExampleCode(ex.code)}
                                                                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                                                    title="Salin kode"
                                                                >
                                                                    <Copy size={13} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleApplyExampleToEditor(ex.code)}
                                                                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-(--palette-green)/20 text-(--palette-green) hover:bg-(--palette-green)/30 transition-colors border border-(--palette-green)/30"
                                                                    title="Gunakan di Compiler"
                                                                >
                                                                    <Play size={9} />
                                                                    Coba
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <Editor
                                                            height="300px"
                                                            language="c"
                                                            theme="vs-dark"
                                                            value={ex.code}
                                                            options={{
                                                                readOnly: true,
                                                                minimap: { enabled: false },
                                                                fontSize: 12,
                                                                lineNumbers: 'on',
                                                                scrollBeyondLastLine: false,
                                                                wordWrap: 'on',
                                                                padding: { top: 16, bottom: 16 },
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Right Panel: Output & Explanation */}
                                                    <div className="space-y-4 flex flex-col">
                                                        <div className="rounded-xl border border-slate-150 p-4 bg-slate-50 shadow-sm flex-1">
                                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Penjelasan Kode</h4>
                                                            <div
                                                                className="text-sm text-slate-700 leading-relaxed max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-slate-900"
                                                                dangerouslySetInnerHTML={{ __html: ex.explanation }}
                                                            />
                                                        </div>

                                                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex-1">
                                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Output Program</h4>
                                                            <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap">
                                                                {ex.output}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                                <Code2 className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                                <p className="text-sm font-bold text-muted-foreground">Tidak ada contoh kode program</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">Guru belum mengkonfigurasi contoh program.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'editor' && (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Banner */}
                        <div className="rounded-2xl border border-green-200 bg-green-50/30 p-5 flex items-center justify-between gap-6 shadow-sm">
                            <div className="flex-1 space-y-1">
                                <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                                    <Code2 className="h-5 w-5 text-green-600" />
                                    Coba Kode
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Ubah kode di editor, lalu jalankan untuk melihat hasilnya. Eksplorasi dan pahami bagaimana program bekerja!
                                </p>
                            </div>
                            <div className="hidden sm:flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                                <Keyboard className="h-8 w-8" />
                            </div>
                        </div>

                        {/* Editor Window */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3">
                                <div className="flex items-center gap-2">
                                    <Code2 className="h-4 w-4 text-(--palette-green)" />
                                    <div>
                                        <span className="font-bold text-foreground text-sm tracking-tight block">
                                            Editor Kode
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            Tulis atau ubah kode program di sini
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopyCode}
                                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 shadow-sm"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        Salin Kode
                                    </button>
                                    <button
                                        onClick={handleExportCode}
                                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 shadow-sm"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Unduh Kode
                                    </button>
                                </div>
                            </div>

                            <div className="h-125 w-full border-t border-slate-100">
                                <Editor
                                    height="100%"
                                    language="c"
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16, bottom: 16 },
                                        wordWrap: "on",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50 h-12 shadow-lg shadow-blue-200/50 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                {isRunning ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Menjalankan...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 fill-current" />
                                        Jalankan Kode
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Alert box */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-center gap-3 text-sm text-blue-700 font-semibold shadow-sm">
                            <Lightbulb className="h-5 w-5 text-blue-500 shrink-0" />
                            <p>Cobalah ubah kode di atas, lalu jalankan kembali untuk melihat perubahan output!</p>
                        </div>

                        {/* Stdin Panel */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col border-b border-slate-100 bg-slate-50 px-6 py-3">
                                <span className="font-bold text-foreground text-sm flex items-center gap-2">
                                    <Keyboard className="h-4 w-4 text-(--palette-green)" />
                                    Masukkan Input
                                </span>
                                <span className="text-[10px] text-muted-foreground ml-6">
                                    Tulis input di sini jika programmu membutuhkan data tambahan.
                                </span>
                            </div>
                            <div className="p-4">
                                <textarea
                                    value={stdin}
                                    onChange={(e) => setStdin(e.target.value)}
                                    placeholder="Contoh: masukkan angka, teks, atau data lainnya..."
                                    className="w-full min-h-24 rounded-xl border border-slate-200 p-4 text-sm font-mono focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/10 bg-slate-50/20"
                                />
                            </div>
                        </div>

                        {/* Console stdout Panel */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col border-b border-slate-100 bg-slate-50 px-6 py-3">
                                <span className="font-bold text-foreground text-sm flex items-center gap-2">
                                    <Play className="h-4 w-4 text-(--palette-green)" />
                                    Hasil Program
                                </span>
                                <span className="text-[10px] text-muted-foreground ml-6">
                                    Output programmu akan tampil di sini setelah dijalankan.
                                </span>
                            </div>
                            <pre className="overflow-auto bg-slate-950 p-6 font-mono text-sm text-emerald-400 min-h-32 max-h-80 leading-relaxed shadow-inner">
                                {codeOutput || 'Hasil program akan muncul di sini.'}
                            </pre>
                        </div>

                        {/* Tips Card */}
                        <div className="rounded-2xl border border-green-200 bg-green-50/30 p-5 flex items-start gap-3 shadow-sm">
                            <Star className="h-5 w-5 text-green-600 shrink-0 mt-0.5 fill-current" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-green-800">Tips Belajar</h4>
                                <p className="text-xs font-semibold text-green-700 leading-relaxed">
                                    Cobalah berbagai perubahan pada kode dan input untuk memahami cara kerja program!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'tugas' && (
                    <motion.div
                        key="tugas"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Section 1: Unduh Lembar Kerja */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-amber-50 p-3.5 text-amber-500 border border-amber-100 shrink-0">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Unduh Lembar Kerja</h3>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        Unduh lembar kerja berikut, diskusikan bersama kelompokmu, lalu kerjakan tugas sesuai instruksi.
                                    </p>
                                    {material.material_pdf ? (
                                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-red-50 p-2.5 text-red-500 shrink-0">
                                                    <FileText className="h-8 w-8 text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Lembar Kerja - {material.title}</p>
                                                    <p className="text-xs font-semibold text-slate-400 mt-1">File Tugas (PDF) • 3.2 MB</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="border-amber-200 bg-white font-bold text-amber-700 hover:bg-amber-50 hover:text-amber-800 shrink-0 self-start sm:self-center"
                                                asChild
                                            >
                                                <a href={`/storage/${material.material_pdf}`} target="_blank" rel="noopener noreferrer">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Unduh LKPD
                                                </a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-gray-150 text-center bg-gray-50/50">
                                            <p className="text-xs text-muted-foreground italic">Lembar kerja belum diunggah oleh Guru.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Upload Jawaban Kelompok */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-blue-50 p-3.5 text-blue-600 border border-blue-100 shrink-0">
                                    <FileUp className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Upload Jawaban Kelompok</h3>
                                        {isSubmitted && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Tugas Berhasil Dikumpulkan</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        {isSubmitted
                                            ? "Jawaban tugas dikirim oleh ketua kelompok dan hanya dapat dikirim satu kali."
                                            : "Unggah jawaban tugas yang sudah dikerjakan bersama kelompok."}
                                    </p>

                                    {isSubmitted ? (
                                        <div className="mt-6 space-y-4">
                                            <div className="rounded-xl border border-green-200 bg-green-50/10 p-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-green-800 mb-3">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>File yang telah dikirim:</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {submittedFiles.map((file, idx) => {
                                                        const fileName = file.split('/').pop() || '';
                                                        const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                                                        return (
                                                            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                                <FileText className="h-8 w-8 text-blue-500 shrink-0" />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-slate-800 leading-none truncate max-w-md">{fileName}</p>
                                                                    <p className="text-[11px] text-muted-foreground mt-1.5">
                                                                        {ext} • 1.24 MB • {formatSubmittedDate(submission?.submitted_at)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50/10 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-full bg-green-100 p-2 text-green-700 shrink-0">
                                                        <PartyPopper className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-green-800">Jawaban Sudah Dikirim!</p>
                                                        <p className="text-xs text-green-700 mt-0.5">Terima kasih, tugas kelompokmu telah berhasil dikumpulkan.</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    disabled
                                                    className="bg-green-600 font-bold text-white opacity-100 disabled:opacity-100 px-4 py-2 h-10 rounded-lg flex items-center gap-2 hover:bg-green-600 shrink-0 self-start sm:self-center"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Jawaban Sudah Dikirim
                                                </Button>
                                            </div>
                                        </div>
                                    ) : !isLeader ? (
                                        <div className="mt-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/30 p-6 text-center">
                                            <Lock className="mx-auto mb-2.5 h-6 w-6 text-amber-600/85" />
                                            <p className="text-sm font-bold text-amber-900">Hanya ketua kelompok yang dapat mengunggah jawaban.</p>
                                            <p className="text-xs text-amber-700/80 mt-1">
                                                Silakan hubungi ketua kelompok untuk mengirim jawaban tugas.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmitSubmission} className="mt-6 space-y-4">
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
                                                className={cn(
                                                    "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
                                                    isDragging
                                                        ? "border-blue-400 bg-blue-50/50 scale-[1.01]"
                                                        : "border-slate-200 bg-slate-50/20 hover:border-blue-300 hover:bg-slate-50/50"
                                                )}
                                            >
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    aria-label="Unggah berkas jawaban kelompok"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.txt,.c"
                                                    className="hidden"
                                                />
                                                <div className="text-center">
                                                    <FileUp className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                                                    <p className="text-sm font-bold text-slate-700">
                                                        Seret berkas di sini atau <span className="text-blue-600">pilih dari komputer</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Mendukung format PDF, Word, Txt, atau kode sumber C.
                                                    </p>
                                                </div>
                                            </div>

                                            {data.files.length > 0 && (
                                                <div className="space-y-2">
                                                    {data.files.map((file, idx) => (
                                                        <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-150 p-3 text-xs font-semibold text-slate-700">
                                                            <div className="flex items-center gap-2 truncate">
                                                                <FileText className="h-4 w-4 text-blue-500" />
                                                                <span className="truncate">{file.name}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                title="Hapus berkas"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeFile(idx);
                                                                }}
                                                                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {Object.keys(errors).length > 0 && (
                                                <div className="space-y-1">
                                                    {Object.entries(errors).map(([key, error]) => (
                                                        <p key={key} className="text-xs font-bold text-red-500">
                                                            • {error}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                disabled={processing || data.files.length === 0}
                                                className="w-full bg-blue-600 font-bold text-white hover:bg-blue-700 h-12 rounded-xl shadow-lg shadow-blue-200/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                            >
                                                {processing ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <FileUp className="mr-2 h-4 w-4" />
                                                )}
                                                Kirim Jawaban
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
