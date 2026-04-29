import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <motion.div
            className="flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Previous Button */}
            {currentPage > 1 && (
                <motion.button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 transition-all hover:bg-[--palette-limelight]/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden text-sm sm:inline">Prev</span>
                </motion.button>
            )}

            {/* Page Numbers */}
            {startPage > 1 && (
                <>
                    <motion.button
                        onClick={() => onPageChange(1)}
                        className="rounded-lg px-3 py-2 text-sm transition-all hover:bg-[--palette-limelight]/10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        1
                    </motion.button>
                    {startPage > 2 && (
                        <span className="px-2 py-2 text-sm text-muted-foreground">
                            ...
                        </span>
                    )}
                </>
            )}

            {pages.map((page) => (
                <motion.button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`rounded-lg px-3 py-2 text-sm transition-all ${
                        page === currentPage
                            ? 'bg-(--palette-green) font-semibold text-white'
                            : 'hover:bg-[--palette-limelight]/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {page}
                </motion.button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-2 py-2 text-sm text-muted-foreground">
                            ...
                        </span>
                    )}
                    <motion.button
                        onClick={() => onPageChange(totalPages)}
                        className="rounded-lg px-3 py-2 text-sm transition-all hover:bg-[--palette-limelight]/10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {totalPages}
                    </motion.button>
                </>
            )}

            {/* Next Button */}
            {currentPage < totalPages && (
                <motion.button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 transition-all hover:bg-[--palette-limelight]/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Next page"
                >
                    <span className="hidden text-sm sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </motion.button>
            )}
        </motion.div>
    );
}
