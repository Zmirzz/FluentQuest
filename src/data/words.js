import { Asset } from 'expo-asset';

// Runtime-loaded list from assets/words.txt (greetings in many languages)
let cachedList = null;

const stripNumbering = (line) => line.replace(/^\s*\d+\.\s*/, '');
const cleanEntry = (line) => stripNumbering(line).trim();

const normalizeLetters = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^A-Za-z]/g, '') // letters only for comparisons
    .toUpperCase();

export const loadWords = async () => {
  if (cachedList) return cachedList;
  try {
    const asset = Asset.fromModule(require('../../assets/words.txt'));
    if (!asset.localUri) {
      await asset.downloadAsync();
    }
    const uri = asset.localUri || asset.uri;
    const res = await fetch(uri);
    const content = await res.text();
    const list = content
      .split(/\r?\n/)
      .map(cleanEntry)
      .filter(Boolean)
      .filter((w, i, arr) => arr.indexOf(w) === i); // dedupe

    // Save as objects with precomputed forms for gameplay
    cachedList = list.map((w, idx) => ({ id: String(idx + 1), display: w, target: normalizeLetters(w) }));
  } catch (e) {
    // Fallback to a tiny set if loading fails
    const fallback = ['Hello', 'Bonjour', 'Hola', 'Guten Tag', 'Namaste'];
    cachedList = fallback.map((w, idx) => ({ id: String(idx + 1), display: w, target: normalizeLetters(w) }));
  }
  return cachedList;
};

const dateIndex = (length, d = new Date()) => {
  const ymd = d.toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < ymd.length; i++) hash = (hash * 31 + ymd.charCodeAt(i)) >>> 0;
  return length ? hash % length : 0;
};

export const getDailyWord = async () => {
  const list = await loadWords();
  return list[dateIndex(list.length)];
};

export const getRandomWord = async () => {
  const list = await loadWords();
  return list[Math.floor(Math.random() * list.length)];
};

