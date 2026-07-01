# TableForge - AppFront 🎲

![Expo](https://img.shields.io/badge/Expo-54.0.34-black?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)

Welcome to the frontend mobile application for **TableForge** – a comprehensive Tabletop RPG management platform designed to help Dungeon Masters and players organize campaigns, manage characters, and enhance their gaming experience.

## ✨ Features

- **Campaign Management**: View and manage RPG campaigns, members, and sessions.
- **Character Sheets**: Access character details, avatars, and stats on the go.
- **Real-time Updates**: Integrated with SignalR for live updates and synchronization.
- **Dungeon Master Tools**: Special views and controls tailored for the campaign's DM.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) & React Navigation
- **State Management / Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Real-time Communication**: [@microsoft/signalr](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **UI & Icons**: [Lucide React Native](https://lucide.dev/), Reanimated, and custom components

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go app on your physical device (or Android Studio / Xcode for emulators)

### Installation

1. Clone the repository and navigate to the project folder:
   ```bash
   cd TableForge-AppFront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Ensure you have a `.env.development` (or relevant `.env` file) configured with your backend API and SignalR endpoints.

### Running the App

Start the Expo development server:

```bash
npm start
```

This will open a dashboard in your terminal. You can:
- Press `a` to open on an **Android Emulator**
- Press `i` to open on an **iOS Simulator**
- Scan the **QR Code** with your phone's camera (iOS) or the Expo Go app (Android) to run it on a physical device.

## 📜 Available Scripts

- `npm start` - Starts the Expo development server.
- `npm run android` - Starts the app directly in an Android emulator.
- `npm run ios` - Starts the app directly in an iOS simulator.
- `npm run web` - Starts the web version (if configured).
- `npm run test` - Runs Jest tests.
- `npm run lint` - Runs Expo linting.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat(scope): add amazing feature'`) - *Following Conventional Commits!*
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---
*Powered by coffee, critical hits, and nat 20s.* 🐉
