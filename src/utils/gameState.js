import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyWord } from '../data/words';

// Keys for storing game data
const GAME_STATE_KEY = 'fluentquest_game_state';
const LAST_PLAYED_DATE_KEY = 'fluentquest_last_played_date';
const LEADERBOARD_KEY = 'fluentquest_leaderboard';
const USERNAME_KEY = 'fluentquest_username';

// Default game state
const defaultGameState = {
  score: 0,
  streak: 0,
  wordsGuessed: [],
  hintsUsed: 0,
  lastPlayedDate: null,
  username: null,
};

// Default leaderboard
const defaultLeaderboard = {
  entries: [],
  lastUpdated: null
};

/**
 * Save the current game state to storage
 * @param {Object} gameState - The current game state to save
 */
export const saveGameState = async (gameState) => {
  try {
    // Try to use SecureStore first, fall back to AsyncStorage if needed
    try {
      await SecureStore.setItemAsync(
        GAME_STATE_KEY, 
        JSON.stringify(gameState)
      );
    } catch (secureError) {
      // Fall back to AsyncStorage
      await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    }
    
    // Also update the last played date
    const today = new Date().toISOString().split('T')[0];
    try {
      await SecureStore.setItemAsync(LAST_PLAYED_DATE_KEY, today);
    } catch (secureError) {
      await AsyncStorage.setItem(LAST_PLAYED_DATE_KEY, today);
    }
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

/**
 * Load the saved game state from storage
 * @returns {Object} The saved game state or default state if none exists
 */
export const loadGameState = async () => {
  try {
    let savedState = null;
    
    // Try SecureStore first
    try {
      savedState = await SecureStore.getItemAsync(GAME_STATE_KEY);
    } catch (secureError) {
      // Fall back to AsyncStorage
      savedState = await AsyncStorage.getItem(GAME_STATE_KEY);
    }
    
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
    let lastPlayedDate = null;
    
    // Try SecureStore first
    try {
      lastPlayedDate = await SecureStore.getItemAsync(LAST_PLAYED_DATE_KEY);
    } catch (secureError) {
      // Fall back to AsyncStorage
      lastPlayedDate = await AsyncStorage.getItem(LAST_PLAYED_DATE_KEY);
    }
    
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
 *
 * Scoring rules:
 *   - Correct country: 3 points for the daily challenge, 1 point for endless mode.
 *   - Correct meaning: +5 bonus points regardless of game mode.
 *
 * @param {Object} currentState - The current game state
 * @param {Object} result - The result object containing countryCorrect and meaningCorrect
 * @param {number} wordId - The ID of the word that was guessed
 * @param {number} hintsUsed - Number of hints used for this word
 * @param {boolean} isDailyChallenge - Whether this is a daily challenge or endless mode
 * @returns {Object} The updated game state
 */
export const updateGameStateAfterGuess = async (currentState, result, wordId, hintsUsed, isDailyChallenge = false) => {
  const newState = { ...currentState };
  const { countryCorrect, meaningCorrect } = result;
  
  // Calculate score based on game mode
  let pointsEarned = 0;
  
  if (countryCorrect) {
    // Points based on game mode: 3 for daily challenge, 1 for endless mode
    pointsEarned = isDailyChallenge ? 3 : 1;
    
    // Update streak only on correct guesses
    newState.streak += 1;
    
    // Add word to guessed list
    if (!newState.wordsGuessed.includes(wordId)) {
      newState.wordsGuessed = [...newState.wordsGuessed, wordId];
    }
  } else {
    newState.streak = 0; // Reset streak on incorrect country guess
  }

  // Bonus for guessing the meaning correctly
  if (meaningCorrect) {
    pointsEarned += 5;
  }

  // Update score
  newState.score += pointsEarned;
  newState.hintsUsed += hintsUsed;
  newState.lastPlayedDate = new Date().toISOString().split('T')[0];
  
  // If score is significant, check if it qualifies for leaderboard
  if (pointsEarned > 0) {
    await updateLeaderboard(newState.score, newState.username);
  }
  
  return newState;
};

/**
 * Get the leaderboard from storage
 * @returns {Object} The leaderboard object with duplicates removed
 */
export const getLeaderboard = async () => {
  try {
    let leaderboardData = null;
    
    // Try SecureStore first
    try {
      leaderboardData = await SecureStore.getItemAsync(LEADERBOARD_KEY);
    } catch (secureError) {
      // Fall back to AsyncStorage
      leaderboardData = await AsyncStorage.getItem(LEADERBOARD_KEY);
    }
    
    const leaderboard = leaderboardData ? JSON.parse(leaderboardData) : { ...defaultLeaderboard };
    
    // Remove duplicates by keeping only the highest score for each player name
    if (leaderboard.entries.length > 0) {
      const uniqueEntries = {};
      
      // Group entries by name and keep the one with highest score
      leaderboard.entries.forEach(entry => {
        if (!uniqueEntries[entry.name] || entry.score > uniqueEntries[entry.name].score) {
          uniqueEntries[entry.name] = entry;
        }
      });
      
      // Convert back to array and sort by score
      leaderboard.entries = Object.values(uniqueEntries).sort((a, b) => b.score - a.score);
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return { ...defaultLeaderboard };
  }
};

/**
 * Update the leaderboard with a new score
 * @param {number} score - The score to add to the leaderboard
 * @param {string} username - The username to associate with the score
 */
export const updateLeaderboard = async (score, username = null) => {
  try {
    // Get current leaderboard
    const leaderboard = await getLeaderboard();
    
    // Get username from storage if not provided
    let playerName = username;
    if (!playerName) {
      try {
        playerName = await SecureStore.getItemAsync(USERNAME_KEY);
      } catch (secureError) {
        playerName = await AsyncStorage.getItem(USERNAME_KEY);
      }
    }
    
    // Use default name if still null
    playerName = playerName || 'Player';
    
    // Check if player already exists in leaderboard
    const existingEntryIndex = leaderboard.entries.findIndex(
      entry => entry.name === playerName
    );
    
    // Create a new entry
    const newEntry = {
      id: Date.now().toString(),
      score,
      date: new Date().toISOString(),
      name: playerName
    };
    
    if (existingEntryIndex !== -1) {
      // Player already exists in leaderboard
      const existingEntry = leaderboard.entries[existingEntryIndex];
      
      // Only update if new score is higher
      if (score > existingEntry.score) {
        // Replace the existing entry with the new one
        leaderboard.entries[existingEntryIndex] = newEntry;
      }
      // If score is not higher, keep the existing entry
    } else {
      // Player doesn't exist, add the new entry
      leaderboard.entries.push(newEntry);
    }
    
    // Sort entries by score (highest first)
    leaderboard.entries.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    if (leaderboard.entries.length > 10) {
      leaderboard.entries = leaderboard.entries.slice(0, 10);
    }
    
    leaderboard.lastUpdated = new Date().toISOString();
    
    // Save updated leaderboard
    try {
      await SecureStore.setItemAsync(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    } catch (secureError) {
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return null;
  }
};

/**
 * Update a player's name in the leaderboard
 * @param {string} entryId - The ID of the leaderboard entry
 * @param {string} name - The new name for the player
 */
export const updateLeaderboardName = async (entryId, name) => {
  try {
    const leaderboard = await getLeaderboard();
    
    // Find and update the entry
    const entryIndex = leaderboard.entries.findIndex(entry => entry.id === entryId);
    if (entryIndex !== -1) {
      leaderboard.entries[entryIndex].name = name;
      
      // Save updated leaderboard
      try {
        await SecureStore.setItemAsync(LEADERBOARD_KEY, JSON.stringify(leaderboard));
      } catch (secureError) {
        await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
      }
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error updating leaderboard name:', error);
    return null;
  }
};

/**
 * Save the username to storage
 * @param {string} username - The username to save
 */
export const saveUsername = async (username) => {
  try {
    // Try to use SecureStore first, fall back to AsyncStorage if needed
    try {
      await SecureStore.setItemAsync(USERNAME_KEY, username);
    } catch (secureError) {
      // Fall back to AsyncStorage
      await AsyncStorage.setItem(USERNAME_KEY, username);
    }
    
    // Also update the username in the current game state
    const gameState = await loadGameState();
    gameState.username = username;
    await saveGameState(gameState);
    
    return true;
  } catch (error) {
    console.error('Error saving username:', error);
    return false;
  }
};

/**
 * Get the saved username from storage
 * @returns {string|null} The saved username or null if none exists
 */
export const getUsername = async () => {
  try {
    let username = null;
    
    // Try SecureStore first
    try {
      username = await SecureStore.getItemAsync(USERNAME_KEY);
    } catch (secureError) {
      // Fall back to AsyncStorage
      username = await AsyncStorage.getItem(USERNAME_KEY);
    }
    
    return username;
  } catch (error) {
    console.error('Error getting username:', error);
    return null;
  }
};

/**
 * Check if a username has been set
 * @returns {Promise<boolean>} True if a username has been set
 */
export const hasUsername = async () => {
  const username = await getUsername();
  return username !== null && username !== undefined && username !== '';
};