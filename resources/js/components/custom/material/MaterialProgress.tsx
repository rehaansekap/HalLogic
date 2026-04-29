import { PlayIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';

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
        'Refleksi',
        'Organisasi',
        'Eksperimen',
        'Pengumpulan',
        'Evaluasi',
    ];

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex w-full overflow-x-auto pb-4 snap-x snap-mandatory">
                <div className="flex min-w-max gap-3 md:w-full md:grid md:grid-cols-5">
                    {steps.map((step, idx) => {
                        const stepNumber = idx + 1;
                        const isUnlocked = stepNumber <= currentStep;
                        const isCurrentStep = stepNumber === currentStep;
                        const isActive = stepNumber === activePhase;

                        return (
                            <motion.button
                                key={idx}
                                onClick={() => onPhaseChange(stepNumber)}
                                disabled={!isUnlocked}
                                className={`snap-center flex flex-col xl:flex-row items-center gap-3 rounded-xl p-3 xl:p-4 text-center xl:text-left transition-all duration-200 ${
                                    isActive
                                        ? 'border-2 border-[--palette-limelight] bg-[--palette-limelight]/10 text-foreground shadow-md'
                                        : isUnlocked
                                          ? 'border border-slate-200 bg-white text-slate-600 hover:border-[--palette-limelight]/40 hover:bg-slate-50 hover:shadow-sm'
                                          : 'cursor-not-allowed border border-slate-100 bg-slate-50/50 text-slate-400 opacity-70'
                                }`}
                                whileHover={isUnlocked ? { y: -2 } : {}}
                                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                            >
                                <div className={`shrink-0 rounded-full p-2 ${isActive ? 'bg-white shadow-sm' : isUnlocked ? 'bg-slate-100' : 'bg-transparent'}`}>
                                    {isUnlocked && !isActive ? (
                                        <CheckCircle2 className={`h-5 w-5 ${isCurrentStep ? 'text-[--palette-green]' : 'text-slate-400'}`} />
                                    ) : isActive ? (
                                        <PlayIcon className="h-5 w-5 text-[--palette-limelight]" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-slate-300" />
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 items-center xl:items-start min-w-0">
                                    <span className={`text-xs font-bold xl:text-sm truncate w-full ${isActive ? 'text-[--palette-limelight]' : ''}`}>
                                        {step}
                                    </span>
                                    {isCurrentStep && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[--palette-green]">
                                            Fase Aktif
                                        </span>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
