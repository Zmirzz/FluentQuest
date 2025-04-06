// Sample data for FluentQuest game
// Each word includes its meaning, country of origin, hints, and contextual usage

export const words = [
  {
    id: 1,
    word: 'Hygge',
    pronunciation: 'hoo-gah',
    meaning: 'A quality of coziness and comfortable conviviality that engenders a feeling of contentment or well-being',
    countryOfOrigin: 'Denmark',
    countryColors: ['#C8102E', '#FFFFFF'], // Danish flag colors (red and white)
    hints: [
      'Associated with warmth and comfort',
      'Often experienced during winter',
      'Involves simple pleasures'
    ],
    contextUsage: 'Lighting candles and enjoying a hot drink by the fireplace creates a sense of hygge.'
  },
  {
    id: 2,
    word: 'Wanderlust',
    pronunciation: 'won-der-lust',
    meaning: 'A strong desire to travel and explore the world',
    countryOfOrigin: 'Germany',
    countryColors: ['#000000', '#DD0000', '#FFCE00'], // German flag colors (black, red, gold)
    hints: [
      'Related to travel and adventure',
      'Combines two common words',
      'Describes a feeling many experience in spring'
    ],
    contextUsage: 'Her wanderlust led her to visit six continents before she turned thirty.'
  },
  {
    id: 3,
    word: 'Sisu',
    pronunciation: 'see-soo',
    meaning: 'Extraordinary determination, courage and resilience in the face of extreme adversity',
    countryOfOrigin: 'Finland',
    countryColors: ['#FFFFFF', '#003580'], // Finnish flag colors (white and blue)
    hints: [
      'Represents a national character',
      'Related to perseverance',
      'Four letters long'
    ],
    contextUsage: 'It was only through sisu that she was able to complete the marathon despite her injury.'
  },
  {
    id: 4,
    word: 'Wabi-Sabi',
    pronunciation: 'wah-bee sah-bee',
    meaning: 'Finding beauty in imperfection and accepting the natural cycle of life',
    countryOfOrigin: 'Japan',
    countryColors: ['#FFFFFF', '#BC002D'], // Japanese flag colors (white and red)
    hints: [
      'Related to aesthetics and philosophy',
      'Consists of two connected concepts',
      'Embraces imperfection'
    ],
    contextUsage: 'The cracked pottery embodied the wabi-sabi aesthetic that values imperfection.'
  },
  {
    id: 5,
    word: 'Sobremesa',
    pronunciation: 'so-breh-mey-sah',
    meaning: 'The time spent after a meal, talking to the people you shared the meal with',
    countryOfOrigin: 'Spain',
    countryColors: ['#AA151B', '#F1BF00'], // Spanish flag colors (red and yellow)
    hints: [
      'Related to dining customs',
      'Happens after a specific activity',
      'Values conversation and connection'
    ],
    contextUsage: 'The family enjoyed a long sobremesa, discussing politics and sharing stories long after the plates were cleared.'
  },
  {
    id: 6,
    word: 'Ubuntu',
    pronunciation: 'oo-boon-too',
    meaning: 'The belief in a universal bond of sharing that connects all humanity',
    countryOfOrigin: 'South Africa',
    countryColors: ['#007A4D', '#FFB612', '#000000', '#DE3831', '#002395', '#FFFFFF'], // South African flag colors
    hints: [
      'Represents a philosophical concept',
      'Associated with Nelson Mandela',
      'Emphasizes community and compassion'
    ],
    contextUsage: 'The community rebuilt his house after the fire, demonstrating ubuntu in action.'
  },
  {
    id: 7,
    word: 'Fernweh',
    pronunciation: 'fairn-vey',
    meaning: 'An ache for distant places; a craving for travel',
    countryOfOrigin: 'Germany',
    countryColors: ['#000000', '#DD0000', '#FFCE00'], // German flag colors (black, red, gold)
    hints: [
      'Similar to another word in our list',
      'Describes a specific type of longing',
      'Combines "distance" and "pain"'
    ],
    contextUsage: 'Looking at travel magazines only intensified her fernweh.'
  }
];

// Function to get a random word for the daily challenge
export const getDailyWord = () => {
  // In a real app, this would be based on the current date to ensure everyone gets the same word
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % words.length;
  return words[index];
};

// Function to get a word by ID
export const getWordById = (id) => {
  return words.find(word => word.id === id);
};