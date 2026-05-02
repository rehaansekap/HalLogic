import { usePoll, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function RealTimeMonitor() {
    // Poll every 5 seconds globally to check for session/flash updates
    usePoll(5000);

    const { auth, flash } = usePage().props as any;
    const lastUserRef = useRef<number | null>(auth?.user?.id || null);

    // Monitor session loss (e.g. Admin logout student)
    useEffect(() => {
        const currentUserId = auth?.user?.id || null;

        // If user was logged in and now is not
        if (lastUserRef.current && !currentUserId) {
            MySwal.fire({
                title: 'Sesi Berakhir',
                text: flash?.info || 'Akun Anda telah diperbarui oleh Admin. Silakan login kembali.',
                icon: 'info',
                confirmButtonText: 'Oke',
                confirmButtonColor: 'var(--palette-limelight)',
            }).then(() => {
                window.location.href = '/login';
            });
        }

        lastUserRef.current = currentUserId;
    }, [auth?.user?.id, flash?.info]);

    // Monitor flash messages for toasts
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        if (flash?.info && !lastUserRef.current) {
             // Info is handled by SweetAlert for logout, but can be used for others
        }
    }, [flash]);

    return null;
}
