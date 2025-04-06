import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import PracticeModeScreen from '../screens/PracticeModeScreen';
import AboutScreen from '../screens/AboutScreen';

// Create stack navigator
const Stack = createNativeStackNavigator();

/**
 * AppNavigator sets up the navigation structure for the app
 * Defines routes and screen options
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F5F5' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
        <Stack.Screen name="PracticeMode" component={PracticeModeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;