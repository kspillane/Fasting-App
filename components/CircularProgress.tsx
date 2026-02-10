import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
    progress: number; // 0 to 1
    size: number;
    strokeWidth: number;
    children?: React.ReactNode;
    color?: string; // Dynamic color
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    progress,
    size,
    strokeWidth,
    children,
    color = "#3b82f6" // Default blue-500
}) => {
    const { colorScheme } = useColorScheme();
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
    }, [progress, animatedProgress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference - animatedProgress.value * circumference;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View className="items-center justify-center" style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colorScheme === 'dark' ? '#334155' : '#e2e8f0'} // slate-700 : slate-200
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View className="absolute items-center justify-center inset-0">
                {children}
            </View>
        </View>
    );
};
