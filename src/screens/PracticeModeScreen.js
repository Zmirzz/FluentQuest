import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import components
import WordCard from '../components/WordCard';
import GuessInput from '../components/GuessInput';
import HintButton from '../components/HintButton';
import ResultFeedback from '../components/ResultFeedback';

// Import utilities
import { words } from '../data/words';
import { getCountryTheme, defaultTheme, commonStyles } from '../utils/theme';

/**
 * PracticeModeScreen allows players to practice with random words
 * Similar to daily challenge but can be played multiple times
 */
const PracticeModeScreen = ({ navigation }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [guessResult, setGuessResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const insets = useSafeAreaInsets();

  // Load a random word when component mounts
  useEffect(() => {
    loadRandomWord();
  }, []);

  const loadRandomWord = () => {
    // Get a random word from our collection
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    
    // Set the current word and theme
    setCurrentWord(randomWord);
    setTheme(getCountryTheme(randomWord.countryColors));
    
    // Reset state for new word
    setHintsUsed(0);
    setGuessResult(null);
    setRevealed(false);
  };

  const handleUseHint = (count) => {
    setHintsUsed(count);
  };

  const handleSubmitGuess = (guess) => {
    if (!currentWord) return;

    // Check if country is correct (case insensitive exact match) - primary objective
    const countryCorrect = guess.countryGuess.toLowerCase() === currentWord.countryOfOrigin.toLowerCase();
    
    // Check if the meaning is correct (simple substring check) - bonus objective
    // Only check meaning if it was provided
    const meaningCorrect = guess.meaningGuess ? 
      currentWord.meaning.toLowerCase().includes(guess.meaningGuess.toLowerCase()) : 
      false;
    
    // Set the result
    const result = { meaningCorrect, countryCorrect };
    setGuessResult(result);
    
    // Reveal the answer if country is correct (primary objective)
    if (countryCorrect) {
      setRevealed(true);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  if (!currentWord) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading practice word...</Text>
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
          <Text style={styles.title}>Practice Mode</Text>
        </View>

        <WordCard 
          word={currentWord.word}
          pronunciation={currentWord.pronunciation}
          countryColors={currentWord.countryColors}
          revealed={revealed}
          onReveal={handleReveal}
        >
          {revealed && (
            <View style={styles.revealedInfo}>
              <Text style={styles.meaningText}>{currentWord.meaning}</Text>
              <Text style={styles.originText}><Text style={styles.labelText}>Origin:</Text> {currentWord.countryOfOrigin}</Text>
              <Text style={styles.usageText}><Text style={styles.labelText}>Usage:</Text> {currentWord.contextUsage}</Text>
            </View>
          )}
        </WordCard>

        {!revealed && (
          <>
            <HintButton 
              hints={currentWord.hints}
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
            actualMeaning={currentWord.meaning}
            actualCountry={currentWord.countryOfOrigin}
            theme={theme}
          />
        )}

        {revealed && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={loadRandomWord}
            >
              <Text style={styles.buttonText}>Try Another Word</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.secondary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
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
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    ...commonStyles.button,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Wrap the component with SafeAreaProvider to ensure insets are available
export default function PracticeModeScreenWithSafeArea(props) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <PracticeModeScreen {...props} />
    </SafeAreaView>
  );
};