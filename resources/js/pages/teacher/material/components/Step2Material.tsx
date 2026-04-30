import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MaterialFormData } from '@/hooks/useMaterialForm';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface Step2MaterialProps {
    formData: MaterialFormData;
    errors: Record<string, string[]>;
    setFieldValue: (field: keyof MaterialFormData, value: any) => void;
}

export default function Step2Material({
    formData,
    errors,
    setFieldValue,
}: Step2MaterialProps) {
    const [dragActive, setDragActive] = useState(false);
    const getError = (field: string) => errors[field]?.[0];

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
        if (files && files[0]) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                setFieldValue('material_pdf', file);
            } else {
                setFieldValue('material_pdf', null);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setFieldValue('material_pdf', files[0]);
        }
    };

    const removeFile = () => {
        setFieldValue('material_pdf', null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
                Materi Pembelajaran
            </h2>

            {/* Video URL */}
            <div>
                <Label htmlFor="video_url" className="text-base font-semibold">
                    URL Video YouTube (Opsional)
                </Label>
                <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFieldValue('video_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={cn(getError('video_url') && 'border-red-600')}
                />
                <p className="mt-1 text-sm text-gray-600">
                    Paste URL video YouTube untuk orientasi materi
                </p>
                {getError('video_url') && (
                    <p className="mt-1 text-sm text-red-600">
                        {getError('video_url')}
                    </p>
                )}
            </div>

            {/* Case Narrative */}
            <div>
                <Label
                    htmlFor="case_narrative"
                    className="text-base font-semibold"
                >
                    Narasi Kasus / Problem Statement (Opsional)
                </Label>
                <textarea
                    id="case_narrative"
                    value={formData.case_narrative}
                    onChange={(e) =>
                        setFieldValue('case_narrative', e.target.value)
                    }
                    placeholder="Deskripsikan kasus atau masalah yang akan dipelajari siswa..."
                    className={cn(
                        'min-h-32 w-full rounded-md border px-3 py-2 font-sans',
                        getError('case_narrative') && 'border-red-600',
                    )}
                    maxLength={1000}
                />
                <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-600">
                        {formData.case_narrative.length}/1000
                    </p>
                    {getError('case_narrative') && (
                        <p className="text-sm text-red-600">
                            {getError('case_narrative')}
                        </p>
                    )}
                </div>
            </div>

            {/* PDF Upload */}
            <div>
                <Label
                    htmlFor="material_pdf"
                    className="text-base font-semibold"
                >
                    File PDF Materi (Opsional, Maksimal 50MB)
                </Label>

                {formData.material_pdf ? (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100">
                                <span className="font-bold text-red-600">
                                    PDF
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {formData.material_pdf.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {formatFileSize(formData.material_pdf.size)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="text-red-600 transition-colors hover:text-red-800"
                            type="button"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : formData.material_pdf_existing ? (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm text-blue-800">
                            ✓ File PDF saat ini:{' '}
                            <span className="font-medium">
                                {formData.material_pdf_existing}
                            </span>
                        </p>
                        <p className="mt-2 text-xs text-blue-700">
                            Upload file baru untuk mengganti file yang ada
                        </p>
                    </div>
                ) : null}

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        'mt-4 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                        dragActive
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400',
                    )}
                >
                    <input
                        id="material_pdf"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <label
                        htmlFor="material_pdf"
                        className="flex cursor-pointer flex-col items-center"
                    >
                        <Upload
                            size={32}
                            className={cn(
                                'mb-2',
                                dragActive ? 'text-blue-600' : 'text-gray-400',
                            )}
                        />
                        <span className="font-medium text-gray-700">
                            Drag and drop file PDF di sini
                        </span>
                        <span className="mt-1 text-sm text-gray-500">
                            atau klik untuk memilih file
                        </span>
                    </label>
                </div>

                {getError('material_pdf') && (
                    <p className="mt-2 text-sm text-red-600">
                        {getError('material_pdf')}
                    </p>
                )}

                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-800">
                        📋 <span className="font-semibold">Format:</span> PDF
                        (maks. 50MB)
                    </p>
                    <p className="mt-2 text-xs text-amber-700">
                        Opsional - Anda dapat menambahkan atau mengubah file PDF
                        nanti
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    💡 <span className="font-semibold">Tip:</span> Sediakan
                    video orientasi dan deskripsi kasus yang jelas untuk
                    membantu siswa memahami materi.
                </p>
            </div>
        </div>
    );
}
