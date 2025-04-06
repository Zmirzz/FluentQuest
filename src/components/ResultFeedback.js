import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * ResultFeedback component displays feedback after a player submits a guess
 * Shows whether the meaning and country guesses were correct
 */
const ResultFeedback = ({ result, actualMeaning, actualCountry, theme }) => {
  if (!result) return null;

  const { meaningCorrect, countryCorrect } = result;
  const allCorrect = meaningCorrect && countryCorrect;

  return (
    <View style={styles.container}>
      <View style={[styles.resultCard, { backgroundColor: allCorrect ? theme.success + '20' : theme.error + '20' }]}>
        <View style={styles.header}>
          <MaterialIcons 
            name={allCorrect ? 'check-circle' : 'error'} 
            size={24} 
            color={allCorrect ? theme.success : theme.error} 
          />
          <Text style={[styles.headerText, { color: allCorrect ? theme.success : theme.error }]}>
            {allCorrect ? 'Correct!' : 'Not quite right'}
          </Text>
        </View>

        <View style={styles.resultItem}>
          <View style={styles.resultRow}>
            <MaterialIcons 
              name={meaningCorrect ? 'check-circle' : 'cancel'} 
              size={20} 
              color={meaningCorrect ? theme.success : theme.error} 
            />
            <Text style={styles.resultLabel}>Meaning:</Text>
          </View>
          {!meaningCorrect && (
            <Text style={styles.actualText}>Actual meaning: {actualMeaning}</Text>
          )}
        </View>

        <View style={styles.resultItem}>
          <View style={styles.resultRow}>
            <MaterialIcons 
              name={countryCorrect ? 'check-circle' : 'cancel'} 
              size={20} 
              color={countryCorrect ? theme.success : theme.error} 
            />
            <Text style={styles.resultLabel}>Country of Origin:</Text>
          </View>
          {!countryCorrect && (
            <Text style={styles.actualText}>Actual country: {actualCountry}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 15,
  },
  resultCard: {
    borderRadius: 8,
    padding: 15,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultItem: {
    marginVertical: 5,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  actualText: {
    marginLeft: 28,
    marginTop: 5,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default ResultFeedback;