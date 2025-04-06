import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { defaultTheme, commonStyles } from '../utils/theme';

/**
 * AboutScreen provides information about the FluentQuest game
 * Explains the purpose and how to play
 */
const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={defaultTheme.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>About FluentQuest</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What is FluentQuest?</Text>
          <Text style={styles.paragraph}>
            FluentQuest is a language learning game that introduces you to fascinating words and phrases from around the world that don't have direct translations in English.
          </Text>
          <Text style={styles.paragraph}>
            Each day, you'll be presented with a new word from a different culture. Your challenge is to guess its meaning and country of origin.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How to Play</Text>
          <Text style={styles.paragraph}>
            1. Read the foreign word or phrase presented each day
          </Text>
          <Text style={styles.paragraph}>
            2. Use the hints provided to help you guess
          </Text>
          <Text style={styles.paragraph}>
            3. Enter your guess for the meaning and country of origin
          </Text>
          <Text style={styles.paragraph}>
            4. See how close you were and learn about the word's true meaning and cultural context
          </Text>
          <Text style={styles.paragraph}>
            5. Come back tomorrow for a new word challenge!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Scoring</Text>
          <Text style={styles.paragraph}>
            • Correctly guess both meaning and country: 10 points
          </Text>
          <Text style={styles.paragraph}>
            • Each hint used reduces your potential score by 2 points
          </Text>
          <Text style={styles.paragraph}>
            • Build a streak by correctly guessing on consecutive days
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Practice Mode</Text>
          <Text style={styles.paragraph}>
            Want more than one word per day? Use Practice Mode to explore random words from our collection and improve your skills!
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: defaultTheme.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
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
  card: {
    ...commonStyles.card,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultTheme.primary,
    marginBottom: 10,
  },
  paragraph: {
    ...commonStyles.text,
    marginBottom: 10,
  },
  button: {
    ...commonStyles.button,
    backgroundColor: defaultTheme.primary,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AboutScreen;