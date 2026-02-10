import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface DisclaimerModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ visible, onDismiss }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={() => { }} // Prevent back button dismissal
        >
            <View className="flex-1 justify-center items-center bg-black/80 p-6">
                <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                        Medical Disclaimer
                    </Text>

                    <Text className="text-base text-slate-600 dark:text-slate-300 mb-6 leading-6">
                        Before making any major medical or lifestyle changes, such as starting an intermittent fasting protocol or significantly altering your hydration habits, please consult with your healthcare professional.
                    </Text>

                    <Text className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-6">
                        This app is for tracking purposes only and is not intended to provide medical advice.
                    </Text>

                    <TouchableOpacity
                        onPress={onDismiss}
                        className="w-full py-4 bg-blue-500 rounded-xl items-center justify-center active:bg-blue-600 shadow-lg shadow-blue-500/20"
                    >
                        <Text className="text-white font-bold text-lg">
                            I Understand
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
