import { FastingPreset } from '@/store/useFastingStore';

export const FASTING_PRESETS: { id: FastingPreset; label: string; description: string; hours: number }[] = [
    { id: '13:11', label: '13:11', description: 'Circadian', hours: 13 },
    { id: '14:10', label: '14:10', description: 'Beginner', hours: 14 },
    { id: '16:8', label: '16:8', description: 'Leangains', hours: 16 },
    { id: '18:6', label: '18:6', description: 'Moderate', hours: 18 },
    { id: '20:4', label: '20:4', description: 'Warrior', hours: 20 },
];
