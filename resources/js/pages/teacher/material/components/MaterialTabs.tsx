import { motion } from 'framer-motion';
import { ClipboardList, MonitorCog, Users } from 'lucide-react';

interface MaterialTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    {
        id: 'attendance',
        label: 'Kehadiran',
        icon: <ClipboardList className="h-4 w-4" />,
    },
    {
        id: 'groups',
        label: 'Kelompok',
        icon: <Users className="h-4 w-4" />,
    },
    {
        id: 'monitoring',
        label: 'Monitoring',
        icon: <MonitorCog className="h-4 w-4" />,
    },
];

export default function MaterialTabs({
    activeTab,
    onTabChange,
}: MaterialTabsProps) {
    return (
        <motion.div
            className="flex gap-1 rounded-xl border border-(--palette-limelight)/20 bg-(--palette-limelight)/5 p-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                            isActive
                                ? 'bg-white text-(--palette-green) shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                        }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-lg border-2 border-(--palette-green)/30"
                                layoutId="activeTab"
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </motion.div>
    );
}
