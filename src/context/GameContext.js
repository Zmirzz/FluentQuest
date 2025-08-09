import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setItem, getItem } from '../utils/storage';
import {
  getProfile as backendGetProfile,
  updateUsername as backendUpdateUsername,
  submitScore as backendSubmitScore,
  fetchLeaderboard as backendFetchLeaderboard,
} from '../api/backend';

const GameContext = createContext(null);

const defaultState = {
  score: 0,
  streak: 0,
  wordsGuessed: [],
  lastPlayedDate: null,
};

const USERNAME_KEY = 'v3_username';
const GAME_STATE_KEY = 'v3_game_state';
const LEADERBOARD_KEY = 'v1_leaderboard';

export const GameProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState(null);
  const [state, setState] = useState(defaultState);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const init = async () => {
      // Load local state
      const savedState = await getItem(GAME_STATE_KEY);
      if (savedState) {
        try { setState(JSON.parse(savedState)); } catch {}
      }

      // Try backend profile (falls back to local when in local mode)
      try {
        const profile = await backendGetProfile();
        if (profile?.username) setUsername(profile.username);
        else {
          const savedUser = await getItem(USERNAME_KEY);
          if (savedUser) setUsername(savedUser);
        }
      } catch {
        const savedUser = await getItem(USERNAME_KEY);
        if (savedUser) setUsername(savedUser);
      }

      // Load leaderboard (backend if available; fallback local)
      try {
        const remote = await backendFetchLeaderboard({ limit: 25 });
        if (remote && Array.isArray(remote) && remote.length) setLeaderboard(remote);
        else {
          const savedLb = await getItem(LEADERBOARD_KEY);
          if (savedLb) { try { setLeaderboard(JSON.parse(savedLb)); } catch {} }
        }
      } catch {
        const savedLb = await getItem(LEADERBOARD_KEY);
        if (savedLb) { try { setLeaderboard(JSON.parse(savedLb)); } catch {} }
      }

      setLoaded(true);
    };
    init();
  }, []);

  const saveState = async (next) => {
    setState(next);
    await setItem(GAME_STATE_KEY, JSON.stringify(next));
  };

  const updateUsername = async (name) => {
    try {
      const profile = await backendUpdateUsername(name);
      setUsername(profile?.username || name);
    } catch {
      setUsername(name);
      await setItem(USERNAME_KEY, name);
    }
  };

  const todayStr = () => new Date().toISOString().split('T')[0];
  const hasPlayedToday = useMemo(() => state.lastPlayedDate === todayStr(), [state.lastPlayedDate]);

  const recordGuess = async ({ wordId, countryCorrect, meaningCorrect = false, isDaily = false }) => {
    let points = 0;
    const next = { ...state };

    if (countryCorrect) {
      points += isDaily ? 3 : 1;
      next.streak += 1;
      if (!next.wordsGuessed.includes(wordId)) {
        next.wordsGuessed = [...next.wordsGuessed, wordId];
      }
    } else {
      next.streak = 0;
    }

    if (meaningCorrect) points += 5;

    const isSameDay = next.lastPlayedDate === todayStr();
    if (isDaily) {
      next.lastPlayedDate = todayStr();
      if (isSameDay) {
        points = 0; // already played today
      }
    }

    next.score += points;
    await saveState(next);
    return { points, state: next };
  };

  const submitScore = async () => {
    // Try backend first; fallback to local list
    try {
      const remote = await backendSubmitScore({ username, score: state.score });
      if (remote && Array.isArray(remote)) {
        setLeaderboard(remote);
        return remote;
      }
    } catch {}
    const entry = { username: username || 'Guest', score: state.score, date: new Date().toISOString() };
    const next = [entry, ...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 25);
    setLeaderboard(next);
    await setItem(LEADERBOARD_KEY, JSON.stringify(next));
    return next;
  };

  const refreshLeaderboard = async () => {
    try {
      const data = await backendFetchLeaderboard({ limit: 25 });
      if (data && Array.isArray(data)) {
        setLeaderboard(data);
        return data;
      }
    } catch {}
    // return local if backend not available
    return leaderboard;
  };

  const value = {
    loaded,
    username,
    state,
    hasPlayedToday,
    updateUsername,
    recordGuess,
    leaderboard,
    submitScore,
    refreshLeaderboard,
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
