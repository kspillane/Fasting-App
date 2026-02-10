import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function GuideScreen() {
    return (
        <ScrollView className="flex-1 bg-white dark:bg-slate-900 p-6">

            {/* Fasting Section */}
            <View className="mb-10">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Fasting Tracker</Text>

                <View className="mb-6">
                    <Text className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Starting a Fast</Text>
                    <Text className="text-slate-600 dark:text-slate-300 leading-6">
                        Tap &quot;Start Fasting&quot; on the dashboard to begin. You can edit the start time by tapping the pencil icon or the time display itself if you forgot to start it earlier.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Presets & Custom</Text>
                    <Text className="text-slate-600 dark:text-slate-300 leading-6">
                        Go to the Settings tab to choose from popular protocols like 16:8 or 20:4, or set a completely custom duration that fits your lifestyle.
                    </Text>
                </View>

                <View>
                    <Text className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Recurring Fasts</Text>
                    <Text className="text-slate-600 dark:text-slate-300 leading-6">
                        Enable &quot;Recurring Fast&quot; in settings to automatically transition between Fasting and Eating windows, helping you stay on a consistent schedule.
                    </Text>
                </View>
            </View>

            {/* Hydration Section */}
            <View className="mb-10">
                <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Hydration Tracker</Text>

                <View className="mb-6">
                    <Text className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Logging Water</Text>
                    <Text className="text-slate-600 dark:text-slate-300 leading-6">
                        Use the Quick Add button for your standard bottle size, or the +/- 8oz buttons for smaller adjustments. Watch the bottle fill up as you reach your goal!
                    </Text>
                </View>

                <View>
                    <Text className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-2">Goals & Units</Text>
                    <Text className="text-slate-600 dark:text-slate-300 leading-6">
                        Customize your daily intake goal and switch between Ounces (imperial) and Milliliters (metric) in the Global Settings.
                    </Text>
                </View>
            </View>

        </ScrollView>
    );
}
