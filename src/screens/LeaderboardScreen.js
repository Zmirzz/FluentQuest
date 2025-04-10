import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import utilities
import { getLeaderboard, updateLeaderboardName } from '../utils/gameState';
import { defaultTheme, commonStyles } from '../utils/theme';

/**
 * LeaderboardScreen displays the top scores without requiring user accounts
 */
const LeaderboardScreen = ({ navigation }) => {
  const [leaderboard, setLeaderboard] = useState({ entries: [] });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      Alert.alert('Error', 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveName = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      const updatedLeaderboard = await updateLeaderboardName(editingId, editingName.trim());
      if (updatedLeaderboard) {
        setLeaderboard(updatedLeaderboard);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setEditingId(null);
      setEditingName('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderLeaderboardItem = ({ item, index }) => {
    const isEditing = item.id === editingId;
    const rank = index + 1;
    const rankStyle = {
      1: styles.goldRank,
      2: styles.silverRank,
      3: styles.bronzeRank
    }[rank] || styles.normalRank;

    return (
      <View style={[styles.leaderboardItem, rank <= 3 && styles.topRankItem]}>
        <View style={[styles.rankBadge, rankStyle]}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        
        <View style={styles.scoreInfo}>
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.editNameInput}
                value={editingName}
                onChangeText={setEditingName}
                placeholder="Enter name"
                maxLength={15}
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                <MaterialIcons name="check" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameContainer}>
              <Text style={styles.playerName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleEditName(item.id, item.name)}>
                <MaterialIcons name="edit" size={16} color={defaultTheme.primary} />
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={styles.scoreText}>{item.score} points</Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(20, insets.top + 10) }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={defaultTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : leaderboard.entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="emoji-events" size={64} color={defaultTheme.primary + '50'} />
          <Text style={styles.emptyText}>No scores yet!</Text>
          <Text style={styles.emptySubtext}>Play the game to get on the leaderboard</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard.entries}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: defaultTheme.background,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: defaultTheme.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: defaultTheme.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  topRankItem: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goldRank: {
    backgroundColor: '#FFD700',
  },
  silverRank: {
    backgroundColor: '#C0C0C0',
  },
  bronzeRank: {
    backgroundColor: '#CD7F32',
  },
  normalRank: {
    backgroundColor: defaultTheme.primary + '40',
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultTheme.primary,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  editNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: defaultTheme.primary,
    borderRadius: 4,
    padding: 4,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: defaultTheme.primary,
    borderRadius: 4,
    padding: 4,
  },
});

export default LeaderboardScreen;