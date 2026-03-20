export const API_KEYS = {
  NEWS: import.meta.env.VITE_NEWS_API_KEY,
  MATCH: import.meta.env.VITE_MATCH_API_KEY // e.g. CricAPI, SportMonks
};

export const fetchData = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const RCB_KEYWORDS = [
  'rcb',
  'royal challengers bengaluru',
  'royal challengers bangalore',
  'bengaluru',
  'virat kohli',
  'chinnaswamy',
  'patidar',
  'siraj'
];

const includesRcbContext = (text) => {
  const lower = (text || '').toLowerCase();
  return RCB_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const mapCategory = (text) => {
  const lower = (text || '').toLowerCase();

  if (/(beat|beats|defeat|defeats|won|wins|match|chase|innings|wicket|score|thriller)/.test(lower)) {
    return 'Match Report';
  }

  if (/(injury|injured|ruled out|squad|captain|coach|training|return|returns|playing xi|replacement)/.test(lower)) {
    return 'Team News';
  }

  if (/(analysis|preview|opinion|form|tactical|impact|takeaways|why)/.test(lower)) {
    return 'Analysis';
  }

  return 'RCB Update';
};

// --- API IMPLEMENTATION ---

// 1. NEWS API (Example using NewsAPI.org)
export const getLiveNews = async () => {
  if (!API_KEYS.NEWS) return null; // Fallback to static if no key

  const query = '(rcb OR "royal challengers bengaluru" OR "royal challengers bangalore" OR "virat kohli" OR chinnaswamy)';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&searchIn=title,description&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEYS.NEWS}`;
  
  try {
    const data = await fetchData(url);
    if (!data?.articles?.length) return null;

    // Transform data to match our app's structure
    const transformed = data.articles
      .map((article, index) => {
        const headline = article?.title || '';
        const summary = article?.description || article?.content || '';
        const combinedText = `${headline} ${summary}`;

        if (!headline || !article?.url || !includesRcbContext(combinedText)) {
          return null;
        }

        return {
          id: index + 100,
          headline,
          category: mapCategory(combinedText),
          date: article?.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          image: article?.urlToImage || 'https://placehold.co/600x400/1E1E1E/C8102E?text=RCB+News',
          summary: summary || 'No summary available yet.',
          source: article?.source?.name || 'Unknown Source',
          author: article?.author || 'Staff',
          url: article.url
        };
      })
      .filter(Boolean)
      .slice(0, 12);

    return transformed.length ? transformed : null;
  } catch (err) {
    console.warn("Failed to fetch live news, using static data.");
    return null;
  }
};

// 2. MATCH API (Example structure - adjust URL based on your provider)
export const getLiveMatches = async () => {
  if (!API_KEYS.MATCH) return null;

  // Replace this with your actual cricket API endpoint
  const url = `https://api.cricapi.com/v1/matches?apikey=${API_KEYS.MATCH}&offset=0`; 

  try {
    const data = await fetchData(url);
    // You would need to filter for RCB matches here
    // return transformMatchData(data); 
    return null; // Placeholder until we know the API structure
  } catch (err) {
    console.warn("Failed to fetch live matches.");
    return null;
  }
};
