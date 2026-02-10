import { Tabs } from 'expo-router';
import { Droplets, Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function HydrationLayout() {
    const { colorScheme } = useColorScheme();
    const activeColor = colorScheme === 'dark' ? '#06b6d4' : '#0891b2'; // Cyan

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#fff',
                    borderTopColor: colorScheme === 'dark' ? '#1e293b' : '#e2e8f0',
                }
            }}>

            {/* Tracker Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Tracker',
                    tabBarIcon: ({ color }) => <Droplets size={24} color={color} />,
                }}
            />

            {/* Settings Tab */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                }}
            />



        </Tabs>
    );
}
