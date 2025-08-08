# FluentQuest (Clean Rebuild)

A simple language guessing game built with Expo/React Native. Guess the country of origin for a word and optionally its meaning for bonus points. Includes a daily challenge with higher points and single-score per day.

## Features
- Core play: country (+1) and meaning bonus (+5), streak on correct country.
- Daily challenge: +3 for country; prevents double-scoring per day.
- Progress: score, streak, words guessed, last played date via AsyncStorage.
- Onboarding: username prompt stored locally.
- Navigation: lightweight in-app navigator (Home, Play, Daily).

## Scripts
- `npm start` — start Expo dev server (choose platform)
- `npm run web` — run web target in browser
- `npm run android` / `npm run ios` — open on emulator/device
- `npm test` — run Jest (no tests included yet)

## Structure
- `App.js`, `index.js`
- `src/`
  - `screens/` — `HomeScreen`, `PlayScreen`, `DailyChallengeScreen`
  - `components/` — `UsernameModal`
  - `navigation/` — `AppNavigator`
  - `context/` — `GameContext`
  - `utils/` — `storage`
  - `data/` — `words.js`
- `assets/` — icons, splash, etc. (preserved)

## Notes
- The words dataset is a small inline list in `src/data/words.js`. Expand or wire to your source as needed.
- State keys use `v3_` prefix to avoid collisions with prior versions.

