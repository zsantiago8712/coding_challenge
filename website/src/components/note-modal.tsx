'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteForm } from '@/components/note-form';
import type { Note } from '@/lib/graphql/graphql';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (noteData: Omit<Note, 'id' | 'dateCreated'>) => void;
}

export function NoteModal({ isOpen, onClose, onSubmit }: NoteModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="modal-backdrop fixed inset-0 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-popover border border-border rounded-lg shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="sticky top-0 bg-popover border-b border-border px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-popover-foreground">
                                Create New Note
                            </h2>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </div>
                        <div className="p-6">
                            <NoteForm
                                onSubmit={(data) => {
                                    onSubmit(data);
                                    onClose();
                                }}
                                onCancel={onClose}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
