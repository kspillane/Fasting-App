import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View className="flex-1 justify-center items-center bg-black/50 p-6">
                    <TouchableWithoutFeedback>
                        <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                                {title}
                            </Text>

                            <Text className="text-base text-slate-600 dark:text-slate-400 text-center mb-8 leading-6">
                                {message}
                            </Text>

                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={onCancel}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 rounded-xl items-center justify-center active:bg-slate-200 dark:active:bg-slate-600"
                                >
                                    <Text className="text-slate-700 dark:text-slate-300 font-bold text-base">
                                        {cancelText}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onConfirm}
                                    className="flex-1 py-4 bg-red-500 rounded-xl items-center justify-center active:bg-red-600 shadow-lg shadow-red-500/20"
                                >
                                    <Text className="text-white font-bold text-base">
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
