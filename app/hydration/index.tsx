import { WaterBottle } from '@/components/WaterBottle';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useHydrationStore } from '@/store/useHydrationStore';
import { useRouter } from 'expo-router';
import { ChevronLeft, Minus, Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HydrationScreen() {
    const router = useRouter();
    const { units } = useGlobalStore();
    const {
        currentIntake,
        dailyGoal,
        quickAddAmount,
        streak,
        history,
        addWater,
        removeWater,
        checkDailyReset
    } = useHydrationStore();

    useEffect(() => {
        checkDailyReset();
    }, []);

    // Display Unit Conversion (Store is always in oz)
    const toDisplay = (oz: number) => {
        if (units === 'metric') {
            return Math.round(oz * 29.5735); // Convert to ml
        }
        return Math.round(oz);
    };
    const unitLabel = units === 'metric' ? 'ml' : 'oz';

    const progress = Math.min(currentIntake / dailyGoal, 1);
    const remaining = Math.max(0, dailyGoal - currentIntake);

    // Calculate hourly pace
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const hoursLeft = (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60);
    const pace = hoursLeft > 0 ? Math.ceil(remaining / hoursLeft) : 0;

    // History stats
    // "how much they drank yesterday"
    // "average of the last week"
    // "streak counter showing how many days in a row they have hit 90% of the hydration goal" is in store.streak

    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdayRecord = history.find(h => h.date.startsWith(yesterdayStr));
    const yesterdayAmount = yesterdayRecord ? yesterdayRecord.amount : 0;

    const last7Days = history.slice(-7);
    const avgAmount = last7Days.length > 0
        ? Math.round(last7Days.reduce((acc, curr) => acc + curr.amount, 0) / last7Days.length)
        : 0;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">

            {/* Header */}
            <View className="px-6 pt-4 pb-2">
                <TouchableOpacity
                    onPress={() => router.replace('/')}
                    className="flex-row items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full self-start"
                >
                    <ChevronLeft size={20} color="#64748b" />
                    <Text className="text-slate-600 dark:text-slate-300 font-bold ml-1 text-sm">Dashboard</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 20 }}>

                {/* Title */}
                <Text className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-6 tracking-tight">
                    Hydration
                </Text>

                {/* Water Bottle Visualization */}
                <View className="mb-8">
                    <WaterBottle progress={progress} width={180} height={320} />
                    <Text className="text-center text-4xl font-black text-cyan-600 mt-4">
                        {toDisplay(currentIntake)} <Text className="text-xl text-slate-400 font-medium">/ {toDisplay(dailyGoal)} {unitLabel}</Text>
                    </Text>
                </View>

                {/* Controls */}
                <View className="flex-row items-center gap-4 mb-10 w-full px-8 justify-between">
                    {/* Subtract Standard Amount */}
                    <TouchableOpacity
                        onPress={() => removeWater(units === 'metric' ? 8.45 : 8)}
                        className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800"
                    >
                        <Minus size={24} color="#3b82f6" />
                        <Text className="absolute -bottom-6 text-xs text-blue-500 font-bold">
                            -{units === 'metric' ? '250' : '8'} {unitLabel}
                        </Text>
                    </TouchableOpacity>

                    {/* Quick Add Custom */}
                    <TouchableOpacity
                        onPress={() => addWater(quickAddAmount)}
                        className="flex-1 h-24 bg-cyan-500 rounded-3xl items-center justify-center shadow-lg shadow-cyan-500/30 active:scale-95 transition mx-2"
                    >
                        <Text className="text-white text-3xl font-bold">+{toDisplay(quickAddAmount)}</Text>
                        <Text className="text-cyan-100 text-xs font-bold uppercase tracking-wider">{unitLabel}</Text>
                    </TouchableOpacity>

                    {/* Add Standard Amount */}
                    <TouchableOpacity
                        onPress={() => addWater(units === 'metric' ? 8.45 : 8)}
                        className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center shadow-sm border border-blue-100 dark:border-blue-800"
                    >
                        <Plus size={24} color="#3b82f6" />
                        <Text className="absolute -bottom-6 text-xs text-blue-500 font-bold">
                            +{units === 'metric' ? '250' : '8'} {unitLabel}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View className="w-full px-6 gap-4 pb-10">

                    {/* Pace */}
                    <View className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex-row justify-between items-center border border-slate-100 dark:border-slate-700">
                        <View>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Required Pace</Text>
                            <Text className="text-slate-800 dark:text-white text-lg font-bold">
                                {remaining > 0 ? `${toDisplay(pace)} ${unitLabel} / hour` : "Goal Met! 🎉"}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-slate-400 text-xs">To hit goal by midnight</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-4">
                        {/* Yesterday - Fixed Wrapping */}
                        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider" numberOfLines={1}>Yesterday</Text>
                            <Text className="text-slate-800 dark:text-white text-xl font-bold mt-1">{toDisplay(yesterdayAmount)} {unitLabel}</Text>
                        </View>

                        {/* 7 Day Avg */}
                        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider" numberOfLines={1}>7 Day Avg</Text>
                            <Text className="text-slate-800 dark:text-white text-xl font-bold mt-1">{toDisplay(avgAmount)} {unitLabel}</Text>
                        </View>

                        {/* Streak - Updated Color to Blue/Slate */}
                        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Streak</Text>
                            <Text className="text-blue-500 dark:text-blue-400 text-xl font-bold mt-1">{streak} Days</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
