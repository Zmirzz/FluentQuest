import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import components
import WordCard from '../components/WordCard';
import GuessInput from '../components/GuessInput';
import HintButton from '../components/HintButton';
import ResultFeedback from '../components/ResultFeedback';

// Import utilities
import { getCurrentDailyChallenge } from '../utils/gameState';
import { loadGameState, updateGameStateAfterGuess, saveGameState } from '../utils/gameState';
import { getCountryTheme, defaultTheme, commonStyles } from '../utils/theme';

/**
 * DailyChallengeScreen is the main gameplay screen
 * Shows the daily word challenge and handles player guesses
 */
const DailyChallengeScreen = ({ navigation }) => {
  const [dailyWord, setDailyWord] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [guessResult, setGuessResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(defaultTheme);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Load the daily challenge and game state
    const loadChallenge = async () => {
      try {
        // Get today's word challenge
        const wordChallenge = getCurrentDailyChallenge();
        setDailyWord(wordChallenge);
        
        // Set theme based on country colors
        setTheme(getCountryTheme(wordChallenge.countryColors));
        
        // Load game state
        const state = await loadGameState();
        setGameState(state);
        
        // Check if this word has already been guessed today
        const alreadyGuessed = state.wordsGuessed.includes(wordChallenge.id);
        if (alreadyGuessed) {
          setRevealed(true);
        }
      } catch (error) {
        console.error('Error loading daily challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, []);

  const handleUseHint = (count) => {
    setHintsUsed(count);
  };

  const handleSubmitGuess = async (guess) => {
    if (!dailyWord || !gameState) return;

    // Check if the meaning is correct (simple substring check for demo purposes)
    // In a real app, you would use more sophisticated matching
    const meaningCorrect = dailyWord.meaning.toLowerCase().includes(guess.meaningGuess.toLowerCase());
    
    // Check if country is correct (case insensitive exact match)
    const countryCorrect = guess.countryGuess.toLowerCase() === dailyWord.countryOfOrigin.toLowerCase();
    
    // Set the result
    const result = { meaningCorrect, countryCorrect };
    setGuessResult(result);
    
    // If either is correct, reveal the answer
    if (meaningCorrect || countryCorrect) {
      setRevealed(true);
    }
    
    // Update game state
    const isCorrect = meaningCorrect && countryCorrect;
    const updatedState = updateGameStateAfterGuess(
      gameState,
      isCorrect,
      dailyWord.id,
      hintsUsed
    );
    
    // Save updated game state
    setGameState(updatedState);
    await saveGameState(updatedState);
  };

  const handleReveal = async () => {
    setRevealed(true);
    
    // Update game state to mark this word as seen
    if (gameState && !gameState.wordsGuessed.includes(dailyWord.id)) {
      const updatedState = {
        ...gameState,
        wordsGuessed: [...gameState.wordsGuessed, dailyWord.id]
      };
      setGameState(updatedState);
      await saveGameState(updatedState);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading today's challenge...</Text>
      </View>
    );
  }

  if (!dailyWord) {
    return (
      <View style={[styles.container, styles.errorContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Failed to load today's challenge</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: defaultTheme.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={[styles.container, { paddingTop: Math.max(20, insets.top + 10) }]}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Daily Challenge</Text>
        </View>

        <WordCard 
          word={dailyWord.word}
          pronunciation={dailyWord.pronunciation}
          countryColors={dailyWord.countryColors}
          revealed={revealed}
          onReveal={handleReveal}
        >
          {revealed && (
            <View style={styles.revealedInfo}>
              <Text style={styles.meaningText}>{dailyWord.meaning}</Text>
              <Text style={styles.originText}><Text style={styles.labelText}>Origin:</Text> {dailyWord.countryOfOrigin}</Text>
              <Text style={styles.usageText}><Text style={styles.labelText}>Usage:</Text> {dailyWord.contextUsage}</Text>
            </View>
          )}
        </WordCard>

        {!revealed && (
          <>
            <HintButton 
              hints={dailyWord.hints}
              onUseHint={handleUseHint}
              theme={theme}
            />
            
            <GuessInput 
              onSubmitGuess={handleSubmitGuess}
              theme={theme}
              disabled={revealed}
            />
          </>
        )}

        {guessResult && !revealed && (
          <ResultFeedback 
            result={guessResult}
            actualMeaning={dailyWord.meaning}
            actualCountry={dailyWord.countryOfOrigin}
            theme={theme}
          />
        )}

        {revealed && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: defaultTheme.background,
  },
  container: {
    ...commonStyles.container,
    paddingBottom: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: defaultTheme.primary,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: defaultTheme.error,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  title: {
    ...commonStyles.title,
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To center the title accounting for the back button
  },
  revealedInfo: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  meaningText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  originText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333333',
  },
  usageText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333333',
  },
  labelText: {
    fontWeight: 'bold',
    color: defaultTheme.primary,
  },
  button: {
    ...commonStyles.button,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DailyChallengeScreen;