import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    Info,
    Layers,
    Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMaterialForm } from '@/hooks/useMaterialForm';
import type { MaterialFormData } from '@/hooks/useMaterialForm';
import { cn } from '@/lib/utils';

import Step1BasicInfo from './Step1BasicInfo';
import Step2Material from './Step2Material';
import Step3Review from './Step3Review';

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
        { number: 1, title: 'Informasi Dasar', icon: Info },
        { number: 2, title: 'Materi Pembelajaran', icon: BookOpen },
        { number: 3, title: 'Review & Simpan', icon: Layers },
    ];

    return (
        <div className="mx-auto w-full max-w-5xl">
            {/* Step Indicator Wrapper */}
            <div className="mb-12 relative px-4">
                {/* Desktop Stepper */}
                <div className="hidden md:flex justify-between items-start relative z-10 max-w-4xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.number;
                        const isCompleted = currentStep > step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center group relative flex-1">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-100 -z-10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: isCompleted ? '100%' : '0%' }}
                                            className="h-full bg-(--palette-green)"
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={() => isCompleted && goToStep(step.number)}
                                    disabled={!isCompleted && !isActive}
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                        isActive ? "bg-(--palette-green) text-white ring-8 ring-(--palette-green)/10 scale-110 shadow-lg shadow-(--palette-green)/20" :
                                            isCompleted ? "bg-(--palette-white) text-(--palette-green) border border-(--palette-green)" : "bg-white text-gray-300 border-2 border-gray-100"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6 stroke-[3px]" />
                                    ) : (
                                        <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                                    )}
                                </button>

                                <div className="mt-5 text-center px-2">
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 transition-colors duration-300",
                                        isActive ? "text-(--palette-green)" : isCompleted ? "text-(--palette-green)/70" : "text-gray-400"
                                    )}>
                                        Step {step.number}
                                    </p>
                                    <h4 className={cn(
                                        "text-xs font-extrabold transition-colors duration-300 uppercase tracking-wider",
                                        isActive ? "text-gray-900" : "text-gray-400"
                                    )}>
                                        {step.title}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Progress Info */}
                <div className="md:hidden flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-bold text-(--palette-green) uppercase tracking-[0.2em] mb-1">
                            Langkah {currentStep} dari {steps.length}
                        </p>
                        <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">{steps[currentStep - 1].title}</h4>
                    </div>
                    <div className="bg-(--palette-green)/10 rounded-2xl p-3.5 border border-(--palette-green)/20">
                        {(() => {
                            const Icon = steps[currentStep-1].icon;
                            return <Icon className="w-6 h-6 text-(--palette-green)" />;
                        })()}
                    </div>
                </div>

                {/* Mobile Progress Bar */}
                <div className="md:hidden h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                        className="h-full bg-(--palette-green)"
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white rounded-4xl shadow-2xl shadow-gray-200/40 border border-(--palette-limelight)/20 overflow-visible"
                    >
                        <div className="p-6 md:p-12">
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

                            {/* Action Buttons */}
                            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    onClick={handlePrevStep}
                                    disabled={currentStep === 1 || isSubmitting}
                                    variant="ghost"
                                    className="w-full sm:w-auto h-14 px-10 font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all rounded-2xl"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Kembali
                                </Button>

                                <div className="sm:ml-auto w-full sm:w-auto">
                                    {currentStep < 3 ? (
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={isSubmitting}
                                            className="w-full h-14 px-12 font-bold bg-(--palette-green) hover:bg-green-600 text-white rounded-2xl shadow-xl shadow-green-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <span>Lanjutkan</span>
                                            <ChevronRight className="w-5 h-5 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="w-full h-14 px-12 font-bold bg-(--palette-green) hover:bg-green-700 text-white rounded-2xl shadow-xl shadow-green-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Menyimpan...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <Save className="w-5 h-5" />
                                                    <span>{mode === 'edit' ? 'Perbarui Material' : 'Simpan & Publikasikan'}</span>
                                                </div>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Step Support Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 flex items-center justify-center gap-8 text-gray-400"
                >
                    <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-(--palette-green)" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Autosave diaktifkan</span>
                    </div>
                    <div className="h-1.5 w-1.5 bg-gray-200 rounded-full" />
                    <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-(--palette-green)" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Koneksi Aman</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
