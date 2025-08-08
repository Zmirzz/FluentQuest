import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { GameProvider } from './src/context/GameContext';
import { ThemeProvider } from './src/context/ThemeContext';
import UsernameModal from './src/components/UsernameModal';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameProvider>
          <View style={styles.container}>
            <StatusBar style="auto" />
            <AppNavigator />
            <UsernameModal />
          </View>
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
