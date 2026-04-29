import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
}

export default function FilterButton({
    label,
    options,
    value,
    onChange,
    placeholder = 'All',
    color = 'primary',
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
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                    value
                        ? `${colorClass.bg} border-transparent text-white`
                        : `${colorClass.bgInactive} border-(--palette-limelight)/20`
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="text-sm font-medium">
                    {selectedOption ? selectedOption.name : label}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
                {value && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(null);
                        }}
                        className="ml-1 rounded p-0.5 transition-colors hover:bg-white/20"
                        aria-label="Clear filter"
                        title="Clear filter"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
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
                className="absolute top-full left-0 z-10 mt-2 w-48 rounded-xl border border-(--palette-limelight)/20 bg-white shadow-lg"
            >
                <div className="space-y-1 p-2">
                    {/* All Option */}
                    <motion.button
                        onClick={() => {
                            onChange(null);
                            setIsOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                            !value
                                ? `${colorClass.bg} font-medium text-white`
                                : 'hover:bg-(--palette-limelight)/5'
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
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                                value === option.id
                                    ? `${colorClass.bg} font-medium text-white`
                                    : 'hover:bg-(--palette-limelight)/5'
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
