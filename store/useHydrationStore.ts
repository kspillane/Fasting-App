import { NotificationManager } from '@/utils/NotificationManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startOfDay, subDays } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useGlobalStore } from './useGlobalStore';

interface HydrationRecord {
    date: string; // ISO date string for the day
    amount: number; // Total oz drunk
    goalMet: boolean;
}

interface HydrationState {
    currentIntake: number; // fl oz
    dailyGoal: number; // fl oz (Default 100 or user set)
    quickAddAmount: number; // fl oz (Default 16.9)
    streak: number;
    history: HydrationRecord[];

    // Notification Window (0-24 hours) - Default 8AM to 8PM
    notificationStartHour: number;
    notificationEndHour: number;
    notificationsEnabled: boolean;

    lastResetDate: string | null; // To track midnight resets

    // Actions
    addWater: (amount: number) => void;
    removeWater: (amount: number) => void;
    setDailyGoal: (amount: number) => void;
    setQuickAddAmount: (amount: number) => void;
    setNotificationWindow: (start: number, end: number) => void;
    toggleNotifications: () => void;
    checkDailyReset: () => void;
    resetStreak: () => void; // Developer tool or manual reset
}

export const useHydrationStore = create<HydrationState>()(
    persist(
        (set, get) => ({
            currentIntake: 0,
            dailyGoal: 100, // Reasonable default
            quickAddAmount: 16.9,
            streak: 0,
            history: [],
            notificationStartHour: 8,
            notificationEndHour: 20,
            notificationsEnabled: false,
            lastResetDate: null,



            addWater: (amount) => {
                set((state) => {
                    const newIntake = Math.max(0, state.currentIntake + amount);

                    // Logic for Reminders
                    const { masterNotifications } = useGlobalStore.getState();
                    const { notificationsEnabled, dailyGoal, notificationStartHour, notificationEndHour } = state;

                    if (masterNotifications && notificationsEnabled && newIntake < dailyGoal) {
                        const now = new Date();
                        const currentHour = now.getHours();

                        if (currentHour >= notificationStartHour && currentHour < notificationEndHour) {
                            // Schedule 90 min reminder
                            NotificationManager.scheduleNotification(
                                "Hydration Check 💧",
                                "It's been 90 minutes! Time for a sip.",
                                90 * 60
                            );
                        }
                    }

                    return { currentIntake: newIntake };
                });
            },

            removeWater: (amount) => {
                set((state) => ({ currentIntake: Math.max(0, state.currentIntake - amount) }));
            },

            setDailyGoal: (amount) => set({ dailyGoal: amount }),

            setQuickAddAmount: (amount) => set({ quickAddAmount: amount }),

            setNotificationWindow: (start, end) => set({
                notificationStartHour: start,
                notificationEndHour: end
            }),

            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

            resetStreak: () => set({ streak: 0 }),

            checkDailyReset: () => {
                const { lastResetDate, currentIntake, dailyGoal, streak, history } = get();
                const now = new Date();
                const todayStr = startOfDay(now).toISOString();

                if (lastResetDate !== todayStr) {
                    // It's a new day!

                    // 1. Archive Yesterday (if valid)
                    let newStreak = streak;

                    if (lastResetDate) {
                        // Check if we met the goal yesterday
                        // Logic: "streak counter showing how many days in a row they have hit 90% of the hydration goal"
                        const metGoal = currentIntake >= (dailyGoal * 0.9);

                        // Add to history
                        const newRecord: HydrationRecord = {
                            date: lastResetDate,
                            amount: currentIntake,
                            goalMet: metGoal
                        };

                        const newHistory = [...history, newRecord].slice(-30); // Keep last 30 days maybe?

                        // Update Streak
                        // If yesterday was missed, streak resets? Or just doesn't increment?
                        // "streak counter showing how many days in a row" implies reset on miss.
                        // We need to check if we missed YESTERDAY specifically.
                        // If lastResetDate was older than yesterday, we definitely missed yesterday.

                        const yesterday = startOfDay(subDays(now, 1)).toISOString();

                        if (lastResetDate === yesterday) {
                            if (metGoal) {
                                newStreak += 1;
                            } else {
                                newStreak = 0;
                            }
                        } else {
                            // Last reset was older than yesterday (e.g. user skipped a day opening app)
                            // Streak resets
                            newStreak = 0;
                        }

                        set({
                            currentIntake: 0,
                            lastResetDate: todayStr,
                            streak: newStreak,
                            history: newHistory
                        });

                    } else {
                        // First time run or legacy
                        set({
                            currentIntake: 0,
                            lastResetDate: todayStr,
                        });
                    }
                }
            }
        }),
        {
            name: 'hydration-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
