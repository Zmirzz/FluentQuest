import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PlayScreen from '../screens/PlayScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';

const AppNavigator = () => {
  const [route, setRoute] = useState({ name: 'Home', params: undefined });

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
      case 'Home':
      default:
        return <HomeScreen navigation={navigation} route={route} />;
    }
  }, [route, navigation]);

  const title = ({
    Home: 'FluentQuest',
    Play: 'Play',
    Daily: 'Daily Challenge',
  })[route.name] || 'FluentQuest';

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        {route.name !== 'Home' ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>{'< Back'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel={title} />
        <View style={styles.backBtnPlaceholder} />
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
});

export default AppNavigator;
