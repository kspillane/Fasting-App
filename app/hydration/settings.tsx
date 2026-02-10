import { useHydrationStore } from '@/store/useHydrationStore';
import React from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HydrationSettings() {
    const {
        dailyGoal,
        quickAddAmount,
        setDailyGoal,
        setQuickAddAmount,
        notificationsEnabled,
        toggleNotifications,
        notificationStartHour,
        notificationEndHour,
        setNotificationWindow
    } = useHydrationStore();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <ScrollView className="p-6">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                    Hydration Settings
                </Text>

                {/* Goals */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">Goals & Targets</Text>
                    <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 gap-4">

                        {/* Daily Goal */}
                        <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                            <View>
                                <Text className="text-base font-semibold text-slate-800 dark:text-white">Daily Goal (oz)</Text>
                                <Text className="text-slate-400 text-xs">Recommended: 100 oz</Text>
                            </View>
                            <TextInput
                                keyboardType="numeric"
                                value={dailyGoal.toString()}
                                onChangeText={(text) => setDailyGoal(Number(text) || 0)}
                                className="bg-slate-100 dark:bg-slate-800 w-24 p-2 rounded-lg text-right font-bold text-slate-900 dark:text-white"
                            />
                        </View>

                        {/* Quick Add Custom */}
                        <View className="flex-row justify-between items-center pt-2">
                            <View>
                                <Text className="text-base font-semibold text-slate-800 dark:text-white">Bottle Size (oz)</Text>
                                <Text className="text-slate-400 text-xs">Custom Quick Add Amount</Text>
                            </View>
                            <TextInput
                                keyboardType="numeric"
                                value={quickAddAmount.toString()}
                                onChangeText={(text) => setQuickAddAmount(Number(text) || 0)}
                                className="bg-slate-100 dark:bg-slate-800 w-24 p-2 rounded-lg text-right font-bold text-slate-900 dark:text-white"
                            />
                        </View>
                    </View>
                </View>

                {/* Notifications */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">Reminders</Text>
                    <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 gap-4">

                        <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                            <Text className="text-base font-semibold text-slate-800 dark:text-white">Enable Notifications</Text>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={toggleNotifications}
                                trackColor={{ false: '#e2e8f0', true: '#06b6d4' }}
                            />
                        </View>

                        {/* Window */}
                        <View className="flex-row justify-between items-center pt-2">
                            <View>
                                <Text className="text-base font-semibold text-slate-800 dark:text-white">Active Window</Text>
                                <Text className="text-slate-400 text-xs">Start & End Hour (0-24)</Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <TextInput
                                    placeholder="Start"
                                    keyboardType="numeric"
                                    value={notificationStartHour.toString()}
                                    onChangeText={(t) => setNotificationWindow(Number(t), notificationEndHour)}
                                    className="bg-slate-100 dark:bg-slate-800 w-16 p-2 rounded-lg text-center font-bold text-slate-900 dark:text-white"
                                />
                                <Text className="text-slate-400">-</Text>
                                <TextInput
                                    placeholder="End"
                                    keyboardType="numeric"
                                    value={notificationEndHour.toString()}
                                    onChangeText={(t) => setNotificationWindow(notificationStartHour, Number(t))}
                                    className="bg-slate-100 dark:bg-slate-800 w-16 p-2 rounded-lg text-center font-bold text-slate-900 dark:text-white"
                                />
                            </View>
                        </View>

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
