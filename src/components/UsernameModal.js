import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

const UsernameModal = () => {
  const { loaded, username, updateUsername } = useGame();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (loaded && !username) setVisible(true);
  }, [loaded, username]);

  const submit = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    await updateUsername(trimmed);
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to FluentQuest</Text>
          <Text style={styles.subtitle}>Choose a username to track your score</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={name}
            onChangeText={(t) => { setName(t); setError(''); }}
            autoFocus
            maxLength={20}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#4A6FA5' },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#4A6FA5', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  error: { color: '#D32F2F', marginTop: 8 },
  button: { backgroundColor: '#4A6FA5', marginTop: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default UsernameModal;

