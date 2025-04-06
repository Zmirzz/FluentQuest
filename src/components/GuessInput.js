import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { commonStyles } from '../utils/theme';

/**
 * GuessInput component allows players to input their guesses
 * for word meaning and country of origin
 */
const GuessInput = ({ onSubmitGuess, theme, disabled = false }) => {
  const [meaningGuess, setMeaningGuess] = useState('');
  const [countryGuess, setCountryGuess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!meaningGuess.trim() || !countryGuess.trim()) {
      setError('Please enter both a meaning and country of origin');
      return;
    }

    // Clear any previous errors
    setError('');
    
    // Submit the guess
    onSubmitGuess({
      meaningGuess: meaningGuess.trim(),
      countryGuess: countryGuess.trim(),
    });

    // Clear inputs after submission
    setMeaningGuess('');
    setCountryGuess('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What do you think it means?</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary }]}
        value={meaningGuess}
        onChangeText={setMeaningGuess}
        placeholder="Enter your guess for the meaning"
        multiline
        disabled={disabled}
      />

      <Text style={styles.label}>Country of origin?</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.primary }]}
        value={countryGuess}
        onChangeText={setCountryGuess}
        placeholder="Enter the country of origin"
        disabled={disabled}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Submit Guess</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    ...commonStyles.input,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#4A6FA5',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default GuessInput;