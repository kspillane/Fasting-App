import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function AppInfoScreen() {
    return (
        <ScrollView className="flex-1 bg-white dark:bg-slate-900 p-6">
            <View className="items-center mb-8 mt-4">
                <View className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
                    <ShieldCheck size={40} className="text-blue-500 dark:text-blue-400" color="#3b82f6" />
                </View>
                <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center">Health OS</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-center">Version 1.1.0</Text>
            </View>

            <View className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <Text className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Our Mission</Text>
                <Text className="text-slate-600 dark:text-slate-300 leading-6 text-base">
                    Health OS is designed to be a simple, free, privacy-focused, local-first application for tracking health metrics to improve users&apos; well-being.
                </Text>
                <View className="h-4" />
                <Text className="text-slate-600 dark:text-slate-300 leading-6 text-base">
                    We believe your health data belongs to you. That&apos;s why all your data is stored locally on your device and never shared with cloud servers.
                </Text>
            </View>
        </ScrollView>
    );
}
