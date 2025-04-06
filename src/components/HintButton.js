import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { commonStyles } from '../utils/theme';

/**
 * HintButton component provides hints to the player
 * Tracks how many hints have been used
 */
const HintButton = ({ hints = [], onUseHint, theme }) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [hintsUsed, setHintsUsed] = useState(0);

  const showNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      const nextIndex = currentHintIndex + 1;
      setCurrentHintIndex(nextIndex);
      setHintsUsed(nextIndex + 1);
      if (onUseHint) {
        onUseHint(nextIndex + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      {currentHintIndex >= 0 && (
        <View style={[styles.hintContainer, { backgroundColor: theme.secondary + '20' }]}>
          <Text style={styles.hintText}>{hints[currentHintIndex]}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: theme.secondary },
          currentHintIndex >= hints.length - 1 && styles.disabledButton
        ]}
        onPress={showNextHint}
        disabled={currentHintIndex >= hints.length - 1}
      >
        <MaterialIcons name="lightbulb" size={20} color="white" />
        <Text style={styles.buttonText}>
          {currentHintIndex < 0 ? 'Get a Hint' : 'Next Hint'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.hintCounter}>
        {hintsUsed} / {hints.length} hints used
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  hintContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  hintText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    ...commonStyles.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  hintCounter: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default HintButton;