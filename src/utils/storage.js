import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Storage set error', e);
  }
};

export const getItem = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Storage get error', e);
    return null;
  }
};

