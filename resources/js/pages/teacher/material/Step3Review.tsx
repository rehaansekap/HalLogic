import { MaterialFormData } from '@/hooks/useMaterialForm';
import type { Classroom, MaterialOption } from './MaterialFormStepper';
import { FileText } from 'lucide-react';

interface Step3ReviewProps {
    formData: MaterialFormData;
    classrooms: Classroom[];
    prerequisites: MaterialOption[];
    difficultyLevels: Array<{ value: number; label: string }>;
    onEditStep: (step: number) => boolean;
}

export default function Step3Review({
    formData,
    classrooms,
    prerequisites,
    difficultyLevels,
    onEditStep,
}: Step3ReviewProps) {
    const selectedClassroom = classrooms.find(
        (c) => c.id === formData.classroom_id,
    );
    const selectedPrerequisite = prerequisites.find(
        (p) => p.id === formData.prerequisite_material_id,
    );
    const selectedDifficulty = difficultyLevels.find(
        (d) => d.value === formData.difficulty_level,
    );

    const ReviewSection = ({
        title,
        children,
        step,
    }: {
        title: string;
        children: React.ReactNode;
        step: number;
    }) => (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <button
                    onClick={() => onEditStep(step)}
                    className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
                >
                    Ubah
                </button>
            </div>
            {children}
        </div>
    );

    const ReviewField = ({
        label,
        value,
    }: {
        label: string;
        value?: React.ReactNode;
    }) => (
        <div className="mb-3 last:mb-0">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-medium text-gray-900">{value || '-'}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
                Review & Konfirmasi
            </h2>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    ✓ Periksa kembali semua informasi. Anda masih bisa kembali
                    ke langkah sebelumnya untuk mengubah data.
                </p>
            </div>

            {/* Step 1 Review */}
            <ReviewSection title="Informasi Dasar" step={1}>
                <ReviewField
                    label="Kelas"
                    value={
                        selectedClassroom
                            ? `${selectedClassroom.name} (${selectedClassroom.academic_year})`
                            : '-'
                    }
                />
                <ReviewField label="Judul Material" value={formData.title} />
                <ReviewField
                    label="Deskripsi"
                    value={
                        <p className="line-clamp-3 font-medium whitespace-pre-wrap text-gray-900">
                            {formData.description}
                        </p>
                    }
                />
                <ReviewField
                    label="Tingkat Kesulitan"
                    value={selectedDifficulty?.label}
                />
                <ReviewField
                    label="Material Prasyarat"
                    value={selectedPrerequisite?.title || 'Tidak Ada'}
                />
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-sm text-gray-600">Tanggal Mulai</p>
                        <p className="font-medium text-gray-900">
                            {formData.started_at || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tanggal Selesai</p>
                        <p className="font-medium text-gray-900">
                            {formData.finished_at || '-'}
                        </p>
                    </div>
                </div>
            </ReviewSection>

            {/* Step 2 Review */}
            <ReviewSection title="Materi Pembelajaran" step={2}>
                <ReviewField
                    label="URL Video YouTube"
                    value={
                        formData.video_url ? (
                            <a
                                href={formData.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-blue-600 underline hover:text-blue-800"
                            >
                                {formData.video_url}
                            </a>
                        ) : (
                            '-'
                        )
                    }
                />
                <ReviewField
                    label="Narasi Kasus"
                    value={
                        formData.case_narrative ? (
                            <p className="line-clamp-3 font-medium whitespace-pre-wrap text-gray-900">
                                {formData.case_narrative}
                            </p>
                        ) : (
                            '-'
                        )
                    }
                />
                <div className="mt-3">
                    <p className="mb-2 text-sm text-gray-600">
                        File PDF Materi
                    </p>
                    {formData.material_pdf ? (
                        <div className="flex items-center gap-2 rounded border border-green-200 bg-green-50 p-2 text-green-700">
                            <FileText size={16} />
                            <span className="text-sm font-medium">
                                {formData.material_pdf.name}
                            </span>
                        </div>
                    ) : formData.material_pdf_existing ? (
                        <div className="flex items-center gap-2 rounded border border-blue-200 bg-blue-50 p-2 text-blue-700">
                            <FileText size={16} />
                            <span className="text-sm font-medium">
                                {formData.material_pdf_existing} (existing)
                            </span>
                        </div>
                    ) : (
                        <p className="font-medium text-gray-900">
                            Tidak Ada File
                        </p>
                    )}
                </div>
            </ReviewSection>

            {/* Summary */}
            <div className="rounded-lg bg-gray-100 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">
                    Ringkasan Akhir
                </h4>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                            Kelas:{' '}
                            <strong>{selectedClassroom?.name || '-'}</strong>
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                            Judul: <strong>{formData.title || '-'}</strong>
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                            Tingkat:{' '}
                            <strong>{selectedDifficulty?.label || '-'}</strong>
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                            Video:{' '}
                            <strong>
                                {formData.video_url ? 'Ada' : 'Tidak'}
                            </strong>
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>
                            PDF:{' '}
                            <strong>
                                {formData.material_pdf
                                    ? 'Baru'
                                    : formData.material_pdf_existing
                                      ? 'Existing'
                                      : 'Tidak Ada'}
                            </strong>
                        </span>
                    </li>
                </ul>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-800">
                    🎉{' '}
                    <span className="font-semibold">Siap untuk menyimpan?</span>{' '}
                    Klik tombol "Simpan Material" di bawah untuk menyelesaikan.
                </p>
            </div>
        </div>
    );
}
