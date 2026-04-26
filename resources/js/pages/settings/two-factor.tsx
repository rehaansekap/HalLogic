import { Head } from '@inertiajs/react';
import type { PageProps } from '@/types';

interface Props extends PageProps {
    twoFactorEnabled: boolean;
    requiresConfirmation: boolean;
}

export default function TwoFactorAuthentication({ twoFactorEnabled, requiresConfirmation }: Props) {
    return (
        <>
            <Head title="Two-Factor Authentication" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>

                        <div className="text-gray-700 dark:text-gray-300">
                            <p className="mb-4">
                                Status: <span className={twoFactorEnabled ? 'text-green-600' : 'text-red-600'}>
                                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </p>

                            {requiresConfirmation && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Password confirmation required for changes.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
