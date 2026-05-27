import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-3 font-normal">
                <div className="flex items-center gap-3 text-left">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-(--palette-limelight)/10" />
            {/* <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-4 py-3 focus:bg-(--palette-green)/10 focus:text-(--palette-green) transition-colors mb-1">
                    <Link
                        className="flex w-full items-center gap-3"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="h-4 w-4" />
                        <span className="font-semibold">Pengaturan</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-(--palette-limelight)/10" /> */}
            <DropdownMenuItem asChild className="cursor-pointer rounded-xl px-4 py-3 text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors">
                <Link
                    className="flex w-full items-center gap-3"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="font-semibold">Keluar</span>
                </Link>
            </DropdownMenuItem>
        </>
    );
}
