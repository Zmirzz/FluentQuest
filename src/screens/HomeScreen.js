import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { loaded, username, state, hasPlayedToday } = useGame();
  const { colors, isDark, toggle } = useTheme();
  const greeting = useMemo(() => (username ? `Hi, ${username}!` : 'Welcome!'), [username]);
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.themeButton} onPress={toggle}>
        <Text style={styles.themeButtonText}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>{greeting}</Text>
      <View style={styles.flags}>
        <Text style={styles.flag}>🌍 🇯🇵 🇫🇷 🇩🇪 🇧🇷 🇿🇦 🇨🇳 🇪🇸 🇮🇳 🇵🇹 🇵🇱</Text>
      </View>
      {loaded && (
        <View style={styles.stats}>
          <Text style={styles.stat}>Score: {state.score}</Text>
          <Text style={styles.stat}>Streak: {state.streak}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Play')}>
        <Text style={styles.buttonText}>Start Playing</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Daily')}>
        <Text style={styles.buttonText}>{hasPlayedToday ? 'View Daily' : 'Daily Challenge'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.leaderboard]} onPress={() => navigation.navigate('Leaderboard')}>
        <Text style={styles.buttonText}>Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: colors.bg,
    },
    themeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      padding: 10,
    },
    themeButtonText: {
      fontSize: 24,
    },
    logo: { width: 220, height: 60, marginBottom: 8 },
    subtitle: {
      fontSize: 16,
      color: colors.muted,
      marginBottom: 8,
    },
    flags: { marginBottom: 16 },
    flag: { fontSize: 18 },
    stats: {
      marginBottom: 16,
    },
    stat: {
      fontSize: 16,
      color: colors.label,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 12,
    },
    secondary: { backgroundColor: colors.secondary },
    leaderboard: { backgroundColor: '#334155' },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export default HomeScreen;
