import { FASTING_PRESETS } from '@/constants/FastingPresets';
import { useFastingStore } from '@/store/useFastingStore';
import { Bell, Clock, Repeat } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const {
    selectedPreset,
    updatePreset,
    notificationsEnabled,
    setNotificationsEnabled,
    isRecurring,
    toggleRecurring,
    customDuration,
    updateCustomDuration
  } = useFastingStore();

  const { colorScheme } = useColorScheme();



  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Settings</Text>

        {/* Fasting Presets */}
        <View className="mb-8 w-full">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
            Fasting Goal
          </Text>
          <View className="flex-col gap-4">
            {FASTING_PRESETS.map((preset) => {
              const isActive = selectedPreset === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => updatePreset(preset.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center justify-between p-5 rounded-2xl border-2 ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                    } shadow-sm`}
                >
                  <View>
                    <Text className={`font-bold text-lg mb-1 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {preset.label}
                    </Text>
                    <Text className={`text-base ${isActive ? 'text-blue-600/80 dark:text-blue-300/80' : 'text-slate-500 dark:text-slate-400'}`}>
                      {preset.description} • {preset.hours}h
                    </Text>
                  </View>
                  {isActive ? (
                    <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                      <View className="w-2.5 h-2.5 rounded-full bg-white" />
                    </View>
                  ) : (
                    <View className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Custom Option */}
            <TouchableOpacity
              onPress={() => updatePreset('Custom')}
              activeOpacity={0.7}
              className={`flex-row items-center justify-between p-5 rounded-2xl border-2 ${selectedPreset === 'Custom'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                } shadow-sm`}
            >
              <View>
                <Text className={`font-bold text-lg mb-1 ${selectedPreset === 'Custom' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-100'}`}>
                  Custom
                </Text>
                <Text className={`text-base ${selectedPreset === 'Custom' ? 'text-blue-600/80 dark:text-blue-300/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  Set your own duration
                </Text>
              </View>
              {selectedPreset === 'Custom' ? (
                <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View className="mb-8 w-full">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
            Preferences
          </Text>
          <View className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">

            {/* Notifications Toggle */}
            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full items-center justify-center mr-4">
                  <Bell size={20} className="text-indigo-600 dark:text-indigo-400" color={colorScheme === 'dark' ? '#818cf8' : '#4f46e5'} />
                </View>
                <Text className="text-base font-semibold text-slate-800 dark:text-slate-200">Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#767577", true: "#3b82f6" }}
              />
            </View>

            {/* Recurring Fast Toggle */}
            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full items-center justify-center mr-4">
                  <Repeat size={20} className="text-green-600 dark:text-green-400" color="#4ade80" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-slate-800 dark:text-slate-200">Recurring Fast</Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">Auto-start next fast</Text>
                </View>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={toggleRecurring}
                trackColor={{ false: "#767577", true: "#3b82f6" }}
              />
            </View>

            {/* Custom Duration Input */}
            {selectedPreset === 'Custom' && (
              <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-full items-center justify-center mr-4">
                    <Clock size={20} className="text-orange-600 dark:text-orange-400" color="#fb923c" />
                  </View>
                  <Text className="text-base font-semibold text-slate-800 dark:text-slate-200">Duration (Hours)</Text>
                </View>
                <TextInput
                  className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white px-4 py-2 rounded-lg w-20 text-center font-bold"
                  keyboardType="numeric"
                  value={customDuration.toString()}
                  onChangeText={(text) => updateCustomDuration(parseInt(text) || 16)}
                />
              </View>
            )}

          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}
