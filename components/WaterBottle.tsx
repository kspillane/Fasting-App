import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface WaterBottleProps {
    progress: number; // 0 to 1
    height?: number;
    width?: number;
}

export const WaterBottle: React.FC<WaterBottleProps> = ({
    progress,
    height = 300,
    width = 150
}) => {
    const { colorScheme } = useColorScheme();
    const fillHeight = useSharedValue(0);

    useEffect(() => {
        fillHeight.value = withTiming(progress, { duration: 1000 });
    }, [progress, fillHeight]);

    // SVG coordinate space is 0-100 x 0-210
    // Fill from bottom (210) up.
    // Progress 0 -> y=210, height=0
    // Progress 1 -> y=0, height=210

    // We used 210 as viewBox height in the JSX below
    const VIEWBOX_HEIGHT = 210;

    const animatedProps = useAnimatedProps(() => ({
        y: VIEWBOX_HEIGHT * (1 - fillHeight.value),
        height: VIEWBOX_HEIGHT * fillHeight.value,
    }));

    // "Yeti Rambler" style path
    const bottlePath = `
        M 20 180 
        L 20 60 
        Q 20 40 30 30 
        L 30 10 
        L 70 10 
        L 70 30 
        Q 80 40 80 60 
        L 80 180 
        Q 80 200 60 200 
        L 40 200 
        Q 20 200 20 180 
        Z
    `;

    return (
        <View className="items-center justify-center">
            <Svg width={width} height={height} viewBox={`0 0 100 ${VIEWBOX_HEIGHT}`}>
                <Defs>
                    <ClipPath id="clip">
                        <Path d={bottlePath} />
                    </ClipPath>
                    <LinearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.9" />
                        <Stop offset="1" stopColor="#60a5fa" stopOpacity="0.7" />
                    </LinearGradient>
                </Defs>

                {/* Background (Empty Bottle) */}
                <Path
                    d={bottlePath}
                    fill={colorScheme === 'dark' ? '#1e293b' : '#f1f5f9'}
                    stroke={colorScheme === 'dark' ? '#475569' : '#cbd5e1'}
                    strokeWidth="3"
                />

                {/* Liquid Level */}
                <AnimatedRect
                    x="0"
                    width="100"
                    fill="url(#waterGradient)"
                    clipPath="url(#clip)"
                    animatedProps={animatedProps}
                />

                {/* Bottle Outline Overlay (for crisp edges on top of liquid) */}
                <Path
                    d={bottlePath}
                    fill="none"
                    stroke={colorScheme === 'dark' ? '#94a3b8' : '#64748b'}
                    strokeWidth="3"
                />
            </Svg>
        </View>
    );
};
