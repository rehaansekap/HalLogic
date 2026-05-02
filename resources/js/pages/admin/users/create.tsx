import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Save,
    Upload,
    UserPlus,
    X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import Swal from 'sweetalert2';

import PageHeader from '@/components/custom/layout/PageHeader';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as usersIndex, store } from '@/routes/admin/users';

const ROLE_OPTIONS = [
    { value: 'student', label: 'Siswa' },
    { value: 'teacher', label: 'Guru' },
    { value: 'admin', label: 'Admin' },
];

export default function AdminUsersCreate() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: '' }));
        },
        [],
    );

    const handleAvatarChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];

            if (file) {
                setAvatar(file);
                setAvatarPreview(URL.createObjectURL(file));
                setErrors((prev) => ({ ...prev, avatar: '' }));
            }
        },
        [],
    );

    const handleRemoveAvatar = useCallback(() => {
        setAvatar(null);
        setAvatarPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);

            const data = new FormData();
            data.append('name', formData.name);
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append(
                'password_confirmation',
                formData.password_confirmation,
            );
            data.append('role', formData.role);

            if (avatar) {
                data.append('avatar', avatar);
            }

            router.post(store.url(), data as any, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'User Berhasil Ditambahkan!',
                        text: `${formData.name} telah ditambahkan ke sistem.`,
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'rounded-2xl border-none shadow-2xl',
                        },
                    });
                },
                onError: (errs) => {
                    setErrors(errs);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: 'Periksa kembali form Anda.',
                        confirmButtonColor: '#ef4444',
                        customClass: {
                            popup: 'rounded-2xl border-none shadow-2xl',
                        },
                    });
                },
                onFinish: () => setIsSubmitting(false),
            });
        },
        [formData, avatar],
    );

    const inputClass = (field: string) =>
        `w-full rounded-xl border ${errors[field] ? 'border-red-400' : 'border-(--palette-limelight)/30'} bg-white px-4 py-2.5 text-sm transition-all focus:border-(--palette-green) focus:outline-none focus:ring-2 focus:ring-(--palette-green)/20`;

    return (
        <>
            <Head title="Tambah User - Admin" />

            <motion.div
                className="space-y-6 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <PageHeader
                    title="Tambah User Baru"
                    subtitle="Tambahkan user baru ke sistem"
                    icon={<UserPlus className="h-6 w-6" />}
                    role="admin"
                />

                <div className="mx-auto max-w-2xl">
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-2xl border border-(--palette-limelight)/20 bg-white p-6 shadow-sm md:p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Avatar Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                Avatar (Opsional)
                            </label>
                            <div className="flex items-center gap-4">
                                {avatarPreview ? (
                                    <div className="relative">
                                        <img
                                            src={avatarPreview}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-full border-2 border-(--palette-limelight)/30 object-cover"
                                        />
                                        <button
                                            type="button"
                                            title="Hapus Avatar"
                                            aria-label="Hapus Avatar"
                                            onClick={handleRemoveAvatar}
                                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-110"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-(--palette-limelight)/30 bg-(--palette-limelight)/5">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Pilih Gambar
                                    </Button>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Max 2MB (JPG, PNG)
                                    </p>
                                </div>
                                <input
                                    id="avatar_upload"
                                    name="avatar_upload"
                                    title="Upload Avatar"
                                    aria-label="Upload Avatar"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            {errors.avatar && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.avatar}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass('name')}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className={inputClass('username')}
                                placeholder="Masukkan username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass('email')}
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Role
                            </label>
                            <Select
                                value={formData.role}
                                onValueChange={(val) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        role: val,
                                    }));
                                    setErrors((prev) => ({
                                        ...prev,
                                        role: '',
                                    }));
                                }}
                            >
                                <SelectTrigger
                                    id="role"
                                    className={inputClass('role')}
                                >
                                    <SelectValue placeholder="Pilih role..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-(--palette-limelight)/20 shadow-xl">
                                    {ROLE_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                            className="rounded-lg transition-colors focus:bg-(--palette-green)/10 focus:text-(--palette-green)"
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClass('password')}
                                    placeholder="Minimal 8 karakter"
                                />
                                <button
                                    type="button"
                                    title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-1 block text-sm font-semibold text-foreground"
                            >
                                Konfirmasi Password
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className={inputClass('password_confirmation')}
                                placeholder="Ulangi password"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-(--palette-limelight)/20 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.visit(usersIndex.url())
                                }
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-(--palette-green) font-bold text-white shadow-sm shadow-(--palette-green)/20 transition-all hover:bg-(--palette-green)/90 hover:scale-105 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            className="mr-2 h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.8,
                                                ease: 'linear',
                                            }}
                                        />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan User
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </>
    );
}
