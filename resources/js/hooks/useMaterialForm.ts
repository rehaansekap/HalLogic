import { useState } from 'react';

export interface MaterialFormData {
    classroom_id: number | null;
    title: string;
    description: string;
    difficulty_level: number | null;
    prerequisite_material_id: number | null;
    started_at: string | null;
    finished_at: string | null;
    video_url: string;
    case_narrative: string;
    material_pdf: File | null;
    material_pdf_existing?: string; // For edit mode - existing file path
    remove_pdf?: boolean; // Flag to indicate existing pdf should be removed
    summary: string;
    learning_objectives: string[];
    pre_reflection_questions: string[];
    post_reflection_questions: string[];
    sub_materials: Array<{
        title: string;
        content: string;
        image: File | null;
        image_path?: string;
    }>;
    code_examples: Array<{
        title: string;
        code: string;
        output: string;
        explanation: string;
    }>;
}

export interface FormErrors {
    [key: string]: string[];
}

export function useMaterialForm(initialData?: Partial<MaterialFormData>) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<MaterialFormData>({
        classroom_id: initialData?.classroom_id ?? null,
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        difficulty_level: initialData?.difficulty_level ?? null,
        prerequisite_material_id: initialData?.prerequisite_material_id ?? null,
        started_at: initialData?.started_at ?? null,
        finished_at: initialData?.finished_at ?? null,
        video_url: initialData?.video_url ?? '',
        case_narrative: initialData?.case_narrative ?? '',
        material_pdf: initialData?.material_pdf ?? null,
        material_pdf_existing: initialData?.material_pdf_existing ?? undefined,
        remove_pdf: false,
        summary: initialData?.summary ?? '',
        learning_objectives: (initialData?.learning_objectives && initialData.learning_objectives.length > 0)
            ? initialData.learning_objectives
            : [''],
        pre_reflection_questions: initialData?.pre_reflection_questions ?? [],
        post_reflection_questions: initialData?.post_reflection_questions ?? [],
        sub_materials: initialData?.sub_materials ?? [],
        code_examples: initialData?.code_examples ?? [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [furthestStep, setFurthestStep] = useState(initialData ? 4 : 1);

    const setFieldValue = (field: keyof MaterialFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts editing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const setFieldError = (field: string, message: string | string[]) => {
        setErrors((prev) => ({
            ...prev,
            [field]: Array.isArray(message) ? message : [message],
        }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: FormErrors = {};

        if (step === 1) {
            if (!formData.classroom_id) {
                newErrors.classroom_id = ['Kelas wajib dipilih'];
            }
            if (!formData.title.trim()) {
                newErrors.title = ['Judul wajib diisi'];
            } else if (formData.title.length > 255) {
                newErrors.title = ['Judul maksimal 255 karakter'];
            }
            if (!formData.description.trim()) {
                newErrors.description = ['Deskripsi wajib diisi'];
            } else if (formData.description.length > 5000) {
                newErrors.description = ['Deskripsi maksimal 5000 karakter'];
            }
            if (!formData.difficulty_level) {
                newErrors.difficulty_level = [
                    'Tingkat kesulitan wajib dipilih',
                ];
            }

            // Date validation
            if (formData.started_at && formData.finished_at) {
                if (
                    new Date(formData.finished_at) <
                    new Date(formData.started_at)
                ) {
                    newErrors.finished_at = [
                        'Tanggal selesai harus setelah tanggal mulai',
                    ];
                }
            }

            // Summary validation
            if (!formData.summary || !formData.summary.trim()) {
                newErrors.summary = ['Ringkasan materi wajib diisi'];
            } else if (formData.summary.length > 2000) {
                newErrors.summary = ['Ringkasan materi maksimal 2000 karakter'];
            }

            // Learning objectives validation
            if (!formData.learning_objectives || formData.learning_objectives.length === 0) {
                newErrors.learning_objectives = ['Minimal harus mengisi satu tujuan pembelajaran'];
            } else {
                const emptyIndex = formData.learning_objectives.findIndex(tp => !tp.trim());
                if (emptyIndex !== -1) {
                    newErrors.learning_objectives = ['Tujuan pembelajaran tidak boleh kosong'];
                } else {
                    const longIndex = formData.learning_objectives.findIndex(tp => tp.length > 255);
                    if (longIndex !== -1) {
                        newErrors.learning_objectives = ['Tujuan pembelajaran maksimal 255 karakter'];
                    }
                }
            }
        } else if (step === 2) {
            // Sub materials validation
            if (!formData.sub_materials || formData.sub_materials.length === 0) {
                newErrors.sub_materials = ['Minimal harus mengisi satu sub-materi'];
            } else {
                const invalidSub = formData.sub_materials.some(sub => !sub.title?.trim() || !sub.content?.trim());
                if (invalidSub) {
                    newErrors.sub_materials = ['Setiap sub-materi wajib memiliki judul dan konten materi'];
                }
            }

            // Code examples validation
            if (formData.code_examples && formData.code_examples.length > 0) {
                const invalidExample = formData.code_examples.some(
                    ex => !ex.title?.trim() || !ex.code?.trim() || !ex.output?.trim() || !ex.explanation?.trim()
                );
                if (invalidExample) {
                    newErrors.code_examples = ['Setiap contoh kode wajib memiliki judul, kode program, output, dan penjelasan'];
                }
            }
        } else if (step === 3) {
            if (formData.video_url && !isValidYoutubeUrl(formData.video_url)) {
                newErrors.video_url = ['URL harus dari YouTube'];
            }
            if (
                formData.case_narrative &&
                formData.case_narrative.length > 1000
            ) {
                newErrors.case_narrative = ['Narasi maksimal 1000 karakter'];
            }

            if (formData.pre_reflection_questions && formData.pre_reflection_questions.length > 0) {
                const emptyPre = formData.pre_reflection_questions.findIndex(q => !q.trim());
                if (emptyPre !== -1) {
                    newErrors.pre_reflection_questions = ['Pertanyaan refleksi awal tidak boleh kosong'];
                } else {
                    const longPre = formData.pre_reflection_questions.findIndex(q => q.length > 255);
                    if (longPre !== -1) {
                        newErrors.pre_reflection_questions = ['Pertanyaan refleksi awal maksimal 255 karakter'];
                    }
                }
            }
            if (formData.post_reflection_questions && formData.post_reflection_questions.length > 0) {
                const emptyPost = formData.post_reflection_questions.findIndex(q => !q.trim());
                if (emptyPost !== -1) {
                    newErrors.post_reflection_questions = ['Pertanyaan refleksi akhir tidak boleh kosong'];
                } else {
                    const longPost = formData.post_reflection_questions.findIndex(q => q.length > 255);
                    if (longPost !== -1) {
                        newErrors.post_reflection_questions = ['Pertanyaan refleksi akhir maksimal 255 karakter'];
                    }
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidYoutubeUrl = (url: string): boolean => {
        if (!url) return true; // Optional field
        return /youtube\.com|youtu\.be/.test(url);
    };

    const nextStep = (): boolean => {
        if (validateStep(currentStep)) {
            const next = Math.min(currentStep + 1, 4);
            setCurrentStep(next);
            setFurthestStep((prev) => Math.max(prev, next));
            return true;
        }
        return false;
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        if (step > furthestStep) return false;
        if (step > currentStep && !validateStep(currentStep)) {
            return false;
        }
        setCurrentStep(step);
        setFurthestStep((prev) => Math.max(prev, step));
        return true;
    };

    return {
        currentStep,
        furthestStep,
        formData,
        errors,
        isSubmitting,
        setIsSubmitting,
        setFieldValue,
        setFieldError,
        nextStep,
        prevStep,
        goToStep,
        setErrors,
    };
}
