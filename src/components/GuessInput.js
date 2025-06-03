import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { commonStyles } from '../utils/theme';

/**
 * GuessInput component allows players to input their guesses
 * Primary focus is on country of origin with optional definition for bonus points
 */
const GuessInput = ({ onSubmitGuess, theme, disabled = false }) => {
  const [meaningGuess, setMeaningGuess] = useState('');
  const [countryGuess, setCountryGuess] = useState('');
  const [error, setError] = useState('');
  const [showDefinitionInput, setShowDefinitionInput] = useState(false);

  const handleSubmit = () => {
    // Basic validation - only country is required now
    if (!countryGuess.trim()) {
      setError('Please enter the country of origin');
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
      <Text style={styles.mainLabel}>Country of origin?</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.primary }]}
          value={countryGuess}
          onChangeText={setCountryGuess}
          placeholder="Enter the country of origin"
          editable={!disabled}
        />

      <View style={styles.bonusSection}>
        <View style={styles.switchContainer}>
          <Text style={styles.bonusLabel}>Try for bonus points?</Text>
          <Switch
            value={showDefinitionInput}
            onValueChange={setShowDefinitionInput}
            trackColor={{ false: '#767577', true: theme.primary + '80' }}
            thumbColor={showDefinitionInput ? theme.primary : '#f4f3f4'}
            disabled={disabled}
          />
        </View>
        
        {showDefinitionInput && (
          <>
            <Text style={styles.label}>What do you think it means?</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.primary }]}
              value={meaningGuess}
              onChangeText={setMeaningGuess}
              placeholder="Enter your guess for the definition (for bonus points)"
              multiline
              editable={!disabled}
            />
          </>
        )}
      </View>

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
  mainLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bonusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  bonusSection: {
    marginTop: 15,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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