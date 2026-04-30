import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { cn } from '@/lib/utils';
import type { Classroom, MaterialOption } from './MaterialFormStepper';

interface Step1BasicInfoProps {
    formData: MaterialFormData;
    errors: Record<string, string[]>;
    classrooms: Classroom[];
    prerequisites: MaterialOption[];
    difficultyLevels: Array<{ value: number; label: string }>;
    setFieldValue: (field: keyof MaterialFormData, value: any) => void;
}

export default function Step1BasicInfo({
    formData,
    errors,
    classrooms,
    prerequisites,
    difficultyLevels,
    setFieldValue,
}: Step1BasicInfoProps) {
    const getError = (field: string) => errors[field]?.[0];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
                Informasi Dasar Material
            </h2>

            {/* Classroom Selection */}
            <div>
                <Label
                    htmlFor="classroom_id"
                    className="text-base font-semibold"
                >
                    Pilih Kelas <span className="text-red-600">*</span>
                </Label>
                <Select
                    value={formData.classroom_id?.toString() || ''}
                    onValueChange={(value) =>
                        setFieldValue('classroom_id', parseInt(value, 10))
                    }
                >
                    <SelectTrigger
                        id="classroom_id"
                        className={cn(
                            getError('classroom_id') && 'border-red-600',
                        )}
                    >
                        <SelectValue placeholder="Pilih kelas..." />
                    </SelectTrigger>
                    <SelectContent>
                        {classrooms.map((classroom) => (
                            <SelectItem
                                key={classroom.id}
                                value={classroom.id.toString()}
                            >
                                {classroom.name} ({classroom.academic_year})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {getError('classroom_id') && (
                    <p className="mt-1 text-sm text-red-600">
                        {getError('classroom_id')}
                    </p>
                )}
            </div>

            {/* Title */}
            <div>
                <Label htmlFor="title" className="text-base font-semibold">
                    Judul Material <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFieldValue('title', e.target.value)}
                    placeholder="Masukkan judul material..."
                    className={cn(getError('title') && 'border-red-600')}
                    maxLength={255}
                />
                <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-600">
                        {formData.title.length}/255
                    </p>
                    {getError('title') && (
                        <p className="text-sm text-red-600">
                            {getError('title')}
                        </p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div>
                <Label
                    htmlFor="description"
                    className="text-base font-semibold"
                >
                    Deskripsi <span className="text-red-600">*</span>
                </Label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                        setFieldValue('description', e.target.value)
                    }
                    placeholder="Masukkan deskripsi material..."
                    className={cn(
                        'min-h-32 w-full rounded-md border px-3 py-2 font-sans',
                        getError('description') && 'border-red-600',
                    )}
                    maxLength={5000}
                />
                <div className="mt-1 flex justify-between">
                    <p className="text-sm text-gray-600">
                        {formData.description.length}/5000
                    </p>
                    {getError('description') && (
                        <p className="text-sm text-red-600">
                            {getError('description')}
                        </p>
                    )}
                </div>
            </div>

            {/* Difficulty Level */}
            <div>
                <Label
                    htmlFor="difficulty_level"
                    className="text-base font-semibold"
                >
                    Tingkat Kesulitan <span className="text-red-600">*</span>
                </Label>
                <div className="mt-2 grid grid-cols-5 gap-2">
                    {difficultyLevels.map((level) => (
                        <button
                            key={level.value}
                            onClick={() =>
                                setFieldValue('difficulty_level', level.value)
                            }
                            className={cn(
                                'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                formData.difficulty_level === level.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                            )}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>
                {getError('difficulty_level') && (
                    <p className="mt-1 text-sm text-red-600">
                        {getError('difficulty_level')}
                    </p>
                )}
            </div>

            {/* Prerequisite Material */}
            <div>
                <Label
                    htmlFor="prerequisite_material_id"
                    className="text-base font-semibold"
                >
                    Material Prasyarat (Opsional)
                </Label>
                <Select
                    value={formData.prerequisite_material_id?.toString() || 'none'}
                    onValueChange={(value) =>
                        setFieldValue(
                            'prerequisite_material_id',
                            value === 'none' ? null : parseInt(value, 10),
                        )
                    }
                >
                    <SelectTrigger id="prerequisite_material_id">
                        <SelectValue placeholder="Pilih material prasyarat..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Tidak Ada</SelectItem>
                        {prerequisites.map((material) => (
                            <SelectItem
                                key={material.id}
                                value={material.id.toString()}
                            >
                                {material.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {getError('prerequisite_material_id') && (
                    <p className="mt-1 text-sm text-red-600">
                        {getError('prerequisite_material_id')}
                    </p>
                )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label
                        htmlFor="started_at"
                        className="text-base font-semibold"
                    >
                        Tanggal Mulai (Opsional)
                    </Label>
                    <Input
                        id="started_at"
                        type="date"
                        value={formData.started_at || ''}
                        onChange={(e) =>
                            setFieldValue('started_at', e.target.value || null)
                        }
                        className={cn(
                            getError('started_at') && 'border-red-600',
                        )}
                    />
                    {getError('started_at') && (
                        <p className="mt-1 text-sm text-red-600">
                            {getError('started_at')}
                        </p>
                    )}
                </div>

                <div>
                    <Label
                        htmlFor="finished_at"
                        className="text-base font-semibold"
                    >
                        Tanggal Selesai (Opsional)
                    </Label>
                    <Input
                        id="finished_at"
                        type="date"
                        value={formData.finished_at || ''}
                        onChange={(e) =>
                            setFieldValue('finished_at', e.target.value || null)
                        }
                        className={cn(
                            getError('finished_at') && 'border-red-600',
                        )}
                    />
                    {getError('finished_at') && (
                        <p className="mt-1 text-sm text-red-600">
                            {getError('finished_at')}
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    💡 <span className="font-semibold">Tip:</span> Isi semua
                    informasi dasar dengan cermat. Anda bisa mengeditnya nanti
                    jika diperlukan.
                </p>
            </div>
        </div>
    );
}
