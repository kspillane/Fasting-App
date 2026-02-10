import { useGlobalStore } from '@/store/useGlobalStore';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GlobalSettings() {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { units, toggleUnits, masterNotifications, toggleMasterNotifications } = useGlobalStore();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <View className="p-6">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                    Global Settings
                </Text>

                <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 gap-6">

                    {/* Dark Mode */}
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-lg font-semibold text-slate-800 dark:text-white">Dark Mode</Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-sm">Adjust app appearance</Text>
                        </View>
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleColorScheme}
                            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Master Notifications */}
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-lg font-semibold text-slate-800 dark:text-white">Allow Notifications</Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-sm">Master switch for all alerts</Text>
                        </View>
                        <Switch
                            value={masterNotifications}
                            onValueChange={toggleMasterNotifications}
                            trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Units */}
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-lg font-semibold text-slate-800 dark:text-white">Units</Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-sm">Imperial (oz) vs Metric (ml)</Text>
                        </View>
                        <TouchableOpacity
                            onPress={toggleUnits}
                            className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg"
                        >
                            <Text className="font-bold text-slate-700 dark:text-slate-300 uppercase">
                                {units}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {/* More settings can go here */}
                <Text className="text-slate-400 dark:text-slate-600 text-sm mt-8 text-center">
                    Health OS v1.1.0
                </Text>
            </View>
        </SafeAreaView>
    );
}
