import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

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
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredOptions = useMemo(() => {
        if (!searchQuery) {
            return options;
        }

        return options.filter((opt) =>
            opt.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [options, searchQuery]);

    const showSearch = options.length > 5;

    return (
        <div className={cn('relative', className)}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center justify-between gap-2 rounded-xl border px-4 py-2 transition-all w-full',
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
                {showSearch && (
                    <div className="border-b border-(--palette-limelight)/10 p-3">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl bg-(--palette-limelight)/10 py-2 pr-4 pl-9 text-xs focus:ring-1 focus:ring-(--palette-green) focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}
                <div className="max-h-64 space-y-1 overflow-y-auto p-2">
                    {/* All Option - only show if no search query */}
                    {!searchQuery && (
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
                    )}

                    <AnimatePresence mode="popLayout">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <motion.button
                                    key={option.id}
                                    layout
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-all mb-1 last:mb-0 ${
                                        value === option.id
                                            ? `${colorClass.bg} font-bold text-white shadow-lg`
                                            : 'hover:bg-(--palette-limelight)/10 text-muted-foreground'
                                    }`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: index * 0.02 }}
                                    whileHover={{ x: 4 }}
                                >
                                    {option.name}
                                </motion.button>
                            ))
                        ) : (
                            <div className="py-4 text-center text-xs text-muted-foreground">
                                No results found
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
