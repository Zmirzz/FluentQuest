// Optional Supabase backend adapter.
// Requires: @supabase/supabase-js and Expo env vars
// - EXPO_PUBLIC_SUPABASE_URL
// - EXPO_PUBLIC_SUPABASE_ANON_KEY

let supabase = null;

export const init = async () => {
  if (supabase) return;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Supabase env not configured');
  // Lazy import so the app still runs without the package installed until enabled.
  const mod = await import('@supabase/supabase-js');
  supabase = mod.createClient(url, anon);
};

export const getSession = async () => {
  if (!supabase) await init();
  const { data } = await supabase.auth.getSession();
  return data.session ? { user: data.session.user } : { user: null };
};

export const signIn = async ({ email, password, provider } = {}) => {
  if (!supabase) await init();
  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) await init();
  await supabase.auth.signOut();
};

export const getProfile = async () => {
  if (!supabase) await init();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', user.id)
    .single();
  return data || { id: user.id, username: null };
};

export const updateUsername = async (username) => {
  if (!supabase) await init();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, username })
    .select('id, username')
    .single();
  if (error) throw error;
  return data;
};

export const submitScore = async ({ score }) => {
  if (!supabase) await init();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  const { data, error } = await supabase.rpc('submit_score', { p_score: score });
  if (error) throw error;
  return data;
};

export const fetchLeaderboard = async ({ limit = 25 } = {}) => {
  if (!supabase) await init();
  const { data, error } = await supabase
    .from('leaderboard')
    .select('username, score, updated_at')
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map((r, i) => ({ id: String(i + 1), username: r.username, score: r.score }));
};

