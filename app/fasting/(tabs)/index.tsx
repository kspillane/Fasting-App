import { CircularProgress } from '@/components/CircularProgress';
import { TimerDisplay } from '@/components/TimerDisplay';
import { FASTING_PRESETS } from '@/constants/FastingPresets';
import { useFastingStore } from '@/store/useFastingStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addHours, differenceInSeconds, format } from 'date-fns';
import { useRouter } from 'expo-router';
import { ChevronLeft, Edit2, Play, Square, Utensils } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Inlined ConfirmationModal Component ---
interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
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
// -------------------------------------------

export default function DashboardScreen() {
  const {
    isFasting,
    isFeeding,
    startTime,
    endTime,
    feedingStartTime,
    selectedPreset,
    customDuration,
    streak,
    startFast,
    endFast,
    updateStartTime
  } = useFastingStore();

  const [now, setNow] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());

      // Auto-start logic if Feeding Window is over
      if (!isFasting && isFeeding && feedingStartTime) {
        const preset = FASTING_PRESETS.find(p => p.id === selectedPreset);
        const fastDuration = selectedPreset === 'Custom' ? customDuration : (preset ? preset.hours : 16);
        const feedDuration = 24 - fastDuration;
        const feedStart = new Date(feedingStartTime);
        const feedEnd = addHours(feedStart, feedDuration);

        if (now > feedEnd) {
          startFast();
        }
      }

    }, 1000);
    return () => clearInterval(timer);
  }, [isFasting, isFeeding, feedingStartTime, now, selectedPreset, customDuration, startFast]);

  // --- Date Picker Handler ---
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Mobile: Close immediately. On Web: Keep open so user can pick, close via button.
    if (Platform.OS !== 'web') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      updateStartTime(selectedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  // --- Secret Streak Reset Logic ---
  const [tapCount, setTapCount] = useState(0);
  const [firstTapTime, setFirstTapTime] = useState<number | null>(null);
  const [isResetModalVisible, setResetModalVisible] = useState(false);

  const handleStreakTap = () => {
    const nowTime = Date.now();

    if (tapCount === 0 || !firstTapTime) {
      setFirstTapTime(nowTime);
      setTapCount(1);
    } else {
      const timeDiff = nowTime - firstTapTime;

      if (timeDiff > 4000) {
        // Reset if window passed
        setFirstTapTime(nowTime);
        setTapCount(1);
      } else {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount >= 7) {
          // Trigger Secret
          setResetModalVisible(true);
          setTapCount(0);
          setFirstTapTime(null);
        }
      }
    }
  };

  // --- Logic for Timers & Progress ---
  let displaySeconds = 0;
  let progress = 0;
  let label = "Ready to Fast";
  let timeInfoText = "";
  let progressColor = "#3b82f6"; // Default Blue

  if (isFasting && startTime && endTime) {
    // FASTING MODE
    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalDuration = differenceInSeconds(end, start);
    const elapsed = differenceInSeconds(now, start);
    const remaining = differenceInSeconds(end, now);

    progressColor = "#3b82f6"; // Blue

    if (remaining > 0) {
      displaySeconds = remaining;
      progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);
      label = "Fasting Time Left";
    } else {
      displaySeconds = elapsed; // Count up
      progress = 1;
      label = "Overtime";
    }
    timeInfoText = `Fast ends at ${format(end, 'h:mm a')}`;

  } else if (isFeeding && feedingStartTime) {
    // FEEDING MODE
    const preset = FASTING_PRESETS.find(p => p.id === selectedPreset);
    const fastDuration = selectedPreset === 'Custom' ? customDuration : (preset ? preset.hours : 16);
    const feedDuration = 24 - fastDuration;

    const start = new Date(feedingStartTime);
    const end = addHours(start, feedDuration);
    const totalDuration = differenceInSeconds(end, start);
    const remaining = differenceInSeconds(end, now);
    const elapsed = differenceInSeconds(now, start);

    progressColor = "#4ade80"; // Green

    if (remaining > 0) {
      displaySeconds = remaining;
      // Feeding: Count DOWN (Progress usually fills up or empties? User wants "Green during eating window")
      // Let's keep consistency: ring fills up as time passes
      progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);
      label = "Eating Window";
      timeInfoText = `Fasting starts at ${format(end, 'h:mm a')}`;
    } else {
      displaySeconds = 0;
      progress = 1;
      label = "Window Closed";
      timeInfoText = "Starting Fast...";
    }

  } else {
    // READY MODE
    const preset = FASTING_PRESETS.find(p => p.id === selectedPreset);
    const duration = selectedPreset === 'Custom' ? customDuration : (preset ? preset.hours : 16);
    displaySeconds = duration * 3600;
    label = `Target: ${preset ? preset.label : 'Custom'}`;
    timeInfoText = "Start whenever you're ready";
    progressColor = "#94a3b8"; // Greyish
  }

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">

      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.replace('/')}
          className="flex-row items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full self-start"
        >
          <ChevronLeft size={20} color="#64748b" />
          <Text className="text-slate-600 dark:text-slate-300 font-bold ml-1 text-sm">Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>

        {/* Header */}
        <View className="mb-6 items-center w-full">
          <Text className="text-4xl font-extrabold text-slate-900 dark:text-gray-100 mb-2 tracking-tight text-center">
            {isFasting ? 'Current Fast' : (isFeeding ? 'Eating Window' : 'Start Fasting')}
          </Text>
          <Text className="text-lg text-slate-500 dark:text-slate-400 font-medium text-center px-4">
            {/* Subtext */}
          </Text>
        </View>

        {/* Main Progress Circle */}
        <View className="mb-6 shadow-2xl shadow-blue-500/20">
          <CircularProgress progress={progress} size={300} strokeWidth={24} color={progressColor}>
            <TimerDisplay seconds={displaySeconds} label={label} />
          </CircularProgress>
        </View>

        {/* Timestamp Info */}
        <View className="mb-10">
          <Text className="text-xl font-semibold text-slate-700 dark:text-slate-300">
            {timeInfoText}
          </Text>
        </View>

        {/* Controls */}
        <View className="w-full px-8 gap-6">
          {!isFasting && !isFeeding ? (
            <TouchableOpacity
              onPress={startFast}
              activeOpacity={0.8}
              className="w-full bg-blue-600 dark:bg-blue-500 py-6 rounded-3xl flex-row items-center justify-center shadow-xl shadow-blue-500/30 active:scale-95 transform transition"
            >
              <Play size={28} color="#FFF" fill="#FFF" className="mr-3" />
              <Text className="text-white text-2xl font-bold ml-2">Start Fast</Text>
            </TouchableOpacity>
          ) : isFeeding ? (
            <View className="items-center">
              <View className="flex-row items-center bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full mb-4">
                <Utensils size={20} className="text-green-600 dark:text-green-400 mr-2" color="#4ade80" />
                <Text className="text-green-700 dark:text-green-300 font-bold">You are in your eating window</Text>
              </View>
              <TouchableOpacity
                onPress={startFast}
                className="py-3"
              >
                <Text className="text-blue-500 font-semibold">Start Fast Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-col w-full gap-5">
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
                className="w-full bg-red-500 dark:bg-red-600 py-6 rounded-3xl flex-row items-center justify-center shadow-xl shadow-red-500/30 active:scale-95 transform transition"
              >
                <Square size={28} color="#FFF" fill="#FFF" className="mr-3" />
                <Text className="text-white text-2xl font-bold ml-2">End Fast</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={openDatePicker}
                activeOpacity={0.7}
                className="w-full bg-white dark:bg-slate-800 py-5 rounded-3xl flex-row items-center justify-center border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Edit2 size={22} color="#94a3b8" className="mr-3" />
                <Text className="text-slate-700 dark:text-slate-200 text-lg font-bold ml-2">Edit Start Time</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Streak Info */}
        <View className="mt-10 flex-row gap-4">
          <TouchableWithoutFeedback onPress={handleStreakTap}>
            <View className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl items-center min-w-[140px] border border-slate-100 dark:border-slate-700">
              <Text className="text-2xl font-bold text-slate-800 dark:text-white">Streak</Text>
              <Text className="text-blue-500 font-bold text-xl mt-1">{streak} Fast{streak !== 1 ? 's' : ''}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

      </ScrollView>

      {/* Date Picker (Native/Web) */}
      {showDatePicker && (
        <View className="w-full items-center bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mt-4">
          <DateTimePicker
            value={startTime ? new Date(startTime) : new Date()}
            mode="time"
            // display="spinner" // Removed for Web compatibility
            onChange={handleDateChange}
          />
          {Platform.OS === 'web' && (
            <TouchableOpacity
              onPress={() => setShowDatePicker(false)}
              className="mt-4 bg-blue-500 py-2 px-6 rounded-full"
            >
              <Text className="text-white font-bold">Done</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* End Fast Confirmation */}
      <ConfirmationModal
        visible={isModalVisible}
        title="End Fast?"
        message="Are you sure you want to end your fast now? This will stop your timer."
        confirmText="End Fast"
        cancelText="Keep Fasting"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          endFast();
        }}
      />

      {/* Secret Reset Streak Modal */}
      <ConfirmationModal
        visible={isResetModalVisible}
        title="Reset Streak?"
        message="Are you sure you want to reset your streak counter to 0? This cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        onCancel={() => setResetModalVisible(false)}
        onConfirm={() => {
          setResetModalVisible(false);
          // Assuming resetStreak exists in store, if not, I'll access it
          useFastingStore.getState().resetStreak();
        }}
      />
    </SafeAreaView>
  );
}
