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
  const { color: textColor, style: textShadowStyle } = getReadableTextColor(theme.primary);

  return (
    <View 
      style={[
        styles.card, 
        commonStyles.card,
        { backgroundColor: theme.primary }
      ]}
    >
      <Text style={[styles.word, { color: textColor }, textShadowStyle]}>{word}</Text>
      
      {pronunciation && (
        <Text style={[styles.pronunciation, { color: textColor }, textShadowStyle]}>
          /{pronunciation}/
        </Text>
      )}

      <View style={revealed ? styles.revealedContent : null}>
        {children}
      </View>

      {!revealed && onReveal && (
        <TouchableOpacity 
          style={[styles.revealButton, { backgroundColor: theme.secondary }]}
          onPress={onReveal}
        >
          <Text 
            style={[
              styles.revealButtonText, 
              { color: getReadableTextColor(theme.secondary).color },
              getReadableTextColor(theme.secondary).style
            ]}
          >
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
  revealedContent: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
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