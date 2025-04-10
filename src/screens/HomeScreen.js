import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { commonStyles, defaultTheme } from '../utils/theme';
import { loadGameState, checkForNewDailyWord, getUsername } from '../utils/gameState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * HomeScreen serves as the entry point to the FluentQuest game
 * Displays game title, stats, and navigation options
 */
const HomeScreen = ({ navigation }) => {
  const [gameState, setGameState] = useState(null);
  const [hasNewChallenge, setHasNewChallenge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Load game state when component mounts
    const loadGame = async () => {
      try {
        const state = await loadGameState();
        setGameState(state);
        
        // Check if there's a new daily word challenge
        const newChallenge = await checkForNewDailyWord();
        setHasNewChallenge(newChallenge);

        // Get the username
        const savedUsername = await getUsername();
        setUsername(savedUsername);
      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading FluentQuest...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Math.max(20, insets.top) }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        {username && (
          <View style={styles.usernameContainer}>
            <Text style={styles.usernameText}>Hi, {username}!</Text>
          </View>
        )}
      </View>

      {gameState && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.wordsGuessed.length}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.dailyChallengeButton]}
          onPress={() => navigation.navigate('DailyChallenge')}
        >
          <MaterialIcons name="translate" size={24} color="white" />
          <Text style={styles.buttonText}>
            {hasNewChallenge ? 'New Daily Challenge!' : 'Daily Challenge'}
          </Text>
          {hasNewChallenge && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('EndlessMode')}
        >
          <MaterialIcons name="all-inclusive" size={24} color="white" />
          <Text style={styles.buttonText}>Endless Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <MaterialIcons name="emoji-events" size={24} color="white" />
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('About')}
        >
          <MaterialIcons name="info" size={24} color="white" />
          <Text style={styles.buttonText}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: defaultTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: defaultTheme.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    position: 'relative',
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 10,
  },
  usernameContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: defaultTheme.primary,
  },
  usernameText: {
    color: defaultTheme.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: defaultTheme.primary,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    ...commonStyles.button,
    backgroundColor: defaultTheme.primary,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  dailyChallengeButton: {
    backgroundColor: defaultTheme.secondary, // Yellow color
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: 'white',
    marginLeft: 15,
  },
  highlightedButton: {
    backgroundColor: defaultTheme.secondary,
  },
  newBadge: {
    backgroundColor: '#FF4757',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    right: 15,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen;