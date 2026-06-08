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
    Award,
    Image as ImageIcon,
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
            video_url?: string;
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
        grade?: {
            id: number;
            score: number;
            teacher_notes: string | null;
            created_at?: string;
            updated_at?: string;
        } | null;
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
    const [expandedVideoIndices, setExpandedVideoIndices] = useState<number[]>([]);
    const [expandedImageIndices, setExpandedImageIndices] = useState<number[]>([]);

    const storageKey = `read-sub-materials-${material.id}`;
    const [readSubIndices, setReadSubIndices] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const examplesStorageKey = `read-code-examples-${material.id}`;
    const [readExampleIndices, setReadExampleIndices] = useState<number[]>(() => {
        try {
            const saved = localStorage.getItem(examplesStorageKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const compilerStorageKey = `has-run-compiler-${material.id}`;
    const [hasRunCompiler, setHasRunCompiler] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem(compilerStorageKey);
            return saved === 'true';
        } catch {
            return false;
        }
    });

    const isMateriFinished = material.sub_materials && material.sub_materials.length > 0
        ? readSubIndices.length === material.sub_materials.length
        : true;

    const isContohFinished = material.code_examples && material.code_examples.length > 0
        ? readExampleIndices.length === material.code_examples.length
        : true;

    const handleMarkAsRead = (index: number) => {
        if (!readSubIndices.includes(index)) {
            const nextRead = [...readSubIndices, index];
            setReadSubIndices(nextRead);
            try {
                localStorage.setItem(storageKey, JSON.stringify(nextRead));
            } catch (err) {
                console.error(err);
            }
        }

        const totalSubs = material.sub_materials?.length || 0;
        if (index === totalSubs - 1) {
            setActiveTab('contoh');
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Materi selesai dibaca! Membuka Contoh Kasus...',
                showConfirmButton: false,
                timer: 2500
            });
        } else {
            // Collapse current sub-material and expand the next one
            setExpandedSubIndices(prev => {
                const collapsed = prev.filter(i => i !== index);
                if (index < totalSubs - 1) {
                    return [...collapsed, index + 1];
                }
                return collapsed;
            });
        }
    };

    const handleMarkAsExampleRead = (index: number) => {
        if (!readExampleIndices.includes(index)) {
            const nextRead = [...readExampleIndices, index];
            setReadExampleIndices(nextRead);
            try {
                localStorage.setItem(examplesStorageKey, JSON.stringify(nextRead));
            } catch (err) {
                console.error(err);
            }
        }

        const totalExamples = material.code_examples?.length || 0;
        if (index === totalExamples - 1) {
            setActiveTab('editor');
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Contoh kasus selesai dipelajari! Membuka Compiler Online...',
                showConfirmButton: false,
                timer: 2500
            });
        } else {
            // Collapse current example and expand the next one
            setExpandedExampleIndices(prev => {
                const collapsed = prev.filter(i => i !== index);
                if (index < totalExamples - 1) {
                    return [...collapsed, index + 1];
                }
                return collapsed;
            });
        }
    };

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

    const toggleVideoIndex = (index: number) => {
        setExpandedVideoIndices(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleImageIndex = (index: number) => {
        setExpandedImageIndices(prev =>
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

            if (!hasRunCompiler) {
                setHasRunCompiler(true);
                try {
                    localStorage.setItem(compilerStorageKey, 'true');
                } catch (err) {
                    console.error(err);
                }
            }
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
                    onClick={() => {
                        if (isMateriFinished) {
                            setActiveTab('contoh');
                        } else {
                            MySwal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'warning',
                                title: 'Selesaikan semua sub-materi terlebih dahulu!',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
                    }}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'contoh'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : isMateriFinished
                                ? "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                : "text-slate-400 bg-slate-100/50 cursor-not-allowed"
                    )}
                >
                    {isMateriFinished ? <Code2 className="h-4 w-4" /> : <Lock className="h-4 w-4 text-slate-450" />}
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
                    onClick={() => {
                        if (isMateriFinished && isContohFinished) {
                            setActiveTab('editor');
                        } else {
                            MySwal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'warning',
                                title: 'Pelajari semua contoh kasus terlebih dahulu!',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
                    }}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'editor'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : (isMateriFinished && isContohFinished)
                                ? "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                : "text-slate-400 bg-slate-100/50 cursor-not-allowed"
                    )}
                >
                    {(isMateriFinished && isContohFinished) ? <Monitor className="h-4 w-4" /> : <Lock className="h-4 w-4 text-slate-450" />}
                    <span>Compiler Online</span>
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
                    onClick={() => {
                        if (isMateriFinished && isContohFinished && hasRunCompiler) {
                            setActiveTab('tugas');
                        } else {
                            MySwal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'warning',
                                title: 'Jalankan program di Compiler Online minimal 1 kali!',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
                    }}
                    className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        activeTab === 'tugas'
                            ? "bg-white text-(--palette-green) shadow-sm"
                            : (isMateriFinished && isContohFinished && hasRunCompiler)
                                ? "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                : "text-slate-400 bg-slate-100/50 cursor-not-allowed"
                    )}
                >
                    {(isMateriFinished && isContohFinished && hasRunCompiler) ? <ClipboardCheck className="h-4 w-4" /> : <Lock className="h-4 w-4 text-slate-450" />}
                    <span>Upload Kode</span>
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


                        {material.sub_materials && material.sub_materials.length > 0 ? (
                            material.sub_materials.map((sub, index) => {
                                const isOpen = expandedSubIndices.includes(index);
                                const isUnlocked = index === 0 || readSubIndices.includes(index - 1);
                                const isRead = readSubIndices.includes(index);

                                if (!isUnlocked) {
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-2xl border bg-slate-50/50 p-5 md:p-6 shadow-sm opacity-60 border-slate-200"
                                        >
                                            <div className="flex w-full items-center justify-between text-left cursor-not-allowed group">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black bg-gray-200 text-slate-400 border border-slate-300 shrink-0">
                                                        <Lock size={12} className="text-slate-400" />
                                                    </div>
                                                    <h3 className="font-bold text-slate-400 text-sm md:text-base tracking-tight select-none">
                                                        {sub.title}
                                                    </h3>
                                                </div>
                                                <div className="text-slate-400">
                                                    <Lock size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "rounded-2xl border bg-white p-5 md:p-6 shadow-sm transition-all duration-300",
                                            isOpen
                                                ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5"
                                                : isRead
                                                    ? "border-emerald-200 bg-emerald-50/5 hover:border-emerald-300"
                                                    : "border-slate-200 hover:border-slate-300"
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
                                                    "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black transition-colors border shrink-0",
                                                    isRead
                                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                        : isOpen
                                                            ? "bg-(--palette-green)/10 text-(--palette-green) border-(--palette-green)/20"
                                                            : "bg-gray-50 text-slate-400 border-slate-200 group-hover:text-slate-600"
                                                )}>
                                                    {isRead ? <Check size={12} className="stroke-[3]" /> : index + 1}
                                                </div>
                                                <h3 className={cn(
                                                    "font-bold text-sm md:text-base tracking-tight transition-colors",
                                                    isRead
                                                        ? "text-emerald-800 group-hover:text-emerald-600"
                                                        : "text-slate-800 group-hover:text-(--palette-green)"
                                                )}>
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
                                                <div className="mt-5 border-t border-slate-100 pt-5 space-y-6">

                                                    {/* Konten Teks Sub-Materi */}
                                                    <div
                                                        className="text-slate-700 text-sm leading-relaxed max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:text-slate-900"
                                                        dangerouslySetInnerHTML={{ __html: sub.content }}
                                                    />

                                                    {/* Media Pendukung (Accordion Video & Gambar Terpisah) */}
                                                    {(sub.video_url || sub.image_path) && (
                                                        <div className="space-y-4 mt-5">
                                                            {/* Accordion Video Pembelajaran */}
                                                            {sub.video_url && (
                                                                <div className="rounded-xl border border-blue-100 bg-blue-50/20 overflow-hidden shadow-xs transition-all duration-300">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleVideoIndex(index)}
                                                                        className="flex w-full items-center justify-between p-4 text-left focus:outline-none group/video cursor-pointer"
                                                                    >
                                                                        <div className="flex items-center gap-2.5">
                                                                            <Play className="h-4 w-4 text-blue-600 fill-blue-600/10 shrink-0 group-hover/video:scale-110 transition-transform" />
                                                                            <span className="text-xs font-black uppercase tracking-wider text-slate-700 group-hover/video:text-blue-600 transition-colors">Video Pembelajaran</span>
                                                                        </div>
                                                                        <motion.div
                                                                            animate={{ rotate: expandedVideoIndices.includes(index) ? 180 : 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            className="text-slate-400 group-hover/video:text-slate-600"
                                                                        >
                                                                            <ChevronDown size={16} />
                                                                        </motion.div>
                                                                    </button>

                                                                    <AnimatePresence initial={false}>
                                                                        {expandedVideoIndices.includes(index) && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: "auto", opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <div className="p-4 pt-0 border-t border-blue-100/40 space-y-4">
                                                                                    {(() => {
                                                                                        const ytMatch = sub.video_url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
                                                                                        let embedUrl = null;
                                                                                        if (ytMatch && ytMatch[2].length === 11) {
                                                                                            embedUrl = `https://www.youtube.com/embed/${ytMatch[2]}`;
                                                                                        } else {
                                                                                            const gdMatch = sub.video_url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                                                                                                sub.video_url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
                                                                                            if (gdMatch) {
                                                                                                embedUrl = `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
                                                                                            }
                                                                                        }

                                                                                        return (
                                                                                            <div className="space-y-3 max-w-full mt-3">
                                                                                                {embedUrl ? (
                                                                                                    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-xs">
                                                                                                        <div className="relative w-full pt-[56.25%]">
                                                                                                            <iframe
                                                                                                                className="absolute inset-0 h-full w-full"
                                                                                                                src={embedUrl}
                                                                                                                title={sub.title}
                                                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                                allowFullScreen
                                                                                                            ></iframe>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className="overflow-hidden rounded-lg bg-slate-900 aspect-video flex flex-col items-center justify-center text-white p-6">
                                                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-3 border border-white/20">
                                                                                                            <Play className="h-6 w-6 text-white fill-white" />
                                                                                                        </div>
                                                                                                        <p className="font-bold text-sm text-slate-100">Video tidak dapat diputar langsung.</p>
                                                                                                        <p className="text-slate-400 text-xs mt-1">Silakan gunakan tombol di bawah untuk menonton.</p>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            )}

                                                            {/* Accordion Gambar Ilustrasi */}
                                                            {sub.image_path && (
                                                                <div className="rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 overflow-hidden shadow-xs transition-all duration-300">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => toggleImageIndex(index)}
                                                                        className="flex w-full items-center justify-between p-4 text-left focus:outline-none group/image cursor-pointer"
                                                                    >
                                                                        <div className="flex items-center gap-2.5">
                                                                            <ImageIcon className="h-4 w-4 text-(--palette-green) shrink-0 group-hover/image:scale-110 transition-transform" />
                                                                            <span className="text-xs font-black uppercase tracking-wider text-slate-700 group-hover/image:text-(--palette-green) transition-colors">Gambar Ilustrasi</span>
                                                                        </div>
                                                                        <motion.div
                                                                            animate={{ rotate: expandedImageIndices.includes(index) ? 180 : 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            className="text-slate-400 group-hover/image:text-slate-600"
                                                                        >
                                                                            <ChevronDown size={16} />
                                                                        </motion.div>
                                                                    </button>

                                                                    <AnimatePresence initial={false}>
                                                                        {expandedImageIndices.includes(index) && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: "auto", opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <div className="p-4 pt-0 border-t border-(--palette-green)/10 space-y-4">
                                                                                    <div className="flex flex-col justify-start max-w-full mt-3">
                                                                                        <div className="w-full border border-slate-150 p-2.5 rounded-lg bg-white flex items-center justify-center shadow-xs aspect-video overflow-hidden">
                                                                                            <img
                                                                                                src={`/storage/${sub.image_path}`}
                                                                                                alt={sub.title}
                                                                                                className="rounded-md object-contain h-full w-full cursor-pointer transition-transform hover:scale-[1.01]"
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
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Button Tandai Sudah Dibaca */}
                                                    <div className="flex items-center justify-end border-t border-slate-100 pt-4 mt-6">
                                                        {isRead ? (
                                                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                                                                <Check size={14} className="stroke-[3]" />
                                                                <span>Sudah Dibaca</span>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleMarkAsRead(index)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 h-auto rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                            >
                                                                {index < (material.sub_materials?.length || 0) - 1 ? (
                                                                    <>
                                                                        <span>Selesai & Lanjut</span>
                                                                        <Check size={14} className="stroke-[3]" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Selesai Membaca</span>
                                                                        <Check size={14} className="stroke-[3]" />
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
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
                                const isUnlocked = index === 0 || readExampleIndices.includes(index - 1);
                                const isRead = readExampleIndices.includes(index);

                                if (!isUnlocked) {
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-2xl border bg-slate-50/50 p-5 md:p-6 shadow-sm opacity-60 border-slate-200"
                                        >
                                            <div className="flex w-full items-center justify-between text-left cursor-not-allowed group">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black bg-gray-200 text-slate-400 border border-slate-300 shrink-0">
                                                        <Lock size={12} className="text-slate-400" />
                                                    </div>
                                                    <h3 className="font-bold text-slate-400 text-sm md:text-base tracking-tight select-none">
                                                        {ex.title}
                                                    </h3>
                                                </div>
                                                <div className="text-slate-400">
                                                    <Lock size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "rounded-2xl border bg-white p-5 md:p-6 shadow-sm transition-all duration-300",
                                            isOpen
                                                ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5"
                                                : isRead
                                                    ? "border-emerald-200 bg-emerald-50/5 hover:border-emerald-300"
                                                    : "border-slate-200 hover:border-slate-300"
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
                                                    "flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black transition-colors border shrink-0",
                                                    isRead
                                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                        : isOpen
                                                            ? "bg-(--palette-green)/10 text-(--palette-green) border-(--palette-green)/20"
                                                            : "bg-gray-50 text-slate-400 border-slate-200 group-hover:text-slate-600"
                                                )}>
                                                    {isRead ? <Check size={12} className="stroke-[3]" /> : `C${index + 1}`}
                                                </div>
                                                <h3 className={cn(
                                                    "font-bold text-sm md:text-base tracking-tight transition-colors",
                                                    isRead
                                                        ? "text-emerald-800 group-hover:text-emerald-600"
                                                        : "text-slate-800 group-hover:text-(--palette-green)"
                                                )}>
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

                                                    {/* Button Tandai Sudah Dipelajari */}
                                                    <div className="col-span-1 lg:col-span-2 flex items-center justify-end border-t border-slate-100 pt-4 mt-4">
                                                        {isRead ? (
                                                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                                                                <Check size={14} className="stroke-[3]" />
                                                                <span>Sudah Dipelajari</span>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleMarkAsExampleRead(index)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 h-auto rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                            >
                                                                {index < (material.code_examples?.length || 0) - 1 ? (
                                                                    <>
                                                                        <span>Selesai & Lanjut</span>
                                                                        <Check size={14} className="stroke-[3]" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Mulai Latihan Coding</span>
                                                                        <Play size={14} className="stroke-[3]" />
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
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
                                    Compiler Online
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
                                        Jalankan Compiler Online
                                    </>
                                )}
                            </Button>

                            {hasRunCompiler && (
                                <Button
                                    type="button"
                                    onClick={() => setActiveTab('tugas')}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white transition-all hover:bg-emerald-700 h-12 shadow-lg shadow-emerald-200/50 hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <span>Lanjut ke Tugas</span>
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
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
                        {/* Section 1: Unduh Lembar Kerja (Commented Out)
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
                        */}

                        {/* Section 2: Upload Kode Kelompok */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-blue-50 p-3.5 text-blue-600 border border-blue-100 shrink-0">
                                    <FileUp className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Upload Kode Kelompok</h3>
                                        {isSubmitted && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Kode Berhasil Dikumpulkan</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        {isSubmitted
                                            ? "Kode dikirim oleh ketua kelompok dan hanya dapat dikirim satu kali."
                                            : "Unggah kode yang sudah dikerjakan bersama kelompok."}
                                    </p>

                                    {isSubmitted ? (
                                        <div className="mt-6 space-y-4">
                                            {/* Panel Nilai & Feedback dari Guru (Jika Sudah Dinilai) */}
                                            {submission?.grade && (
                                                <motion.div
                                                    className="rounded-2xl border border-[--palette-green]/30 bg-gradient-to-br from-[--palette-green]/10 to-[--palette-limelight]/5 p-5 md:p-6 shadow-sm"
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[--palette-green]/10 pb-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className="rounded-xl bg-[--palette-green]/15 p-3 text-[--palette-green] border border-[--palette-green]/20 shrink-0">
                                                                <Award className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-black text-slate-800 tracking-tight">Evaluasi Guru</h4>
                                                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                                                    Kode kelompokmu telah dinilai dan dievaluasi.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Badge Nilai Akhir */}
                                                        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-[--palette-green]/20 self-stretch md:self-auto justify-center">
                                                            <div className="text-center">
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Nilai Akhir</span>
                                                                <div className="flex items-baseline justify-center gap-0.5">
                                                                    <span className="text-3xl font-black text-[--palette-green]">{submission.grade.score}</span>
                                                                    <span className="text-xs font-bold text-slate-450">/100</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {submission.grade.teacher_notes && (
                                                        <div className="mt-5 rounded-xl border border-slate-200/60 bg-white/70 p-4 md:p-5 shadow-inner">
                                                            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs md:text-sm mb-2.5">
                                                                <Star className="h-4 w-4 text-[--palette-green] fill-current" />
                                                                <span>Catatan & Feedback Guru:</span>
                                                            </div>
                                                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic whitespace-pre-wrap pl-6 border-l-2 border-[--palette-green]/40">
                                                                "{submission.grade.teacher_notes}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

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
                                                                {['PNG', 'JPG', 'JPEG'].includes(ext) ? (
                                                                    <ImageIcon className="h-8 w-8 text-emerald-500 shrink-0" />
                                                                ) : (
                                                                    <FileText className="h-8 w-8 text-blue-500 shrink-0" />
                                                                )}
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
                                                        <p className="text-sm font-bold text-green-800">Kode Sudah Dikirim!</p>
                                                        <p className="text-xs text-green-700 mt-0.5">Terima kasih, kode kelompokmu telah berhasil dikumpulkan.</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    disabled
                                                    className="bg-green-600 font-bold text-white opacity-100 disabled:opacity-100 px-4 py-2 h-10 rounded-lg flex items-center gap-2 hover:bg-green-600 shrink-0 self-start sm:self-center"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Kode Sudah Dikirim
                                                </Button>
                                            </div>
                                        </div>
                                    ) : groupMembers.length === 0 ? (
                                        <div className="mt-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/30 p-6 text-center">
                                            <Lock className="mx-auto mb-2.5 h-6 w-6 text-amber-600/85" />
                                            <p className="text-sm font-bold text-amber-900">Kamu belum terdaftar dalam kelompok.</p>
                                            <p className="text-xs text-amber-700/80 mt-1">
                                                Silakan hubungi Gurumu untuk membagi kelompok terlebih dahulu sebelum mengumpulkan kode.
                                            </p>
                                        </div>
                                    ) : !isLeader ? (
                                        <div className="mt-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/30 p-6 text-center">
                                            <Lock className="mx-auto mb-2.5 h-6 w-6 text-amber-600/85" />
                                            <p className="text-sm font-bold text-amber-900">Hanya ketua kelompok yang dapat mengunggah kode.</p>
                                            <p className="text-xs text-amber-700/80 mt-1">
                                                Silakan hubungi ketua kelompok untuk mengirim kode.
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
                                                    aria-label="Unggah berkas kode kelompok"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.txt,.c,.png,.jpg,.jpeg"
                                                    className="hidden"
                                                />
                                                <div className="text-center">
                                                    <FileUp className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                                                    <p className="text-sm font-bold text-slate-700">
                                                        Seret berkas di sini atau <span className="text-blue-600">pilih dari komputer</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Mendukung format PDF, Word, Txt, kode sumber C, atau Gambar (PNG, JPG, JPEG).
                                                    </p>
                                                </div>
                                            </div>

                                            {data.files.length > 0 && (
                                                <div className="space-y-2">
                                                    {data.files.map((file, idx) => (
                                                        <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-150 p-3 text-xs font-semibold text-slate-700">
                                                            <div className="flex items-center gap-2 truncate">
                                                                {(() => {
                                                                    const ext = file.name.split('.').pop()?.toLowerCase();
                                                                    if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
                                                                        return <ImageIcon className="h-4 w-4 text-emerald-500 shrink-0" />;
                                                                    }
                                                                    return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
                                                                })()}
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
                                                Kirim Kode
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
