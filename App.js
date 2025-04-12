import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Import navigation
import AppNavigator from './src/navigation/AppNavigator';
import UsernameModal from './src/components/UsernameModal';
import { hasUsername, saveUsername } from './src/utils/gameState';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          // You can add custom fonts here if needed
        });
        
        // Artificially delay for a smoother splash screen experience
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  
  useEffect(() => {
    // Check if username is already set
    const checkUsername = async () => {
      const hasExistingUsername = await hasUsername();
      setShowUsernameModal(!hasExistingUsername);
    };
    
    checkUsername();
  }, []);

  if (!appIsReady) {
    return null;
  }
  
  const handleUsernameSubmit = async (username) => {
    await saveUsername(username);
    setShowUsernameModal(false);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <AppNavigator />
        <SpeedInsights />
      </View>
      <UsernameModal 
        visible={showUsernameModal} 
        onSubmit={handleUsernameSubmit} 
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
