import { DisclaimerModal } from '@/components/DisclaimerModal';
import { useFastingStore } from '@/store/useFastingStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useHydrationStore } from '@/store/useHydrationStore';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Droplets, Flame, Info, Settings, Timer } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GlobalDashboard() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { hasSeenDisclaimer, completeOnboarding } = useGlobalStore();

    // Fasting Summary
    const { isFasting, isFeeding, endTime } = useFastingStore();
    let fastingStatus = "Ready to Fast";
    let fastingTime = "Start";

    if (isFasting && endTime) {
        fastingStatus = "Fasting";
        fastingTime = format(new Date(endTime), 'h:mm a');
    } else if (isFeeding) {
        fastingStatus = "Eating Window";
        fastingTime = "Active";
    }

    // Hydration Summary
    const { currentIntake, dailyGoal } = useHydrationStore();
    const hydrationPercent = Math.round((currentIntake / dailyGoal) * 100);

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <DisclaimerModal visible={!hasSeenDisclaimer} onDismiss={completeOnboarding} />
            <ScrollView contentContainerStyle={{ padding: 24 }}>

                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">
                            Health OS
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400 font-medium">
                            {format(new Date(), 'EEEE, MMM d')}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        className="bg-slate-200 dark:bg-slate-800 p-3 rounded-full"
                    >
                        <Settings size={24} color={colorScheme === 'dark' ? '#fff' : '#0f172a'} />
                    </TouchableOpacity>
                </View>

                {/* Dashboard Grid */}
                <View className="gap-6">

                    {/* Fasting Card */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push('/fasting')}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl">
                                <Timer size={28} color="#3b82f6" />
                            </View>
                            {isFasting && (
                                <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                    <Text className="text-green-700 dark:text-green-400 font-bold text-xs">ACTIVE</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-1">
                            Fasting Tracker
                        </Text>
                        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {fastingStatus}
                        </Text>
                        <Text className="text-slate-600 dark:text-slate-300">
                            {isFasting ? `Ends at ${fastingTime}` : "Tap to update"}
                        </Text>
                    </TouchableOpacity>

                    {/* Hydration Card */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push('/hydration')}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-2xl">
                                <Droplets size={28} color="#06b6d4" />
                            </View>
                            <Text className="text-3xl font-black text-cyan-500">
                                {hydrationPercent}%
                            </Text>
                        </View>
                        <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-1">
                            Hydration
                        </Text>
                        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {currentIntake} <Text className="text-sm font-normal text-slate-500">/ {dailyGoal} fl oz</Text>
                        </Text>

                        {/* Mini Progress Bar */}
                        <View className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                            <View
                                className="h-full bg-cyan-500 rounded-full"
                                style={{ width: `${Math.min(hydrationPercent, 100)}%` }}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Quick Actions / Future Apps */}
                    <View className="flex-row gap-4">
                        <View className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-6 items-center justify-center border border-dashed border-slate-300 dark:border-slate-700">
                            <Flame size={24} color="#94a3b8" />
                            <Text className="text-slate-500 font-medium mt-2">Calories</Text>
                            <Text className="text-slate-400 text-xs text-center mt-1">Coming Soon</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/help')}
                            className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800"
                        >
                            <Info size={24} color="#64748b" />
                            <Text className="text-slate-800 dark:text-slate-200 font-bold mt-2">About / Help</Text>
                            <Text className="text-slate-400 text-xs text-center mt-1">Info & Guides</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
