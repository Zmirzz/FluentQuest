// Local fallback backend using AsyncStorage. No network required.
import { getItem, setItem } from '../utils/storage';

const USERNAME_KEY = 'v3_username';
const LEADERBOARD_KEY = 'v1_leaderboard';

export const init = async () => {
  // no-op for local
};

export const getSession = async () => ({ user: null });

export const getProfile = async () => {
  const username = await getItem(USERNAME_KEY);
  return username ? { id: 'local-user', username } : null;
};

export const updateUsername = async (username) => {
  await setItem(USERNAME_KEY, username);
  return { id: 'local-user', username };
};

export const signIn = async () => ({ user: { id: 'local-user' } });
export const signOut = async () => {};

export const submitScore = async ({ username, score }) => {
  const entry = { username: username || 'Guest', score, date: new Date().toISOString() };
  const saved = await getItem(LEADERBOARD_KEY);
  const current = saved ? JSON.parse(saved) : [];
  const next = [entry, ...current]
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);
  await setItem(LEADERBOARD_KEY, JSON.stringify(next));
  return next;
};

export const fetchLeaderboard = async ({ limit = 25 } = {}) => {
  const saved = await getItem(LEADERBOARD_KEY);
  const current = saved ? JSON.parse(saved) : [];
  return current.slice(0, limit);
};

