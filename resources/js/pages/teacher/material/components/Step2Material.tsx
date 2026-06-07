import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    BookOpen,
    Check,
    FileText,
    Link,
    Lightbulb,
    MessageSquare,
    Play,
    Upload,
    X,
    Plus,
    Trash2,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Eye,
    Code2,
    Image as ImageIcon,
    ChevronDown,
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import { useState, useMemo, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { cn } from '@/lib/utils';

interface Step2MaterialProps {
    formData: MaterialFormData;
    errors: Record<string, string[]>;
    setFieldValue: (field: keyof MaterialFormData, value: any) => void;
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

interface AccordionSectionProps {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    isOpen: boolean;
    onToggle: () => void;
    hasError?: boolean;
    children: React.ReactNode;
}

const AccordionSection = ({
    title,
    description,
    icon: Icon,
    isOpen,
    onToggle,
    hasError,
    children,
}: AccordionSectionProps) => {
    return (
        <motion.div
            className={cn(
                "rounded-2xl border bg-white p-6 md:p-8 shadow-sm transition-all duration-300",
                isOpen
                    ? "border-(--palette-green)/30 ring-2 ring-(--palette-green)/5"
                    : hasError
                        ? "border-red-200 hover:border-red-300 bg-red-50/5"
                        : "border-(--palette-limelight)/20 hover:border-(--palette-green)/20"
            )}
            variants={itemVariants}
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-start justify-between gap-4 text-left focus:outline-none group"
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                        "rounded-xl border p-3.5 shadow-sm transition-colors",
                        isOpen
                            ? "border-(--palette-green)/10 bg-(--palette-green)/8 text-(--palette-green)"
                            : hasError
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-(--palette-limelight)/20 bg-gray-50 text-muted-foreground group-hover:text-foreground"
                    )}>
                        <Icon className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className={cn(
                                "text-lg md:text-xl font-bold tracking-tight",
                                hasError ? "text-red-600" : "text-foreground"
                            )}>
                                {title}
                            </h3>
                            {hasError && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100 uppercase tracking-wider animate-pulse">
                                    Error
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs md:text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 pt-2 text-muted-foreground/60 group-hover:text-foreground">
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-5 w-5" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-visible"
                    >
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const RichTextEditor = ({
    value,
    onChange,
    id,
    placeholder,
}: {
    value: string;
    onChange: (val: string) => void;
    id: string;
    placeholder?: string;
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'w-full min-h-[140px] p-4 text-sm focus:outline-none bg-white [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1 [&_p]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded-xl border border-(--palette-limelight)/25 overflow-hidden bg-white shadow-sm focus-within:border-(--palette-green) focus-within:ring-2 focus-within:ring-(--palette-green)/10 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-start border-b border-(--palette-limelight)/10 bg-gray-50 px-3 py-2 gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("p-1.5 rounded transition-colors", editor.isActive('bold') ? "bg-gray-200 text-slate-900" : "hover:bg-gray-200 text-slate-700")}
                    title="Tebalkan (Bold)"
                >
                    <Bold size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("p-1.5 rounded transition-colors", editor.isActive('italic') ? "bg-gray-200 text-slate-900" : "hover:bg-gray-200 text-slate-700")}
                    title="Miring (Italic)"
                >
                    <Italic size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn("p-1.5 rounded transition-colors", editor.isActive('underline') ? "bg-gray-200 text-slate-900" : "hover:bg-gray-200 text-slate-700")}
                    title="Garis Bawah (Underline)"
                >
                    <Underline size={15} />
                </button>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn("p-1 rounded font-bold transition-colors text-xs px-2", editor.isActive('heading', { level: 3 }) ? "bg-gray-200 text-slate-900" : "hover:bg-gray-200 text-slate-700")}
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("p-1.5 rounded transition-colors", editor.isActive('bulletList') ? "bg-gray-200 text-slate-900" : "hover:bg-gray-200 text-slate-700")}
                    title="Daftar Poin (Bullet List)"
                >
                    <List size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("p-1.5 rounded transition-colors", editor.isActive('orderedList') ? "bg-gray-200 text-slate-900" : "hover:bg-gray-200 text-slate-700")}
                    title="Daftar Angka (Numbered List)"
                >
                    <ListOrdered size={15} />
                </button>
            </div>

            {/* Editor */}
            <div onClick={() => editor.chain().focus().run()} className="cursor-text">
                <EditorContent editor={editor} id={id} />
            </div>
        </div>
    );
};

