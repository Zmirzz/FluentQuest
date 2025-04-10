import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * ResultFeedback component displays feedback after a player submits a guess
 * Primary focus is on country of origin with optional definition for bonus points
 */
const ResultFeedback = ({ result, actualMeaning, actualCountry, theme }) => {
  if (!result) return null;

  const { meaningCorrect, countryCorrect } = result;
  // Country is the primary objective, meaning is bonus
  const primarySuccess = countryCorrect;

  return (
    <View style={styles.container}>
      <View style={[styles.resultCard, { backgroundColor: primarySuccess ? theme.success + '20' : theme.error + '20' }]}>
        <View style={styles.header}>
          <MaterialIcons 
            name={primarySuccess ? 'check-circle' : 'error'} 
            size={24} 
            color={primarySuccess ? theme.success : theme.error} 
          />
          <Text style={[styles.headerText, { color: primarySuccess ? theme.success : theme.error }]}>
            {primarySuccess ? 'Correct Country!' : 'Incorrect Country'}
          </Text>
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

        {result.hasOwnProperty('meaningCorrect') && (
          <View style={styles.bonusResultItem}>
            <View style={styles.resultRow}>
              <MaterialIcons 
                name={meaningCorrect ? 'stars' : 'cancel'} 
                size={20} 
                color={meaningCorrect ? '#FFD700' : theme.error} 
              />
              <Text style={styles.bonusLabel}>Bonus - Definition:</Text>
            </View>
            {!meaningCorrect && (
              <Text style={styles.actualText}>Actual meaning: {actualMeaning}</Text>
            )}
            {meaningCorrect && (
              <Text style={styles.bonusText}>+5 bonus points!</Text>
            )}
          </View>
        )}
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