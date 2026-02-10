import { FASTING_PRESETS } from '@/constants/FastingPresets';
import { NotificationManager } from '@/utils/NotificationManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addHours, differenceInSeconds, subDays } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FastingState {
    isFasting: boolean;
    isRecurring: boolean;
    isFeeding: boolean;
    startTime: string | null; // ISO Date string
    endTime: string | null; // ISO Date string
    feedingStartTime: string | null; // ISO Date string
    selectedPreset: string;
    customDuration: number; // Hours
    notificationsEnabled: boolean;
    streak: number;

    // Actions
    startFast: () => Promise<void>;
    endFast: () => Promise<void>;
    updatePreset: (presetId: string) => void;
    updateCustomDuration: (duration: number) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    toggleRecurring: () => void;
    updateStartTime: (newStartTime: Date) => void;
    resetStreak: () => void;
}

export const useFastingStore = create<FastingState>()(
    persist(
        (set, get) => ({
            isFasting: false,
            isRecurring: false,
            isFeeding: false,
            startTime: null,
            endTime: null,
            feedingStartTime: null,
            selectedPreset: '16-8',
            customDuration: 16,
            notificationsEnabled: false,
            streak: 0,

            startFast: async () => {
                const now = new Date();
                const { selectedPreset, notificationsEnabled, customDuration } = get();

                let durationHours = 16;
                if (selectedPreset === 'Custom') {
                    durationHours = customDuration;
                } else {
                    const preset = FASTING_PRESETS.find(p => p.id === selectedPreset);
                    if (preset) durationHours = preset.hours;
                }

                const endTime = addHours(now, durationHours);

                if (notificationsEnabled) {
                    await NotificationManager.scheduleFastingEnd(endTime);
                }

                set({
                    isFasting: true,
                    isFeeding: false,
                    feedingStartTime: null,
                    startTime: now.toISOString(),
                    endTime: endTime.toISOString(),
                });
            },

            endFast: async () => {
                await NotificationManager.cancelAll();
                const { isRecurring, streak, startTime, endTime } = get();
                const now = new Date();

                let newStreak = streak;

                if (startTime && endTime) {
                    const start = new Date(startTime);
                    const end = new Date(endTime);
                    const targetSeconds = differenceInSeconds(end, start);
                    const elapsedSeconds = differenceInSeconds(now, start);

                    // User Request: Only update streak if > 90% of goal is reached
                    // Note: If fast is overtime (elapsed > target), progress is > 1.0, so logic holds.
                    console.log(`Debug Streak: Target=${targetSeconds}, Elapsed=${elapsedSeconds}, Ratio=${elapsedSeconds / targetSeconds}`);

                    if (targetSeconds > 0 && (elapsedSeconds / targetSeconds) >= 0.9) {
                        console.log("Debug Streak: Incrementing Streak!");
                        newStreak = streak + 1;
                    } else {
                        console.log("Debug Streak: Streak NOT incremented (Ratio < 0.9)");
                    }
                }

                if (isRecurring) {
                    set({
                        isFasting: false,
                        isFeeding: true,
                        feedingStartTime: now.toISOString(),
                        startTime: null,
                        endTime: null,
                        streak: newStreak
                    });
                } else {
                    set({
                        isFasting: false,
                        isFeeding: false,
                        feedingStartTime: null,
                        startTime: null,
                        endTime: null,
                        streak: newStreak
                    });
                }
            },

            updatePreset: (presetId: string) => {
                set({ selectedPreset: presetId });
                // If currently not fasting/feeding, we could update estimated targets, but that's UI logic
            },

            updateCustomDuration: (duration: number) => {
                set({ customDuration: duration });
            },

            setNotificationsEnabled: (enabled: boolean) => {
                set({ notificationsEnabled: enabled });
            },

            toggleRecurring: () => {
                set((state) => ({ isRecurring: !state.isRecurring }));
            },

            updateStartTime: (newStartTime: Date) => {
                const { selectedPreset, customDuration, notificationsEnabled, isRecurring, streak } = get();

                const now = new Date();
                let actualStartTime = newStartTime;

                // Smart Start Logic: If user picks a time in the future (e.g. 11PM when it is 2PM),
                // assume they meant Yesterday.
                if (actualStartTime > now) {
                    console.log("Debug: Start time is in future, assuming yesterday.");
                    actualStartTime = subDays(actualStartTime, 1);
                }

                let durationHours = 16;
                if (selectedPreset === 'Custom') {
                    durationHours = customDuration;
                } else {
                    const preset = FASTING_PRESETS.find(p => p.id === selectedPreset);
                    if (preset) durationHours = preset.hours;
                }

                const newEndTime = addHours(actualStartTime, durationHours);

                // Check if the new start time means the fast is ALREADY over
                if (now >= newEndTime) {
                    // Fast is done. Auto-transition.
                    // Calculate if we should increment streak (Yes, because 100% complete)
                    const newStreak = streak + 1;

                    if (notificationsEnabled) {
                        NotificationManager.cancelAll();
                    }

                    if (isRecurring) {
                        // Switched to feeding mode calculated from when the fast SHOULD have ended?
                        // Or just start feeding window NOW?
                        // "Auto-transition to Feeding Window" -> implied "Now" or "At End Time"?
                        // Usually "At End Time" preserves the schedule.
                        set({
                            isFasting: false,
                            isFeeding: true,
                            feedingStartTime: newEndTime.toISOString(), // Start feeding when fast ended
                            startTime: null,
                            endTime: null,
                            streak: newStreak
                        });
                    } else {
                        set({
                            isFasting: false,
                            isFeeding: false,
                            feedingStartTime: null,
                            startTime: null,
                            endTime: null,
                            streak: newStreak
                        });
                    }
                    return;
                }

                if (notificationsEnabled) {
                    NotificationManager.cancelAll().then(() => {
                        NotificationManager.scheduleFastingEnd(newEndTime);
                    });
                }

                set({
                    startTime: actualStartTime.toISOString(),
                    endTime: newEndTime.toISOString(),
                });
            },

            resetStreak: () => {
                set({ streak: 0 });
            }
        }),
        {
            name: 'fasting-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
