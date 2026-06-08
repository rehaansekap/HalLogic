import { usePoll, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
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
                text: flash?.info || 'Akun Kamu telah diperbarui oleh Admin. Silakan login kembali.',
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
            MySwal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.success,
                confirmButtonText: 'Oke',
                confirmButtonColor: 'var(--palette-green, #10b981)',
            });
        }

        if (flash?.error) {
            MySwal.fire({
                icon: 'error',
                title: 'Gagal',
                text: flash.error,
                confirmButtonText: 'Oke',
                confirmButtonColor: '#dc2626',
            });
        }
    }, [flash]);

    return null;
}
