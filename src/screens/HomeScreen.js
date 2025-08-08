import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../context/GameContext';

const HomeScreen = ({ navigation }) => {
  const { loaded, username, state, hasPlayedToday } = useGame();
  const greeting = useMemo(() => (username ? `Hi, ${username}!` : 'Welcome!'), [username]);
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FAFBFF',
  },
  logo: { width: 220, height: 60, marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: '#6B778C',
    marginBottom: 8,
  },
  flags: { marginBottom: 16 },
  flag: { fontSize: 18 },
  stats: {
    marginBottom: 16,
  },
  stat: {
    fontSize: 16,
    color: '#334155',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  secondary: { backgroundColor: '#0EA5E9' },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
