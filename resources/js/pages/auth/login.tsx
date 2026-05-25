import type { Variants } from 'framer-motion';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Code2, GraduationCap, Lock, LogIn, Sparkles, User } from 'lucide-react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const MySwal = withReactContent(Swal);

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const features = [
    {
        icon: BookOpen,
        title: 'Materi Interaktif',
        description: 'Pelajari konsep pemrograman lewat studi kasus nyata yang menantang.',
    },
    {
        icon: Brain,
        title: 'Refleksi Mendalam',
        description: 'Kembangkan pemahaman dengan pertanyaan refleksi di setiap fase belajar.',
    },
    {
        icon: Code2,
        title: 'Latihan Langsung',
        description: 'Praktikkan kode dan simulasi untuk menguasai logika pemrograman.',
    },
    {
        icon: GraduationCap,
        title: 'Pantau Kemajuan',
        description: 'Guru dapat memantau progres dan memberikan umpan balik real-time.',
    },
];

const floatingVariants: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-8, 8, -8],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
    },
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.info) {
            MySwal.fire({
                title: 'Informasi Akun',
                text: flash.info,
                icon: 'info',
                confirmButtonText: 'Oke',
                confirmButtonColor: 'var(--palette-limelight)',
            });
        }
    }, [flash?.info]);

    return (
        <>
            <Head title="Masuk ke HalLogic" />

            <div className="flex min-h-screen">
                {/* ── LEFT PANEL: HERO ─────────────────────────────────────── */}
                <motion.div
                    className="relative hidden flex-col justify-between overflow-hidden bg-muted p-12 lg:flex lg:w-[55%]"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Blob 1 */}
                        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[var(--palette-limelight)]/20 blur-3xl" />
                        {/* Blob 2 */}
                        <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-[var(--palette-chartreuse)]/15 blur-3xl" />
                        {/* Blob 3 */}
                        <div className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-[var(--palette-limelight)]/10 blur-2xl" />

                        {/* Grid pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '32px 32px',
                            }}
                        />
                    </div>

                    {/* Top branding */}
                    <div className="relative z-10">
                        <Link
                            href={home()}
                            className="flex items-center gap-3 transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--palette-green)]/10">
                                <img src="/logo.svg" alt="HalLogic" className="size-7" />
                            </div>
                            <span className="text-xl font-bold text-foreground">HalLogic</span>
                        </Link>
                    </div>

                    {/* Center content */}
                    <div className="relative z-10 my-auto">
                        <motion.div
                            variants={floatingVariants}
                            initial="initial"
                            animate="animate"
                            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--palette-green)]/20 bg-[var(--palette-green)]/5 px-4 py-2 text-sm font-medium text-foreground"
                        >
                            <Sparkles className="size-4 text-[var(--palette-green)]" />
                            Platform Belajar Logika Pemrograman
                        </motion.div>

                        <motion.h1
                            className="mb-4 text-4xl font-bold leading-tight text-foreground xl:text-5xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Belajar Lebih
                            <br />
                            <span className="text-[var(--palette-green)]">Cerdas & Menyenangkan</span>
                        </motion.h1>

                        <motion.p
                            className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Kuasai konsep logika pemrograman melalui pendekatan berbasis masalah yang
                            terstruktur dan reflektif.
                        </motion.p>

                        {/* Feature list */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                >
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--palette-green)]/10">
                                        <feature.icon className="size-4 text-[var(--palette-green)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {feature.title}
                                        </p>
                                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom quote */}
                    <motion.div
                        className="relative z-10 border-t border-border pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                    >
                        <p className="text-sm italic text-muted-foreground">
                            "Pendidikan bukan persiapan untuk kehidupan; pendidikan adalah kehidupan itu
                            sendiri."
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">— John Dewey</p>
                    </motion.div>
                </motion.div>

                {/* ── RIGHT PANEL: LOGIN FORM ───────────────────────────────── */}
                <motion.div
                    className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="w-full max-w-md">
                        {/* Mobile logo (shown on small screens only) */}
                        <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--palette-green)]">
                                <img src="/logo.svg" alt="HalLogic" className="size-7" />
                            </div>
                            <span className="text-xl font-bold text-[var(--palette-green)]">HalLogic</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--palette-green)]/10">
                                <LogIn className="size-6 text-[var(--palette-green)]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Masuk dengan username atau email dan password Anda
                            </p>
                        </div>

                        {/* Status message */}
                        {status && (
                            <motion.div
                                className="mb-6 rounded-xl border border-[var(--palette-green)]/20 bg-[var(--palette-green)]/8 px-4 py-3 text-sm font-medium text-[var(--palette-green)]"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {status}
                            </motion.div>
                        )}

                        {/* Form */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Username / Email field */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15, duration: 0.4 }}
                                    >
                                        <Label
                                            htmlFor="email"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            Username atau Email
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="text"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                placeholder="username atau email@sekolah.id"
                                                className="h-11 pl-10 focus-visible:ring-[var(--palette-green)]/30 focus-visible:ring-offset-0 focus-visible:border-[var(--palette-green)]"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </motion.div>

                                    {/* Password field */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <Label
                                                htmlFor="password"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Password
                                            </Label>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-gray-400" />
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Masukkan password Anda"
                                                className="h-11 pl-10 focus-visible:ring-[var(--palette-green)]/30 focus-visible:ring-offset-0 focus-visible:border-[var(--palette-green)]"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </motion.div>

                                    {/* Remember me */}
                                    <motion.div
                                        className="flex items-center gap-2.5"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25, duration: 0.4 }}
                                    >
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-gray-300 data-[state=checked]:bg-[var(--palette-green)] data-[state=checked]:border-[var(--palette-green)]"
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="cursor-pointer text-sm text-gray-600"
                                        >
                                            Ingat saya selama 30 hari
                                        </Label>
                                    </motion.div>

                                    {/* Submit button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Button
                                            type="submit"
                                            id="login-submit-button"
                                            className="h-11 w-full rounded-xl bg-[var(--palette-green)] font-semibold text-white shadow-md shadow-[var(--palette-green)]/25 transition-all duration-200 hover:bg-[var(--palette-green)]/90 hover:shadow-lg hover:shadow-[var(--palette-green)]/30"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-2" />
                                                    Sedang masuk...
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn className="mr-2 size-4" />
                                                    Masuk ke HalLogic
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </Form>

                        {/* Footer note */}
                        <motion.p
                            className="mt-8 text-center text-xs text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Dengan masuk, Anda menyetujui ketentuan penggunaan platform HalLogic.
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

