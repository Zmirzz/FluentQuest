import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setItem, getItem } from '../utils/storage';

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
      const savedUser = await getItem(USERNAME_KEY);
      const savedState = await getItem(GAME_STATE_KEY);
      const savedLb = await getItem(LEADERBOARD_KEY);
      if (savedUser) setUsername(savedUser);
      if (savedState) {
        try { setState(JSON.parse(savedState)); } catch {}
      }
      if (savedLb) {
        try { setLeaderboard(JSON.parse(savedLb)); } catch {}
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
    setUsername(name);
    await setItem(USERNAME_KEY, name);
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
    const entry = { username: username || 'Guest', score: state.score, date: new Date().toISOString() };
    const next = [entry, ...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, 25);
    setLeaderboard(next);
    await setItem(LEADERBOARD_KEY, JSON.stringify(next));
    return next;
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
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
