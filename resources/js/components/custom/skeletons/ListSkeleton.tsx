import { motion } from 'framer-motion';

interface ListSkeletonProps {
    rows?: number;
    columns?: number;
    delay?: number;
}

export default function ListSkeleton({
    rows = 5,
    columns = 4,
    delay = 0,
}: ListSkeletonProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-(--palette-yellow-green)/10">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-(--palette-limelight)/10 bg-(--palette-limelight)/5">
                            {Array.from({ length: columns }).map((_, i) => (
                                <th
                                    key={i}
                                    scope="col"
                                    className="px-4 py-3 text-left"
                                >
                                    <span className="sr-only">
                                        Loading column {i + 1}
                                    </span>
                                    <motion.div
                                        aria-hidden="true"
                                        className="animate-pulse-soft h-4 w-24 rounded-full bg-(--palette-green)/20"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: delay + i * 0.05,
                                            duration: 0.3,
                                        }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <motion.tr
                                key={rowIdx}
                                className="border-b border-(--palette-yellow-green)/10 transition-colors hover:bg-(--palette-limelight)/5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: delay + 0.2 + rowIdx * 0.05,
                                    duration: 0.3,
                                }}
                            >
                                {Array.from({ length: columns }).map(
                                    (_, colIdx) => (
                                        <td key={colIdx} className="px-4 py-3">
                                            <motion.div
                                                aria-hidden="true"
                                                className="animate-pulse-soft h-4 w-32 rounded-full bg-(--palette-yellow-green)/20"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay:
                                                        delay +
                                                        0.2 +
                                                        rowIdx * 0.05 +
                                                        colIdx * 0.02,
                                                    duration: 0.3,
                                                }}
                                            />
                                        </td>
                                    ),
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
