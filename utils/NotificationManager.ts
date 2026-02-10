// NotificationManager.ts
// Stubbed for Expo Go compatibility (SDK 53 removed Notifications support in Go client)
// In a real build, you would import * as Notifications from 'expo-notifications';

// Mock types/interfaces to satisfy TypeScript
export enum NotificationBehavior {
    Show = 'show',
    Ignore = 'ignore'
}

export interface NotificationTriggerInput {
    hour: number;
    minute: number;
    repeats: boolean;
}

export const configureNotifications = async () => {
    console.log("Notifications: Configuration skipped (Expo Go stub)");
    return true;
};

export const NotificationManager = {
    requestPermissions: async () => {
        console.log("Notifications: Permission request stubbed");
        return true;
    },

    scheduleNotification: async (
        title: string,
        body: string,
        trigger: NotificationTriggerInput,
        behavior: NotificationBehavior = NotificationBehavior.Show
    ) => {
        console.log(`Notifications: Scheduled '${title}' (Stubbed)`);
        return "stub_id";
    },

    scheduleFastingEnd: async (date: Date) => {
        console.log(`Notifications: Scheduled fasting end for ${date.toISOString()} (Stubbed)`);
        return "stub_id";
    },

    cancelAll: async () => {
        console.log("Notifications: Cancel All Stubbed");
    }
};
