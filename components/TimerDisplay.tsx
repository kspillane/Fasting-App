import React from 'react';
import { Text, View } from 'react-native';

interface TimerDisplayProps {
    seconds: number;
    label: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, label }) => {
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };

    return (
        <View className="items-center">
            <Text className="text-gray-500 dark:text-gray-400 font-medium text-lg uppercase tracking-widest mb-2">
                {label}
            </Text>
            <Text className="text-6xl font-bold text-slate-900 dark:text-white tabular-nums">
                {formatTime(seconds)}
            </Text>
        </View>
    );
};
