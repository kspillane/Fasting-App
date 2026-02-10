import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UnitSystem = 'imperial' | 'metric';

interface GlobalState {
    hasSeenDisclaimer: boolean;
    masterNotifications: boolean;
    units: UnitSystem;

    toggleMasterNotifications: () => void;
    toggleUnits: () => void;
    completeOnboarding: () => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            masterNotifications: true,
            units: 'imperial',
            hasSeenDisclaimer: false,

            toggleMasterNotifications: () => set((state) => ({ masterNotifications: !state.masterNotifications })),
            toggleUnits: () => set((state) => ({ units: state.units === 'imperial' ? 'metric' : 'imperial' })),
            completeOnboarding: () => set({ hasSeenDisclaimer: true }),
        }),
        {
            name: 'global-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
