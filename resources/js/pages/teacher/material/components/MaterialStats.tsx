import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    Loader2,
    Users,
} from 'lucide-react';

import StatCard from '@/components/custom/cards/StatCard';

interface MaterialStatsProps {
    stats: {
        totalGroups: number;
        completedGroups: number;
        inProgressGroups: number;
        notStartedGroups: number;
    };
}

export default function MaterialStats({ stats }: MaterialStatsProps) {
    return (
        <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
        >
            <StatCard
                title="Total Kelompok"
                value={stats.totalGroups}
                icon={<Users className="h-6 w-6" />}
                color="primary"
                delay={0.25}
            />
            <StatCard
                title="Selesai"
                value={stats.completedGroups}
                icon={<CheckCircle2 className="h-6 w-6" />}
                color="success"
                delay={0.3}
            />
            <StatCard
                title="Dalam Pengerjaan"
                value={stats.inProgressGroups}
                icon={<Loader2 className="h-6 w-6" />}
                color="warning"
                delay={0.35}
            />
            <StatCard
                title="Belum Mulai"
                value={stats.notStartedGroups}
                icon={<Clock className="h-6 w-6" />}
                color="locked"
                delay={0.4}
            />
        </motion.div>
    );
}
