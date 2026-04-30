import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

interface FilterButtonProps {
    label: string;
    options: Array<{
        id: string | number;
        name: string;
    }>;
    value?: string | number;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    color?: 'primary' | 'success' | 'warning';
    className?: string;
}

export default function FilterButton({
    label,
    options,
    value,
    onChange,
    placeholder = 'All',
    color = 'primary',
    className,
}: FilterButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const colorClasses = {
        primary: {
            bg: 'bg-[var(--palette-chartreuse)]',
            bgInactive: 'bg-[var(--palette-chartreuse)]/10',
        },
        success: {
            bg: 'bg-[var(--palette-green)]',
            bgInactive: 'bg-[var(--palette-green)]/10',
        },
        warning: {
            bg: 'bg-[var(--palette-sunflower)]',
            bgInactive: 'bg-[var(--palette-sunflower)]/10',
        },
    };

    const selectedOption = options.find((opt) => opt.id === value);
    const colorClass = colorClasses[color];

    return (
        <div className={cn('relative', className)}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center justify-between gap-2 rounded-lg border px-4 py-2 transition-all w-full',
                    value
                        ? `${colorClass.bg} border-transparent text-white`
                        : `${colorClass.bgInactive} border-(--palette-limelight)/20`,
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="text-sm font-medium truncate">
                    {selectedOption ? selectedOption.name : label}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={
                    isOpen
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -10, pointerEvents: 'none' }
                }
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 z-20 mt-3 w-64 rounded-2xl border border-(--palette-limelight)/20 bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden"
            >
                <div className="space-y-1 p-2">
                    {/* All Option */}
                    <motion.button
                        onClick={() => {
                            onChange(null);
                            setIsOpen(false);
                        }}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all mb-1 ${
                            !value
                                ? `${colorClass.bg} font-bold text-white shadow-lg`
                                : 'hover:bg-(--palette-limelight)/10 text-muted-foreground'
                        }`}
                        whileHover={{ x: 4 }}
                    >
                        {placeholder}
                    </motion.button>

                    {/* Options */}
                    {options.map((option, index) => (
                        <motion.button
                            key={option.id}
                            onClick={() => {
                                onChange(option.id);
                                setIsOpen(false);
                            }}
                            className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all mb-1 last:mb-0 ${
                                value === option.id
                                    ? `${colorClass.bg} font-bold text-white shadow-lg`
                                    : 'hover:bg-(--palette-limelight)/10 text-muted-foreground'
                            }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 4 }}
                        >
                            {option.name}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
