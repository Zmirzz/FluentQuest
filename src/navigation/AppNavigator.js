import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import PlayScreen from '../screens/PlayScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const AppNavigator = () => {
  const [route, setRoute] = useState({ name: 'Home', params: undefined });
  const { colors, toggle, isDark } = useTheme();

  const navigation = useMemo(
    () => ({
      navigate: (name, params) => setRoute({ name, params }),
      goBack: () => setRoute({ name: 'Home', params: undefined }),
    }),
    []
  );

  const Screen = useMemo(() => {
    switch (route.name) {
      case 'Play':
        return <PlayScreen navigation={navigation} route={route} />;
      case 'Daily':
        return <DailyChallengeScreen navigation={navigation} route={route} />;
      case 'Leaderboard':
        return <LeaderboardScreen navigation={navigation} route={route} />;
      case 'Home':
      default:
        return <HomeScreen navigation={navigation} route={route} />;
    }
  }, [route, navigation]);

  const title = ({
    Home: 'FluentQuest',
    Play: 'Play',
    Daily: 'Daily Challenge',
    Leaderboard: 'Leaderboard',
  })[route.name] || 'FluentQuest';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }] }>
        {route.name !== 'Home' ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.primary }]}>{'< Back'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel={title} />
        <TouchableOpacity onPress={toggle} style={styles.themeBtn}>
          <Text style={{ color: colors.primary }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>{Screen}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backBtnPlaceholder: {
    width: 60,
  },
  backText: {
    color: '#4A6FA5',
    fontWeight: 'bold',
  },
  logo: { flex: 1, height: 28 },
  themeBtn: { width: 60, alignItems: 'flex-end', paddingVertical: 8 },
});

export default AppNavigator;
