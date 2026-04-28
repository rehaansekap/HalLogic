import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.4,
            ease: 'easeOut',
        },
    }),
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <motion.div
                            className="grid gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.05 },
                                },
                            }}
                        >
                            <motion.div
                                className="grid gap-2"
                                custom={0}
                                variants={itemVariants}
                            >
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="border-(--palette-yellow-green)/30 transition-all duration-200 focus:border-(--palette-green) focus:ring-(--palette-limelight)/20"
                                />
                                <InputError message={errors.email} />
                            </motion.div>

                            <motion.div
                                className="grid gap-2"
                                custom={1}
                                variants={itemVariants}
                            >
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-(--palette-green) transition-colors hover:text-(--palette-chartreuse)"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="border-(--palette-yellow-green)/30 transition-all duration-200 focus:border-(--palette-green) focus:ring-(--palette-limelight)/20"
                                />
                                <InputError message={errors.password} />
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-3"
                                custom={2}
                                variants={itemVariants}
                            >
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </motion.div>

                            <motion.div
                                custom={3}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    className="mt-4 w-full bg-linear-to-r from-(--palette-green) to-(--palette-chartreuse) text-(--palette-white) transition-all duration-200 hover:shadow-(--palette-limelight)/20 hover:shadow-lg"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                </Button>
                            </motion.div>
                        </motion.div>

                        {canRegister && (
                            <motion.div
                                className="text-center text-sm text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                Don't have an account?{' '}
                                <TextLink
                                    href={register()}
                                    className="font-semibold text-(--palette-green) transition-colors hover:text-(--palette-chartreuse)"
                                    tabIndex={5}
                                >
                                    Sign up
                                </TextLink>
                            </motion.div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <motion.div
                    className="mt-6 rounded-lg border border-(--palette-green)/20 bg-(--palette-green)/10 p-3 text-center text-sm font-medium text-(--palette-green)"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {status}
                </motion.div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
