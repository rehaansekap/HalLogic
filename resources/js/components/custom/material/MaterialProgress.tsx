import { motion } from 'framer-motion';
import { CheckCircle2, CircleDot, Lock, PlayCircle } from 'lucide-react';

interface MaterialProgressProps {
    currentStep: number;
    activePhase: number;
    onPhaseChange: (phase: number) => void;
}

export default function MaterialProgress({
    currentStep,
    activePhase,
    onPhaseChange,
}: MaterialProgressProps) {
    const steps = [
        'Orientasi',
        'Penyelidikan',
        'Evaluasi',
    ];

    return (
        <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex w-full snap-x snap-mandatory overflow-x-auto p-1 hide-scrollbar md:p-4">
                <div className="flex min-w-max gap-3 px-1 md:grid md:w-full md:min-w-0 md:grid-cols-3">
                    {steps.map((step, idx) => {
                        const stepNumber = idx + 1;
                        const isUnlocked = stepNumber <= currentStep;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrentStep = stepNumber === currentStep;
                        const isActive = stepNumber === activePhase;

                        let stateClasses = '';
                        let IconComponent = Lock;
                        let iconColor = '';
                        let badgeText = '';
                        let badgeClasses = '';

                        if (isActive) {
                            stateClasses =
                                'border-2 border-(--palette-limelight) bg-(--palette-limelight)/10 shadow-md ring-4 ring-(--palette-limelight)/5 scale-[1.02] md:scale-105 z-10';
                            IconComponent = PlayCircle;
                            iconColor = 'text-(--palette-limelight)';
                            badgeText = 'Sedang Aktif';
                            badgeClasses =
                                'bg-(--palette-limelight)/20 text-(--palette-limelight)';
                        } else if (isCompleted) {
                            stateClasses =
                                'border-2 border-(--palette-green)/30 bg-(--palette-green)/5 hover:bg-(--palette-green)/10 hover:border-(--palette-green)/50 cursor-pointer shadow-sm';
                            IconComponent = CheckCircle2;
                            iconColor = 'text-(--palette-green)';
                            badgeText = 'Selesai';
                            badgeClasses =
                                'bg-(--palette-green)/10 text-(--palette-green)';
                        } else if (isCurrentStep) {
                            stateClasses =
                                'border-2 border-dashed border-(--palette-sunflower) bg-(--palette-sunflower)/5 hover:bg-(--palette-sunflower)/10 cursor-pointer shadow-sm';
                            IconComponent = CircleDot;
                            iconColor = 'text-(--palette-sunflower)';
                            badgeText = 'Belum Selesai';
                            badgeClasses =
                                'bg-(--palette-sunflower)/10 text-(--palette-sunflower)';
                        } else {
                            stateClasses =
                                'border-2 border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed';
                            IconComponent = Lock;
                            iconColor = 'text-slate-400';
                            badgeText = 'Terkunci';
                            badgeClasses = 'bg-slate-200/50 text-slate-500';
                        }

                        return (
                            <motion.button
                                key={idx}
                                onClick={() =>
                                    isUnlocked && onPhaseChange(stepNumber)
                                }
                                disabled={!isUnlocked}
                                className={`group relative flex w-60 shrink-0 snap-center flex-col items-start gap-3 rounded-2xl p-4 transition-all duration-300 md:w-auto ${stateClasses}`}
                                whileHover={
                                    isUnlocked && !isActive
                                        ? { y: -2, scale: 1.02 }
                                        : {}
                                }
                                whileTap={
                                    isUnlocked && !isActive
                                        ? { scale: 0.98 }
                                        : {}
                                }
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${isActive ? 'scale-110 ring-2 ring-(--palette-limelight)/50' : 'group-hover:scale-110'}`}
                                    >
                                        <IconComponent
                                            className={`h-5 w-5 ${iconColor}`}
                                        />
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${badgeClasses}`}
                                    >
                                        {badgeText}
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-col items-start text-left">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Fase {stepNumber}
                                    </span>
                                    <span
                                        className={`text-base font-bold ${isActive ? 'text-foreground' : 'text-slate-700'}`}
                                    >
                                        {step}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </motion.div>
    );
}
