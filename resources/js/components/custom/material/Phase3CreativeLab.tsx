import { LightBulbIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { AlertCircle, Code2, Copy, Play, Save } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface Phase3CreativeLabProps {
    materialSlug: string;
    currentStep: number;
    currentUserRole: string;
}

export default function Phase3CreativeLab({
    materialSlug,
    currentStep,
    currentUserRole,
}: Phase3CreativeLabProps) {
    const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`);

    const [codeOutput, setCodeOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedState, setSavedState] = useState(false);
    const codeRef = useRef<HTMLTextAreaElement>(null);

    const isPhaseActive = currentStep >= 3;
    const isTechnician =
        currentUserRole === 'Technician' || currentUserRole === 'Leader';

    const handleRunCode = async () => {
        if (!isTechnician) {
            return;
        }

        setIsRunning(true);

        try {
            const response = await fetch(`/material/${materialSlug}/run-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();
            setCodeOutput(data.output || data.error || 'Tidak ada output');
        } catch (error) {
            setCodeOutput(
                `Error: ${error instanceof Error ? error.message : 'Gagal menjalankan kode'}`,
            );
        } finally {
            setIsRunning(false);
        }
    };

    const handleSaveCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append('code', code);

            const response = await fetch(
                `/material/${materialSlug}/save-phase-3`,
                {
                    method: 'POST',
                    headers: {
                        'X-CSRF-Token':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: formData,
                },
            );

            if (response.ok) {
                setSavedState(true);
                setTimeout(() => setSavedState(false), 3000);
            }
        } catch (error) {
            console.error('Error saving code:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyCode = () => {
        if (codeRef.current) {
            codeRef.current.select();
            document.execCommand('copy');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    if (!isPhaseActive) {
        return (
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gray-100 p-4">
                        <Code2 className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Fase 3: Eksperimen & Koding
                        </h2>
                        <p className="text-muted-foreground">
                            Fase ini akan dibuka setelah organisasi kelompok
                            selesai
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div
                className="rounded-xl border border-(--palette-limelight)/20 bg-white p-8"
                variants={itemVariants}
            >
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-(--palette-chartreuse)/8 p-4">
                        <Code2 className="h-6 w-6 text-(--palette-green)" />
                    </div>
                    <div className="flex-1">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            Fase 3: Eksperimen & Koding
                        </h2>
                        <p className="text-muted-foreground">
                            Tulis dan jalankan kode C++ Anda. Teknisi dapat
                            menjalankan dan menyimpan kode, yang akan dibawa ke
                            fase pengumpulan.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Permissions Check */}
            {!isTechnician && (
                <motion.div
                    className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4"
                    variants={itemVariants}
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                        <p className="font-semibold text-foreground">
                            Akses Terbatas
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Hanya Teknisi dan Ketua yang dapat menjalankan dan
                            menyimpan kode. Anda dapat melihat kode yang telah
                            disimpan.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Code Editor */}
            <motion.div
                className="overflow-hidden rounded-xl border border-(--palette-limelight)/20 bg-white"
                variants={itemVariants}
            >
                <div className="flex items-center justify-between border-b border-(--palette-limelight)/20 bg-(--palette-limelight)/10 px-6 py-3">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-(--palette-green)" />
                        <span className="font-semibold text-foreground">
                            Editor Kode C++
                        </span>
                    </div>
                    <motion.button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 rounded bg-(--palette-limelight)/20 px-2 py-1 text-xs text-foreground transition-colors hover:bg-(--palette-limelight)/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Copy className="h-3 w-3" />
                        Salin
                    </motion.button>
                </div>

                <textarea
                    ref={codeRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!isTechnician}
                    className={`w-full resize-none p-6 font-mono text-sm focus:outline-none ${
                        isTechnician
                            ? 'bg-white text-foreground'
                            : 'cursor-not-allowed bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Tulis kode C++ Anda di sini..."
                />
            </motion.div>

            {/* Control Buttons */}
            {isTechnician && (
                <motion.div className="flex gap-3" variants={itemVariants}>
                    <Button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isRunning ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Menjalankan...
                            </>
                        ) : (
                            <>
                                <Play className="h-5 w-5" />
                                Jalankan Kode
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleSaveCode}
                        disabled={isSaving}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all ${
                            savedState
                                ? 'bg-(--palette-green) text-white'
                                : 'bg-(--palette-green) text-white hover:shadow-lg disabled:opacity-50'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Menyimpan...
                            </>
                        ) : savedState ? (
                            <>
                                <AlertCircle className="h-5 w-5" />
                                Tersimpan!
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Simpan & Lanjut Fase 4
                            </>
                        )}
                    </Button>
                </motion.div>
            )}

            {/* Code Output */}
            <motion.div
                className="overflow-hidden rounded-xl border border-(--palette-limelight)/20 bg-white"
                variants={itemVariants}
            >
                <div className="flex items-center gap-2 border-b border-(--palette-limelight)/20 bg-(--palette-limelight)/10 px-6 py-3">
                    <Play className="h-4 w-4 text-(--palette-green)" />
                    <span className="font-semibold text-foreground">
                        Output Program
                    </span>
                </div>
                <pre className="overflow-auto bg-gray-900 p-6 font-mono text-sm text-green-400">
                    {codeOutput || 'Output akan ditampilkan di sini...'}
                </pre>
            </motion.div>

            {/* Tips */}
            <motion.div
                className="rounded-lg border border-(--palette-limelight)/20 bg-(--palette-limelight)/10 p-4"
                variants={itemVariants}
            >
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <LightBulbIcon className="h-4 w-4" />
                    Tips Coding
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>
                        • Gunakan fitur "Jalankan Kode" untuk menguji logika
                        Anda
                    </li>
                    <li>
                        • Kode yang disimpan akan dibawa ke fase pengumpulan
                        final
                    </li>
                    <li>• Pastikan kode dapat dikompilasi sebelum menyimpan</li>
                    <li>
                        • Kolaborasi dengan anggota lain melalui link kolaborasi
                    </li>
                </ul>
            </motion.div>
        </motion.div>
    );
}
