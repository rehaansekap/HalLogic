import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, School, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth.user?.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: userRole === 'admin' ? admin.dashboard.url() : dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (userRole === 'admin') {
        mainNavItems.push(
            {
                title: 'Kelas',
                href: admin.classrooms.index.url(),
                icon: School,
            },
            {
                title: 'Pengguna',
                href: admin.users.index.url(),
                icon: Users,
            },
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={userRole === 'admin' ? admin.dashboard.url() : dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
