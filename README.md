# FluentQuest (Clean Rebuild)

A simple language guessing game built with Expo/React Native. Guess the country of origin for a word and optionally its meaning for bonus points. Includes a daily challenge with higher points and single-score per day.

## Features
- Core play: country (+1) and meaning bonus (+5), streak on correct country.
- Daily challenge: +3 for country; prevents double-scoring per day.
- Progress: score, streak, words guessed, last played date via AsyncStorage.
- Onboarding: username prompt stored locally.
- Navigation: lightweight in-app navigator (Home, Play, Daily).

## Leaderboard + Accounts
Out of the box, the app stores username and leaderboard locally. You can switch to a real backend without large code changes using the adapter in `src/api/`.

Two modes are supported:
- `local` (default): uses AsyncStorage. No auth, offline-friendly.
- `supabase`: real accounts + cloud leaderboard using Supabase Auth and Postgres.

### Enable Supabase mode
1) Create a Supabase project and grab the Project URL and anon key.
2) Add Expo env vars (e.g. in `app.json`):
   ```json
   {
     "expo": {
       "extra": {
         "EXPO_PUBLIC_BACKEND": "supabase",
         "EXPO_PUBLIC_SUPABASE_URL": "https://YOUR_PROJECT.supabase.co",
         "EXPO_PUBLIC_SUPABASE_ANON_KEY": "YOUR_ANON_KEY"
       }
     }
   }
   ```
3) Install the client: `npm install @supabase/supabase-js`
4) Create tables and policies (SQL below), then reload the app.

### Database schema (Supabase)
Run this in the SQL editor:
```sql
-- Profiles table (mirror of auth.users with extra fields)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  created_at timestamptz default now()
);

-- Scores table: one row per user with best score
create table if not exists public.scores (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  best_score int not null default 0,
  total_score int not null default 0,
  updated_at timestamptz default now()
);

-- Daily scores (optional): one row per user per date
create table if not exists public.daily_scores (
  user_id uuid references public.profiles(id) on delete cascade,
  play_date date not null,
  score int not null default 0,
  updated_at timestamptz default now(),
  primary key (user_id, play_date)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.scores enable row level security;
alter table public.daily_scores enable row level security;

-- Only the owner can read/write their profile
create policy "profile owner" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Only the owner can upsert their score
create policy "own scores" on public.scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Only the owner can upsert their daily score
create policy "own daily scores" on public.daily_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public leaderboard view (read-only)
create or replace view public.leaderboard as
select p.username, s.best_score as score, s.updated_at
from public.scores s
join public.profiles p on p.id = s.user_id
where p.username is not null;

grant select on public.leaderboard to anon, authenticated;

-- Helper function to submit a score (keeps best)
create or replace function public.submit_score(p_score int)
returns table (username text, score int, updated_at timestamptz)
language plpgsql security definer as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not signed in';
  end if;
  insert into public.scores as s (user_id, best_score, total_score)
  values (uid, p_score, p_score)
  on conflict (user_id)
  do update set
    best_score = greatest(s.best_score, excluded.best_score),
    total_score = s.total_score + excluded.total_score,
    updated_at = now();
  return query
    select p.username, s.best_score as score, s.updated_at
    from public.scores s join public.profiles p on p.id = s.user_id
    where s.user_id = uid;
end $$;
```

The app will read `public.leaderboard` for the top scores and call `submit_score(p_score int)` when you submit a run.

### UI/Code changes already included
- `src/api/backend.js`: adapter that picks `local` or `supabase` by env var.
- `src/api/localBackend.js`: AsyncStorage-based fallback (no auth).
- `src/api/supabaseBackend.js`: Supabase client calls (lazy-imported).
- `src/context/GameContext.js`: now prefers backend for username/leaderboard with local fallback.
- `src/screens/LeaderboardScreen.js`: fetches from backend and supports pull-to-refresh.

Add an auth screen later if you want email/password or OAuth; for now you can set a username locally (on first run) and switch to real accounts once Supabase is enabled.

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