// --- Multicultural metadata for a curated subset (maps normalized word -> info)
const metaMap = {
  HOLA: { country: 'Spain', definition: 'Hello (Spanish)', hint: 'Language: Spanish' },
  MERCI: { country: 'France', definition: 'Thank you (French)', hint: 'Language: French' },
  DANKE: { country: 'Germany', definition: 'Thank you (German)', hint: 'Language: German' },
  CIAO: { country: 'Italy', definition: 'Hello/Bye (Italian)', hint: 'Language: Italian' },
  KONNICHIWA: { country: 'Japan', definition: 'Hello/Good afternoon (Japanese)', hint: 'Language: Japanese' },
  ANNYEONG: { country: 'South Korea', definition: 'Hello (Korean, casual)', hint: 'Language: Korean' },
  ANYOUNG: { country: 'South Korea', definition: 'Hello (Korean, variant)', hint: 'Language: Korean' },
  ANYOUNGHASEYO: { country: 'South Korea', definition: 'Hello (Korean, polite)', hint: 'Language: Korean' },
  ZDRAVSTVUYTE: { country: 'Russia', definition: 'Hello (Russian, formal)', hint: 'Language: Russian' },
  NAMASTE: { country: 'India', definition: 'Hello/Greetings (Hindi/Sanskrit)', hint: 'Language: Hindi/Sanskrit' },
  OLA: { country: 'Portugal', definition: 'Hello (Portuguese)', hint: 'Language: Portuguese' },
  HOLAAMIGO: { country: 'Spain', definition: 'Hello friend (Spanish)', hint: 'Phrase: Spanish' },
  HEJ: { country: 'Sweden', definition: 'Hello (Swedish)', hint: 'Language: Swedish' },
  SALAM: { country: 'Iran', definition: 'Hello/Peace (Persian/Arabic)', hint: 'Language: Persian/Arabic' },
  SALAAM: { country: 'United Arab Emirates', definition: 'Hello/Peace (Arabic)', hint: 'Language: Arabic' },
  SHUKRAN: { country: 'United Arab Emirates', definition: 'Thank you (Arabic)', hint: 'Language: Arabic' },
  SAWUBONA: { country: 'South Africa', definition: 'Hello (Zulu)', hint: 'Language: Zulu' },
  XINCHAO: { country: 'Vietnam', definition: 'Hello (Vietnamese)', hint: 'Language: Vietnamese' },
  SAWASDEE: { country: 'Thailand', definition: 'Hello (Thai)', hint: 'Language: Thai' },
  AHOJ: { country: 'Czech Republic', definition: 'Hello (Czech/Slovak)', hint: 'Language: Czech/Slovak' },
  TAKK: { country: 'Norway', definition: 'Thank you (Norwegian)', hint: 'Language: Norwegian' },
  SPASIBO: { country: 'Russia', definition: 'Thank you (Russian)', hint: 'Language: Russian' },
  EFHARISTO: { country: 'Greece', definition: 'Thank you (Greek)', hint: 'Language: Greek' },
  GRACIAS: { country: 'Spain', definition: 'Thank you (Spanish)', hint: 'Language: Spanish' },
  DZIENDOBRY: { country: 'Poland', definition: 'Good day (Polish)', hint: 'Language: Polish' },
  DOBROJUTRO: { country: 'Serbia', definition: 'Good morning (Serbian)', hint: 'Language: Serbian' },
  KAMUSTA: { country: 'Philippines', definition: 'Hello (Filipino/Tagalog)', hint: 'Language: Filipino' },
  KUMUSTA: { country: 'Philippines', definition: 'Hello (Filipino/Tagalog)', hint: 'Language: Filipino' },
  TERE: { country: 'Estonia', definition: 'Hello (Estonian)', hint: 'Language: Estonian' },
  HOI: { country: 'Netherlands', definition: 'Hi (Dutch)', hint: 'Language: Dutch' },
  PRIVET: { country: 'Russia', definition: 'Hi (Russian, informal)', hint: 'Language: Russian' },
  CZESC: { country: 'Poland', definition: 'Hi (Polish, informal)', hint: 'Language: Polish' },
  YASSOU: { country: 'Greece', definition: 'Hi (Greek, informal)', hint: 'Language: Greek' },
  JAMBO: { country: 'Kenya', definition: 'Hello (Swahili)', hint: 'Language: Swahili' },
  GUTENTAG: { country: 'Germany', definition: 'Good day (German)', hint: 'Language: German' },
  BUONGIORNO: { country: 'Italy', definition: 'Good morning (Italian)', hint: 'Language: Italian' },
  BONJOUR: { country: 'France', definition: 'Good day/Hello (French)', hint: 'Language: French' },
  GODDAG: { country: 'Norway', definition: 'Good day (Norwegian)', hint: 'Language: Norwegian' },
  ZDRAVO: { country: 'Serbia', definition: 'Hello (Serbian)', hint: 'Language: Serbian' },
  SVEIKI: { country: 'Latvia', definition: 'Hello (Latvian)', hint: 'Language: Latvian' },
  BAREV: { country: 'Armenia', definition: 'Hello (Armenian)', hint: 'Language: Armenian' },
  PAREV: { country: 'Armenia', definition: 'Hello (Armenian)', hint: 'Language: Armenian' },
  HALLO: { country: 'Germany', definition: 'Hello (German)', hint: 'Language: German' },
  SANNU: { country: 'Nigeria', definition: 'Hello (Hausa)', hint: 'Language: Hausa' },
  MARHABA: { country: 'United Arab Emirates', definition: 'Hello (Arabic)', hint: 'Language: Arabic' },
  KIAORA: { country: 'New Zealand', definition: 'Hello (Māori)', hint: 'Language: Māori' },
  SHALOM: { country: 'Israel', definition: 'Hello/Peace (Hebrew)', hint: 'Language: Hebrew' },
  SABAIDEE: { country: 'Laos', definition: 'Hello (Lao)', hint: 'Language: Lao' },
  ALOHA: { country: 'United States (Hawaii)', definition: 'Hello/Love (Hawaiian)', hint: 'Language: Hawaiian' },
  GDAY: { country: 'Australia', definition: 'Hello (Australian English)', hint: 'Country: Australia' },
  BULA: { country: 'Fiji', definition: 'Hello (Fijian)', hint: 'Language: Fijian' },
  HEI: { country: 'Norway', definition: 'Hi (Norwegian)', hint: 'Language: Norwegian' },
  NIHAO: { country: 'China', definition: 'Hello (Mandarin Chinese)', hint: 'Language: Chinese (Mandarin)' },
  HALO: { country: 'Indonesia', definition: 'Hello (Indonesian)', hint: 'Language: Indonesian' },
  SELAMAT: { country: 'Indonesia', definition: 'Greetings (Indonesian/Malay)', hint: 'Language: Indonesian/Malay' },
  LABAS: { country: 'Lithuania', definition: 'Hello (Lithuanian)', hint: 'Language: Lithuanian' },
  MINGALABA: { country: 'Myanmar', definition: 'Hello (Burmese)', hint: 'Language: Burmese' },
  GEIA: { country: 'Greece', definition: 'Hello (Greek)', hint: 'Language: Greek' },
  ZDRAVEY: { country: 'Bulgaria', definition: 'Hello (Bulgarian)', hint: 'Language: Bulgarian' },
  SZIA: { country: 'Hungary', definition: 'Hi (Hungarian)', hint: 'Language: Hungarian' },
  AVE: { country: 'Italy', definition: 'Hail (Latin)', hint: 'Language: Latin' },
  SALVE: { country: 'Italy', definition: 'Greetings (Latin/Italian)', hint: 'Language: Latin/Italian' },
  BUNA: { country: 'Romania', definition: 'Hello (Romanian)', hint: 'Language: Romanian' },
  BUNAZIUA: { country: 'Romania', definition: 'Good day (Romanian)', hint: 'Language: Romanian' },
  TJENA: { country: 'Sweden', definition: 'Hi (Swedish, informal)', hint: 'Language: Swedish' },
  HABARI: { country: 'Kenya', definition: 'Hello/News? (Swahili)', hint: 'Language: Swahili' },
  HUJAMBO: { country: 'Tanzania', definition: 'Hello (Swahili)', hint: 'Language: Swahili' },
  MABUHAY: { country: 'Philippines', definition: 'Welcome/Long live (Filipino)', hint: 'Language: Filipino' },
  NAMASKARAM: { country: 'India', definition: 'Greetings (Telugu/Malayalam)', hint: 'Language: Telugu/Malayalam' },
  NIHAOMA: { country: 'China', definition: 'How are you? (Mandarin Chinese)', hint: 'Language: Chinese (Mandarin)' },
  BUENAS: { country: 'Spain', definition: 'Short for “Good day” (Spanish)', hint: 'Language: Spanish' },
  QUETAL: { country: 'Spain', definition: 'How’s it going? (Spanish)', hint: 'Language: Spanish' },
  AHLAN: { country: 'Egypt', definition: 'Hello/Welcome (Arabic)', hint: 'Language: Arabic' },
  BONJOURNO: { country: 'Italy', definition: 'Good morning (colloquial misspelling)', hint: 'Language: Italian' },
};

