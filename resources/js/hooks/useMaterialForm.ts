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
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        } else if (step === 2) {
            if (formData.video_url && !isValidYoutubeUrl(formData.video_url)) {
                newErrors.video_url = ['URL harus dari YouTube'];
            }
            if (
                formData.case_narrative &&
                formData.case_narrative.length > 1000
            ) {
                newErrors.case_narrative = ['Narasi maksimal 1000 karakter'];
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
            setCurrentStep((prev) => Math.min(prev + 1, 3));
            return true;
        }
        return false;
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        if (step > 1 && !validateStep(currentStep)) {
            return false;
        }
        setCurrentStep(step);
        return true;
    };

    return {
        currentStep,
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
