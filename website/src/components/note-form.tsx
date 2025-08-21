'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { Note, Sentiment } from '@/lib/graphql/graphql';
import { SentimentIcon } from './sentiment-icon';
import { cn } from '@/lib/utils';
import { useForm } from '@tanstack/react-form';
import { createNoteSchema, CreateNoteData } from '@/types/note';
import { SENTIMENT_OPTIONS } from '@/lib/constants/sentiments';

interface NoteFormProps {
    onSubmit: (noteData: Omit<Note, 'id' | 'dateCreated'>) => void;
    onCancel?: () => void;
}

export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [currentText, setCurrentText] = useState('');

    const initialValues: CreateNoteData = {
        text: '',
        sentiment: Sentiment.Neutral,
    };

    const form = useForm({
        defaultValues: initialValues,
        validators: {
            onChangeAsync: createNoteSchema,
        },
        onSubmit: async (values) => {
            const noteData: Omit<Note, 'id' | 'dateCreated'> = {
                text: values.value.text,
                sentiment: values.value.sentiment,
            };

            onSubmit(noteData);
        },
    });

    useEffect(() => {
        const words = currentText
            .trim()
            .split(/\s+/)
            .filter((word: string) => word.length > 0);
        setWordCount(currentText.trim() === '' ? 0 : words.length);

        setCharCount(currentText.length);
    }, [currentText]);

    const isFormValid = (form.state.values.text?.trim().length || 0) > 0;

    return (
        <div className="animate-scale-in">
            <div className="space-y-6">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-3">
                        <form.Field name="text">
                            {(field) => (
                                <>
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor={field.name}
                                            className="text-sm font-semibold text-foreground"
                                        >
                                            Content
                                        </Label>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{wordCount} words</span>
                                            <span>{charCount} characters</span>
                                        </div>
                                    </div>
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        value={currentText}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setCurrentText(newValue);
                                            field.handleChange(newValue);
                                        }}
                                        placeholder="Express your thoughts, feelings, and ideas here..."
                                        rows={6}
                                        className="resize-none border-2 focus:border-primary/50 transition-all duration-300 bg-background/50 leading-relaxed"
                                    />
                                </>
                            )}
                        </form.Field>
                    </div>

                    <div className="space-y-3">
                        <form.Field name="sentiment">
                            {(field) => (
                                <>
                                    <Label
                                        htmlFor={field.name}
                                        className="text-sm font-semibold text-foreground"
                                    >
                                        Emotional Context
                                    </Label>
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(value) =>
                                            field.handleChange(value as Sentiment)
                                        }
                                    >
                                        <SelectTrigger className="border-2 focus:border-primary/50 transition-all duration-300 bg-background/50">
                                            <SelectValue placeholder="How are you feeling?" />
                                        </SelectTrigger>
                                        <SelectContent className="border-2">
                                            {SENTIMENT_OPTIONS.map((s) => (
                                                <SelectItem
                                                    key={s.value}
                                                    value={s.value}
                                                    className="cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3 py-1">
                                                        <div
                                                            className={cn(
                                                                'w-6 h-6 rounded-full bg-gradient-to-r flex items-center justify-center',
                                                                s.gradient
                                                            )}
                                                        >
                                                            <SentimentIcon
                                                                sentiment={s.value}
                                                                className="w-4 h-4 text-white"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {s.label}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {s.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                        </form.Field>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={!isFormValid}
                            className={cn(
                                'flex-1 h-12 text-base font-semibold transition-all duration-300 transform hover:scale-105',
                                'bg-blue-500 hover:bg-blue-600 text-white',
                                'shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                            )}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Create Note
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="h-12 px-6 border-2 hover:bg-muted/50 transition-all duration-300 transform hover:scale-105 bg-transparent"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                            </Button>
                        )}
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Tip:</strong> Choose the sentiment
                            that best reflects your current emotional state. This helps you track
                            patterns in your thoughts and feelings over time.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
