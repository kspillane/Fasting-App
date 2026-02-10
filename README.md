# Health OS (Fasting & Hydration Tracker)

[![Android Build](https://github.com/kspillane/health-tracker/actions/workflows/android-build.yml/badge.svg)](https://github.com/kspillane/health-tracker/actions/workflows/android-build.yml)

A comprehensive, local-first health tracking application built with React Native, Expo, and NativeWind.

## Features

### 🌙 Intermittent Fasting Tracker
- **Real-time Tracking**: Visual timer showing elapsed fasting time or remaining eating window.
- **Dynamic Phases**: Automatically switches between "Fasting" (Blue) and "Eating" (Green) modes.
- **Presets**: Supports popular protocols (16:8, 18:6, 20:4, OMAD) and custom timers.
- **Recurring Schedule**: Option to auto-restart fasts and eating windows.

### 💧 Hydration Tracker
- **Visual Progress**: Dynamic water bottle fill animation.
- **Smart Units**: Toggle between Imperial (oz) and Metric (ml) with auto-conversion.
- **Quick Logging**: Custom quick-add buttons (+8oz / +250ml).
- **History & Streaks**: Tracks daily intake, 7-day averages, and consistency streaks.

### 🛡️ Privacy & Local-First
- **Offline Capable**: zero cloud dependencies.
- **Data Sovereignty**: All data remains on your device (AsyncStorage).
- **Safety**: Built-in medical disclaimer on first launch.

## Tech Stack
- **Framework**: React Native (Expo SDK 52)
- **Router**: Expo Router (File-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand (Persisted Store)
- **Icons**: Lucide React Native
- **Date Handling**: date-fns

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the App**
    ```bash
    npx expo start
    ```

3.  **Run on Device**
    - Scan the QR code with the Expo Go app (Android/iOS).
    - Or run locally on a simulator: `npm run ios` / `npm run android`.

## License
Private / Proprietary
