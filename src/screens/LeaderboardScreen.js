import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

const LeaderboardScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { leaderboard: ctxLeaderboard, refreshLeaderboard } = useGame();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const fresh = await refreshLeaderboard();
        if (mounted) setData(fresh || ctxLeaderboard || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await refreshLeaderboard();
      setData(fresh || []);
    } finally {
      setRefreshing(false);
    }
  };

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
      {loading ? (
        <View style={{ padding: 20 }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, idx) => item.id || String(idx)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
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
