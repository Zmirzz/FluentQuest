import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { commonStyles, defaultTheme } from '../utils/theme';

/**
 * UsernameModal prompts the user to enter a username when first visiting the app
 * The username is stored locally and used for the leaderboard
 */
const UsernameModal = ({ visible, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Clear any previous errors
    setError('');
    
    // Submit the username
    onSubmit(username.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Welcome to FluentQuest!</Text>
          
          <Text style={styles.description}>
            Please enter a username to track your scores on the leaderboard.
          </Text>
          
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            maxLength={15}
            autoFocus
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Start Playing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: defaultTheme.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    ...commonStyles.input,
    width: '100%',
    marginBottom: 15,
  },
  button: {
    ...commonStyles.button,
    backgroundColor: defaultTheme.primary,
    width: '100%',
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

export default UsernameModal;