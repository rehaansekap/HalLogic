import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarWithBadgeProps {
    src?: string;
    name: string;
    role?: 'student' | 'teacher' | 'admin';
    size?: 'sm' | 'md' | 'lg';
}

export default function AvatarWithBadge({
    src,
    name,
    role,
    size = 'md',
}: AvatarWithBadgeProps) {
    const sizeClasses = {
        sm: { avatar: 'h-8 w-8', badge: 'h-3 w-3 text-xs' },
        md: { avatar: 'h-10 w-10', badge: 'h-4 w-4 text-xs' },
        lg: { avatar: 'h-12 w-12', badge: 'h-5 w-5 text-xs' },
    };

    const roleColors = {
        student: {
            bg: 'bg-[var(--palette-limelight)]',
            text: 'text-[var(--palette-green)]',
            label: 'S',
        },
        teacher: {
            bg: 'bg-[var(--palette-yellow-green)]',
            text: 'text-white',
            label: 'T',
        },
        admin: {
            bg: 'bg-[var(--palette-sunflower)]',
            text: 'text-white',
            label: 'A',
        },
    };

    const roleColor = role ? roleColors[role] : null;
    const sizeClass = sizeClasses[size];
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="relative inline-block">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <Avatar className={sizeClass.avatar}>
                    <AvatarImage src={src} />
                    <AvatarFallback className="bg-(--palette-chartreuse) font-bold text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </motion.div>

            {role && roleColor && (
                <motion.div
                    className={`absolute right-0 bottom-0 ${sizeClass.badge} ${roleColor.bg} flex items-center justify-center rounded-full border-2 border-white font-bold`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                    title={role}
                >
                    <span className={roleColor.text}>{roleColor.label}</span>
                </motion.div>
            )}
        </div>
    );
}
