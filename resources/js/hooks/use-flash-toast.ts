import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            const iconType = data.type === 'success' || data.type === 'error' || data.type === 'info' || data.type === 'warning' || data.type === 'question'
                ? data.type
                : 'info';

            const titleText = data.type === 'success'
                ? 'Berhasil'
                : data.type === 'error'
                    ? 'Gagal'
                    : 'Informasi';

            Swal.fire({
                icon: iconType,
                title: titleText,
                text: data.message,
                confirmButtonText: 'Oke',
                confirmButtonColor: 'var(--palette-green, #10b981)',
            });
        });
    }, []);
}
