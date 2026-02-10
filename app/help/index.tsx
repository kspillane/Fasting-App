import { useRouter } from 'expo-router';
import { BookOpen, ExternalLink, Info, User } from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpMenu() {
    const router = useRouter();

    const openDeveloper = () => {
        Linking.openURL('https://www.linkedin.com/in/kspillane/');
    };

    const MenuItem = ({ title, icon, onPress, subtitle }: { title: string, icon: React.ReactNode, onPress: () => void, subtitle: string }) => (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-200 dark:border-slate-700 flex-row items-center shadow-sm"
        >
            <View className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center mr-4">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-lg font-bold text-slate-800 dark:text-white">{title}</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['bottom', 'left', 'right']}>
            <ScrollView className="flex-1 p-6">

                <MenuItem
                    title="About this App"
                    subtitle="Privacy & Mission"
                    icon={<Info size={24} color="#64748b" />}
                    onPress={() => router.push('/help/app-info')}
                />

                <MenuItem
                    title="About the Developer"
                    subtitle="Connect on LinkedIn"
                    icon={<User size={24} color="#64748b" />}
                    onPress={openDeveloper}
                />

                <MenuItem
                    title="How to use"
                    subtitle="Guides & Features"
                    icon={<BookOpen size={24} color="#64748b" />}
                    onPress={() => router.push('/help/guide')}
                />

                <MenuItem
                    title="More Info"
                    subtitle="Health Resources"
                    icon={<ExternalLink size={24} color="#64748b" />}
                    onPress={() => router.push('/help/resources')}
                />

            </ScrollView>
        </SafeAreaView>
    );
}
