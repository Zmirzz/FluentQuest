import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LeaderboardScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // Dummy data for now
  const data = [
    { id: '1', username: 'Player1', score: 1500 },
    { id: '2', username: 'Player2', score: 1200 },
    { id: '3', username: 'Player3', score: 1100 },
    { id: '4', username: 'Player4', score: 1000 },
    { id: '5', username: 'Player5', score: 900 },
  ];

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primaryText,
      marginBottom: 20,
      textAlign: 'center',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 10,
      marginBottom: 10,
    },
    rank: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
    username: {
      fontSize: 18,
      color: colors.text,
    },
    score: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.secondary,
    },
  });

export default LeaderboardScreen;