const countryPool = Array.from(new Set(Object.values(metaMap).map((m) => m.country))).sort();

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const toEnglishOnly = (def) => {
  if (!def) return '';
  let s = def.replace(/\(.*?\)/g, ''); // drop language hints
  s = s.replace(/[“”]/g, '"');
  const m = s.match(/"([^"]+)"/);
  if (m) s = m[1];
  s = s.replace(/\s+/g, ' ').trim();
  return s;
};

const deriveHint = (englishDef) => {
  const d = englishDef.toLowerCase();
  if (d.includes('thank you')) return 'Gratitude';
  if (d.includes('good morning')) return 'Morning greeting';
  if (d.includes('good afternoon')) return 'Afternoon greeting';
  if (d.includes('good day')) return 'Daytime greeting';
  if (d.includes('how are you') || d.includes('how’s') || d.includes("how's") || d.includes('how s')) return 'Check-in phrase';
  if (d.includes('welcome')) return 'Welcome greeting';
  if (d.includes('hello') || d.includes('hi') || d.includes('hail') || d.includes('greetings')) return 'General greeting';
  return 'Greeting';
};

export const getPlayableList = async () => {
  const list = await loadWords();
  const playable = list
    .map((w) => ({ ...w, meta: metaMap[w.target] }))
    .filter((w) => !!w.meta)
    .map((w) => {
      const def = toEnglishOnly(w.meta.definition);
      return { id: w.id, word: w.display, country: w.meta.country, definition: def, hint: deriveHint(def) };
    });
  return playable;
};

export const getDailyEntry = async () => {
  const playable = await getPlayableList();
  return playable[dateIndex(playable.length)];
};

export const getRandomEntry = async () => {
  const playable = await getPlayableList();
  return playable[Math.floor(Math.random() * playable.length)];
};

export const getCountryOptions = (correct, n = 6) => {
  const others = shuffle(countryPool.filter((c) => c !== correct));
  return shuffle([correct, ...others.slice(0, Math.max(0, n - 1))]);
};

export const getDefinitionOptions = (correct, n = 4) => {
  const allDefs = Array.from(new Set(Object.values(metaMap).map((m) => toEnglishOnly(m.definition))));
  const others = shuffle(allDefs.filter((d) => d !== correct));
  return shuffle([correct, ...others.slice(0, Math.max(0, n - 1))]);
};

export const normalizeForInput = (s) => normalizeLetters(s);
