import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Material from './Step2Material';
import Step3Review from './Step3Review';
import { MaterialFormData, useMaterialForm } from '@/hooks/useMaterialForm';

export interface Classroom {
    id: number;
    name: string;
    academic_year: string;
}

export interface MaterialOption {
    id: number;
    title: string;
    slug: string;
}

interface MaterialFormStepperProps {
    classrooms: Classroom[];
    prerequisites: MaterialOption[];
    onSubmit: (data: MaterialFormData) => void;
    isSubmitting?: boolean;
    mode?: 'create' | 'edit';
    initialMaterial?: Partial<MaterialFormData>;
}

const DIFFICULTY_LEVELS = [
    { value: 1, label: 'Pemula' },
    { value: 2, label: 'Menengah' },
    { value: 3, label: 'Mahir' },
    { value: 4, label: 'Expert' },
    { value: 5, label: 'Master' },
];

export default function MaterialFormStepper({
    classrooms,
    prerequisites,
    onSubmit,
    isSubmitting = false,
    mode = 'create',
    initialMaterial,
}: MaterialFormStepperProps) {
    const {
        currentStep,
        formData,
        errors,
        nextStep,
        prevStep,
        goToStep,
        setFieldValue,
        setIsSubmitting,
    } = useMaterialForm(initialMaterial);

    const handleNextStep = () => {
        if (nextStep()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevStep = () => {
        prevStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { number: 1, title: 'Informasi Dasar' },
        { number: 2, title: 'Materi' },
        { number: 3, title: 'Review & Konfirmasi' },
    ];

    return (
        <div className="mx-auto w-full max-w-4xl py-8">
            {/* Step Indicator */}
            <div className="mb-8">
                <div className="mb-4 flex justify-between">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="flex flex-1 flex-col items-center"
                        >
                            <button
                                onClick={() => goToStep(step.number)}
                                disabled={step.number > currentStep}
                                className={cn(
                                    'mb-2 flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all',
                                    currentStep >= step.number
                                        ? 'bg-blue-600 text-white'
                                        : 'cursor-not-allowed bg-gray-200 text-gray-600',
                                )}
                            >
                                {step.number}
                            </button>
                            <span
                                className={cn(
                                    'px-2 text-center text-sm font-medium',
                                    currentStep >= step.number
                                        ? 'text-gray-900'
                                        : 'text-gray-600',
                                )}
                            >
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{
                            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="rounded-lg bg-white p-6 shadow md:p-8">
                {currentStep === 1 && (
                    <Step1BasicInfo
                        formData={formData}
                        errors={errors}
                        classrooms={classrooms}
                        prerequisites={prerequisites}
                        difficultyLevels={DIFFICULTY_LEVELS}
                        setFieldValue={setFieldValue}
                    />
                )}

                {currentStep === 2 && (
                    <Step2Material
                        formData={formData}
                        errors={errors}
                        setFieldValue={setFieldValue}
                    />
                )}

                {currentStep === 3 && (
                    <Step3Review
                        formData={formData}
                        classrooms={classrooms}
                        prerequisites={prerequisites}
                        difficultyLevels={DIFFICULTY_LEVELS}
                        onEditStep={goToStep}
                    />
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                    <Button
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        variant="outline"
                    >
                        Kembali
                    </Button>

                    {currentStep < 3 ? (
                        <Button
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Lanjut
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting
                                ? 'Menyimpan...'
                                : mode === 'edit'
                                  ? 'Perbarui Material'
                                  : 'Simpan Material'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
