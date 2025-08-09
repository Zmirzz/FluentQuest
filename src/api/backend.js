// Backend adapter switcher. Defaults to local.
const MODE = process.env.EXPO_PUBLIC_BACKEND || 'local';

let impl;

export const initBackend = async () => {
  if (impl) return;
  if (MODE === 'supabase') {
    // dynamic import; will throw if env/dep not set
    const supabase = await import('./supabaseBackend');
    impl = supabase;
  } else {
    const local = await import('./localBackend');
    impl = local;
  }
  await impl.init();
};

export const getSession = async () => { await initBackend(); return impl.getSession(); };
export const signIn = async (opts) => { await initBackend(); return impl.signIn(opts); };
export const signOut = async () => { await initBackend(); return impl.signOut(); };
export const getProfile = async () => { await initBackend(); return impl.getProfile(); };
export const updateUsername = async (username) => { await initBackend(); return impl.updateUsername(username); };
export const submitScore = async ({ username, score }) => { await initBackend(); return impl.submitScore({ username, score }); };
export const fetchLeaderboard = async (opts) => { await initBackend(); return impl.fetchLeaderboard(opts || {}); };

