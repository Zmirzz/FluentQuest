import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getCountryTheme, getReadableTextColor, commonStyles } from '../utils/theme';

/**
 * WordCard component displays the current word challenge
 * with styling based on the country of origin
 */
const WordCard = ({ 
  word, 
  pronunciation,
  countryColors, 
  revealed = false, 
  onReveal,
  children 
}) => {
  // Get theme based on country colors
  const theme = getCountryTheme(countryColors);
  const textColor = getReadableTextColor(theme.primary);

  return (
    <View 
      style={[
        styles.card, 
        commonStyles.card,
        { backgroundColor: theme.primary }
      ]}
    >
      <Text style={[styles.word, { color: textColor }]}>{word}</Text>
      
      {pronunciation && (
        <Text style={[styles.pronunciation, { color: textColor }]}>
          /{pronunciation}/
        </Text>
      )}

      {children}

      {!revealed && onReveal && (
        <TouchableOpacity 
          style={[styles.revealButton, { backgroundColor: theme.secondary }]}
          onPress={onReveal}
        >
          <Text style={[styles.revealButtonText, { color: getReadableTextColor(theme.secondary) }]}>
            Reveal Answer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  revealButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  revealButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordCard;