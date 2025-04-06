import * as SecureStore from 'expo-secure-store';
import { getDailyWord } from '../data/words';

// Keys for storing game data
const GAME_STATE_KEY = 'fluentquest_game_state';
const LAST_PLAYED_DATE_KEY = 'fluentquest_last_played_date';

// Default game state
const defaultGameState = {
  score: 0,
  streak: 0,
  wordsGuessed: [],
  hintsUsed: 0,
  lastPlayedDate: null,
};

/**
 * Save the current game state to secure storage
 * @param {Object} gameState - The current game state to save
 */
export const saveGameState = async (gameState) => {
  try {
    await SecureStore.setItemAsync(
      GAME_STATE_KEY, 
      JSON.stringify(gameState)
    );
    // Also update the last played date
    const today = new Date().toISOString().split('T')[0];
    await SecureStore.setItemAsync(LAST_PLAYED_DATE_KEY, today);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

/**
 * Load the saved game state from secure storage
 * @returns {Object} The saved game state or default state if none exists
 */
export const loadGameState = async () => {
  try {
    const savedState = await SecureStore.getItemAsync(GAME_STATE_KEY);
    return savedState ? JSON.parse(savedState) : { ...defaultGameState };
  } catch (error) {
    console.error('Error loading game state:', error);
    return { ...defaultGameState };
  }
};

/**
 * Check if the daily word has been updated
 * @returns {boolean} True if a new daily word is available
 */
export const checkForNewDailyWord = async () => {
  try {
    const lastPlayedDate = await SecureStore.getItemAsync(LAST_PLAYED_DATE_KEY);
    const today = new Date().toISOString().split('T')[0];
    return lastPlayedDate !== today;
  } catch (error) {
    console.error('Error checking for new daily word:', error);
    return true; // Default to true to ensure the player gets a word
  }
};

/**
 * Get the current daily challenge word
 * @returns {Object} The daily word challenge
 */
export const getCurrentDailyChallenge = () => {
  return getDailyWord();
};

/**
 * Update the game state after a guess
 * @param {Object} currentState - The current game state
 * @param {boolean} isCorrect - Whether the guess was correct
 * @param {number} wordId - The ID of the word that was guessed
 * @param {number} hintsUsed - Number of hints used for this word
 * @returns {Object} The updated game state
 */
export const updateGameStateAfterGuess = (currentState, isCorrect, wordId, hintsUsed) => {
  const newState = { ...currentState };
  
  if (isCorrect) {
    newState.score += Math.max(10 - hintsUsed * 2, 1); // Reduce points based on hints used
    newState.streak += 1;
    newState.wordsGuessed = [...newState.wordsGuessed, wordId];
  } else {
    newState.streak = 0; // Reset streak on incorrect guess
  }
  
  newState.hintsUsed += hintsUsed;
  newState.lastPlayedDate = new Date().toISOString().split('T')[0];
  
  return newState;
};