export default function Step2Material({
    formData,
    errors,
    setFieldValue,
}: Step2MaterialProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        materi: true,
        contoh: false,
        media: false,
    });
    const [dragActive, setDragActive] = useState(false);
    const [openSubMaterials, setOpenSubMaterials] = useState<Record<number, boolean>>({ 0: true });
    const [openCodeExamples, setOpenCodeExamples] = useState<Record<number, boolean>>({ 0: true });

    const toggleSection = (id: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getError = (field: string) => errors[field]?.[0];

    const hasMateriErrors = useMemo(() => !!errors.sub_materials, [errors]);
    const hasContohErrors = useMemo(() => !!errors.code_examples, [errors]);
    const hasMediaErrors = false; // useMemo(() => !!errors.material_pdf, [errors]);

    useEffect(() => {
        if (hasMateriErrors || hasContohErrors || hasMediaErrors) {
            setOpenSections((prev) => {
                const next = { ...prev };
                if (hasMateriErrors) next.materi = true;
                if (hasContohErrors) next.contoh = true;
                if (hasMediaErrors) next.media = true;
                return next;
            });
        }
    }, [errors, hasMateriErrors, hasContohErrors, hasMediaErrors]);

    // Sub-materials Handlers
    const subMaterials = formData.sub_materials || [];

    const handleAddSub = () => {
        setFieldValue('sub_materials', [...subMaterials, { title: '', content: '', image: null, video_url: '' }]);
        setOpenSubMaterials(prev => ({ ...prev, [subMaterials.length]: true }));
    };

    const toggleSubMaterial = (index: number) => {
        setOpenSubMaterials(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleRemoveSub = (index: number) => {
        const updated = subMaterials.filter((_, i) => i !== index);
        setFieldValue('sub_materials', updated);
    };

    const handleSubChange = (index: number, field: string, value: any) => {
        const updated = subMaterials.map((sub, i) => {
            if (i === index) {
                return { ...sub, [field]: value };
            }
            return sub;
        });
        setFieldValue('sub_materials', updated);
    };

    const handleSubFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleSubChange(index, 'image', files[0]);
        }
    };

    const handleClearSubImage = (index: number) => {
        const updated = subMaterials.map((sub, i) => {
            if (i === index) {
                return { ...sub, image: null, image_path: undefined };
            }
            return sub;
        });
        setFieldValue('sub_materials', updated);
    };

    // Code Examples Handlers
    const codeExamples = formData.code_examples || [];

    const handleAddExample = () => {
        setFieldValue('code_examples', [...codeExamples, { title: '', code: '', output: '', explanation: '' }]);
        setOpenCodeExamples(prev => ({ ...prev, [codeExamples.length]: true }));
    };

    const toggleCodeExample = (index: number) => {
        setOpenCodeExamples(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleRemoveExample = (index: number) => {
        const updated = codeExamples.filter((_, i) => i !== index);
        setFieldValue('code_examples', updated);
    };

    const handleExampleChange = (index: number, field: string, value: string) => {
        const updated = codeExamples.map((ex, i) => {
            if (i === index) {
                return { ...ex, [field]: value };
            }
            return ex;
        });
        setFieldValue('code_examples', updated);
    };

    // PDF Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files && files[0] && files[0].type === 'application/pdf') {
            setFieldValue('material_pdf', files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setFieldValue('material_pdf', files[0]);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Section 1: Materi Pembelajaran */}
            <AccordionSection
                id="materi"
                title="Materi Pembelajaran (Sub-Materi)"
                description="Tulis sub-materi secara langsung yang dapat dipelajari siswa lengkap dengan gambar ilustrasi."
                icon={BookOpen}
                isOpen={openSections.materi}
                onToggle={() => toggleSection('materi')}
                hasError={hasMateriErrors}
            >
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-foreground">
                            Daftar Sub-Materi Pembelajaran
                        </Label>
                        <button
                            type="button"
                            onClick={handleAddSub}
                            className="flex items-center gap-1.5 rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 px-3.5 py-2 text-xs font-bold text-(--palette-green) transition-colors hover:bg-(--palette-green)/10 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Sub-Materi
                        </button>
                    </div>

                    {subMaterials.length > 0 ? (
                        <div className="space-y-6">
                            {subMaterials.map((sub, index) => {
                                const isSubOpen = !!openSubMaterials[index];
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden",
                                            isSubOpen
                                                ? "border-slate-350 bg-slate-100/40 ring-2 ring-slate-100"
                                                : "border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-350"
                                        )}
                                    >
                                        {/* Accordion Header */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSubMaterial(index)}
                                            className="flex w-full items-center justify-between p-5 text-left focus:outline-none transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="flex px-3 py-1.5 items-center justify-center rounded-xl bg-(--palette-green)/10 text-xs font-black text-(--palette-green) border border-(--palette-green)/20 uppercase tracking-wider shrink-0">
                                                    Sub Materi {index + 1}
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-bold truncate pr-4",
                                                    sub.title ? "text-foreground" : "text-muted-foreground italic font-medium"
                                                )}>
                                                    {sub.title || "Belum diberi judul..."}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSub(index);
                                                    }}
                                                    className="rounded-xl p-2 text-red-500 hover:bg-red-55 hover:text-red-600 transition-colors"
                                                    title="Hapus sub-materi"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <motion.div
                                                    animate={{ rotate: isSubOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-muted-foreground/60 mr-1"
                                                >
                                                    <ChevronDown className="h-5 w-5" />
                                                </motion.div>
                                            </div>
                                        </button>

                                        {/* Accordion Content */}
                                        <AnimatePresence initial={false}>
                                            {isSubOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    className="overflow-visible"
                                                >
                                                    <div className="p-5 pt-0 border-t border-slate-200/50 mt-1 space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-foreground">Judul Sub-Materi</Label>
                                                                <Input
                                                                    value={sub.title}
                                                                    onChange={(e) => handleSubChange(index, 'title', e.target.value)}
                                                                    placeholder="Contoh: Mengapa Data Harus Dibedakan?"
                                                                    className="h-11 rounded-lg border-gray-250 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/10 bg-white"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                                    <Play className="h-3.5 w-3.5 text-muted-foreground" />
                                                                    URL Video Pembelajaran (YouTube / Google Drive) (Opsional)
                                                                </Label>
                                                                <Input
                                                                    value={sub.video_url || ''}
                                                                    onChange={(e) => handleSubChange(index, 'video_url', e.target.value)}
                                                                    placeholder="Contoh: https://www.youtube.com/watch?v=..."
                                                                    className="h-11 rounded-lg border-gray-250 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/10 bg-white"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="md:col-span-2 space-y-2">
                                                                <Label className="text-xs font-bold text-foreground">Konten Materi</Label>
                                                                <RichTextEditor
                                                                    id={`sub-material-content-${index}`}
                                                                    value={sub.content}
                                                                    onChange={(val) => handleSubChange(index, 'content', val)}
                                                                    placeholder="Tulis materi pembelajaran di sini... Gunakan toolbar untuk memformat teks."
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-foreground">Gambar Konten (Opsional)</Label>
                                                                {sub.image || sub.image_path ? (
                                                                    <div className="border border-gray-150 rounded-xl p-3 bg-white space-y-3">
                                                                        <div className="aspect-video w-full rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100">
                                                                            <img
                                                                                src={sub.image ? URL.createObjectURL(sub.image) : `/storage/${sub.image_path}`}
                                                                                alt={`Sub materi ${index + 1}`}
                                                                                className="object-contain h-full w-full"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-center justify-between text-xs">
                                                                            <span className="text-muted-foreground truncate max-w-40 font-medium">
                                                                                {sub.image ? sub.image.name : 'Gambar tersimpan'}
                                                                            </span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleClearSubImage(index)}
                                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                                            >
                                                                                Hapus
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        onClick={() => document.getElementById(`sub-img-file-${index}`)?.click()}
                                                                        className="border-2 border-dashed border-gray-200 hover:border-(--palette-green)/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white flex flex-col items-center justify-center h-44"
                                                                    >
                                                                        <input
                                                                            type="file"
                                                                            id={`sub-img-file-${index}`}
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={(e) => handleSubFileChange(index, e)}
                                                                        />
                                                                        <ImageIcon className="text-slate-400 mb-2 h-7 w-7" />
                                                                        <span className="text-[11px] font-bold text-slate-500">Pilih Gambar</span>
                                                                        <span className="text-[9px] text-muted-foreground mt-0.5">PNG, JPG, JPEG (Maks. 2MB)</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                            <p className="text-sm font-bold text-muted-foreground/50">Belum ada sub-materi pembelajaran</p>
                            <p className="text-xs text-muted-foreground/40 mt-1">Siswa wajib membaca setidaknya satu sub-materi sebelum masuk ke compiler.</p>
                        </div>
                    )}

                    {getError('sub_materials') && (
                        <p className="text-xs font-semibold text-red-500 bg-red-50/50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                            <span>⚠️</span> {getError('sub_materials')}
                        </p>
                    )}
                </div>
            </AccordionSection>



            {/* Section 2: Contoh Kode Program */}
            <AccordionSection
                id="contoh"
                title="Contoh Kode Program"
                description="Tambahkan beberapa contoh kode program yang berkaitan dengan materi agar dapat dipelajari oleh siswa."
                icon={Code2}
                isOpen={openSections.contoh}
                onToggle={() => toggleSection('contoh')}
                hasError={hasContohErrors}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-foreground">
                            Daftar Contoh Program C
                        </Label>
                        <button
                            type="button"
                            onClick={handleAddExample}
                            className="flex items-center gap-1.5 rounded-xl border border-(--palette-green)/20 bg-(--palette-green)/5 px-3.5 py-2 text-xs font-bold text-(--palette-green) transition-colors hover:bg-(--palette-green)/10 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Contoh Kode
                        </button>
                    </div>

                    {codeExamples.length > 0 ? (
                        <div className="space-y-6">
                            {codeExamples.map((ex, index) => {
                                const isExOpen = !!openCodeExamples[index];
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden",
                                            isExOpen
                                                ? "border-slate-300 bg-slate-100/40 ring-2 ring-slate-100"
                                                : "border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        {/* Accordion Header */}
                                        <button
                                            type="button"
                                            onClick={() => toggleCodeExample(index)}
                                            className="flex w-full items-center justify-between p-5 text-left focus:outline-none transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="flex h-7 w-auto px-3 items-center justify-center rounded-xl bg-(--palette-green)/10 text-xs font-black text-(--palette-green) border border-(--palette-green)/20 shrink-0">
                                                    Contoh {index + 1}
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-bold truncate pr-4",
                                                    ex.title ? "text-foreground" : "text-muted-foreground italic font-medium"
                                                )}>
                                                    {ex.title || "Belum diberi judul..."}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveExample(index);
                                                    }}
                                                    className="rounded-xl p-2 text-red-500 hover:bg-red-55 hover:text-red-600 transition-colors"
                                                    title="Hapus contoh kode"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <motion.div
                                                    animate={{ rotate: isExOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-muted-foreground/60 mr-1"
                                                >
                                                    <ChevronDown className="h-5 w-5" />
                                                </motion.div>
                                            </div>
                                        </button>

                                        {/* Accordion Content */}
                                        <AnimatePresence initial={false}>
                                            {isExOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    className="overflow-visible"
                                                >
                                                    <div className="p-5 pt-0 border-t border-slate-200/50 mt-1 space-y-4">
                                                        <div className="space-y-2 pt-4">
                                                            <Label className="text-xs font-bold text-slate-700">Judul / Deskripsi Singkat Contoh</Label>
                                                            <Input
                                                                value={ex.title}
                                                                onChange={(e) => handleExampleChange(index, 'title', e.target.value)}
                                                                placeholder="Contoh: Contoh 1: Variabel & Tipe Data"
                                                                className="h-11 rounded-lg border-gray-250 transition-all focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/10 bg-white"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* Left Side: C Code Editor */}
                                                            <div className="space-y-2 flex flex-col">
                                                                <Label className="text-xs font-bold text-slate-700">Kode Program C</Label>
                                                                <div className="rounded-xl overflow-hidden border border-gray-250 min-h-[200px]">
                                                                    <Editor
                                                                        height="200px"
                                                                        language="c"
                                                                        theme="vs-dark"
                                                                        value={ex.code}
                                                                        onChange={(value) => handleExampleChange(index, 'code', value || '')}
                                                                        options={{
                                                                            minimap: { enabled: false },
                                                                            fontSize: 13,
                                                                            lineNumbers: 'on',
                                                                            scrollBeyondLastLine: false,
                                                                            wordWrap: 'on',
                                                                            padding: { top: 16, bottom: 16 },
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Right Side: Output and Explanation */}
                                                            <div className="space-y-4 flex flex-col justify-between">
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs font-bold text-slate-700">Contoh Output Program</Label>
                                                                    <textarea
                                                                        value={ex.output}
                                                                        onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                                                                        placeholder="Nama : Raka&#10;Umur : 16&#10;Aktif: True"
                                                                        className="w-full h-20 rounded-lg border border-gray-250 p-3 font-mono text-xs focus:border-(--palette-green) focus:ring-2 focus:ring-(--palette-green)/10 resize-none bg-white"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2 flex-1 flex flex-col">
                                                                    <Label className="text-xs font-bold text-slate-700">Penjelasan Kode</Label>
                                                                    <RichTextEditor
                                                                        id={`explanation-${index}`}
                                                                        value={ex.explanation}
                                                                        onChange={(val) => handleExampleChange(index, 'explanation', val)}
                                                                        placeholder="Jelaskan detail dari kode program di atas agar mudah dimengerti siswa..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                            <Code2 className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
                            <p className="text-sm font-bold text-muted-foreground/50">Belum ada contoh program yang dibuat</p>
                            <p className="text-xs text-muted-foreground/40 mt-1">Kamu bisa menambahkan contoh-contoh program C sebagai materi referensi tambahan siswa.</p>
                        </div>
                    )}

                    {getError('code_examples') && (
                        <p className="text-xs font-semibold text-red-500 bg-red-50/50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                            <span>⚠️</span> {getError('code_examples')}
                        </p>
                    )}
                </div>
            </AccordionSection>

            {/* Section 3: LKPD & Media (Commented Out)
            <AccordionSection
                id="media"
                title="LKPD & Media Pembelajaran"
                description="Unggah file Lembar Kerja Siswa (LKPD) dan sertakan video kasus/narasi untuk menunjang aktivitas kelompok."
                icon={Play}
                isOpen={openSections.media}
                onToggle={() => toggleSection('media')}
                hasError={hasMediaErrors}
            >
                <div className="space-y-8">

                    <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Dokumen LKPD (PDF)
                        </Label>

                        <div className="space-y-6">
                            <AnimatePresence mode="wait">
                                {formData.material_pdf ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-between rounded-2xl border border-(--palette-green)/30 bg-(--palette-green)/5 p-6 shadow-sm group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-(--palette-green) shadow-md shadow-black/5 transition-transform group-hover:scale-105 border border-(--palette-green)/10">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground truncate max-w-50 md:max-w-md">
                                                    {formData.material_pdf.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-(--palette-green) uppercase tracking-widest bg-(--palette-green)/10 px-2 py-0.5 rounded-full">
                                                        {formatFileSize(formData.material_pdf.size)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        PDF LKPD Siap diunggah
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFieldValue('material_pdf', null)}
                                            className="p-3 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
                                            type="button"
                                            title="Hapus file"
                                        >
                                            <X size={20} />
                                        </button>
                                    </motion.div>
                                ) : formData.material_pdf_existing ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 p-6 shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-md border border-slate-200">
                                                <FileText size={32} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    LKPD Saat Ini
                                                </p>
                                                <p className="text-sm text-muted-foreground truncate max-w-50 md:max-w-md mt-0.5">
                                                    {formData.material_pdf_existing}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-slate-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                <Check size={14} className="stroke-3" />
                                                <span>Tersimpan</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setFieldValue('remove_pdf', true);
                                                    setFieldValue('material_pdf_existing', undefined);
                                                }}
                                                className="p-1.5 rounded-full text-red-400 hover:text-red-650 hover:bg-red-50 transition-all active:scale-90"
                                                type="button"
                                                title="Hapus file"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('material_pdf')?.click()}
                                className={cn(
                                    'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300',
                                    dragActive
                                        ? 'border-(--palette-green) bg-(--palette-green)/5 scale-[1.02] shadow-xl shadow-(--palette-green)/5'
                                        : 'border-(--palette-limelight)/30 bg-gray-50/30 hover:border-(--palette-green)/40 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/40',
                                )}
                            >
                                <input
                                    id="material_pdf"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            'p-5 rounded-2xl mb-5 transition-all duration-300',
                                            dragActive
                                                ? 'bg-(--palette-green) text-white shadow-lg shadow-(--palette-green)/20 rotate-12'
                                                : 'bg-white text-muted-foreground shadow-sm border border-(--palette-limelight)/20',
                                        )}
                                    >
                                        <Upload size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">
                                        {dragActive
                                            ? 'Lepaskan file sekarang'
                                            : 'Klik untuk unggah atau seret file LKPD'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Format PDF, DOC, DOCX (Maksimal 50MB)
                                    </p>
                                </div>
                            </div>

                            {getError('material_pdf') && (
                                <p className="mt-2 text-xs font-bold text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                    <AlertCircle size={16} />
                                    {getError('material_pdf')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </AccordionSection>
            */}

            {/* Tips/Info Footer */}
            <motion.div
                className="flex items-start gap-4 rounded-2xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-6"
                variants={itemVariants}
            >
                <div className="shrink-0 rounded-xl border border-(--palette-limelight)/20 bg-white p-3 text-(--palette-green) shadow-sm">
                    <Lightbulb className="h-6 w-6" />
                </div>
                <div className="text-sm leading-relaxed">
                    <p className="mb-1 font-bold text-foreground">
                        Tip Pembelajaran
                    </p>
                    <p className="text-muted-foreground">
                        Tulis sub-materi yang padat dan mudah dipahami siswa langsung di dalam web. Kamu dapat menyertakan kode program C beserta contoh output yang diharapkan dan narasi kasus pemecahan masalah agar siswa siap bereksperimen di compiler.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
