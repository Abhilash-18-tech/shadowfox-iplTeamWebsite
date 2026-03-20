import { knowledgeBase } from '../data/knowledgeBase';
import { upcomingMatches, pointsTable } from '../data/matches';
import { players } from '../data/players';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'with', 'from', 'at', 'by', 'about', 'tell', 'me', 'please', 'what', 'when', 'who', 'how', 'can', 'you',
]);

const TEAM_ALIASES = {
  rcb: 'royal challengers bengaluru',
  csk: 'chennai super kings',
  srh: 'sunrisers hyderabad',
  mi: 'mumbai indians',
  gt: 'gujarat titans',
  dc: 'delhi capitals',
  pbks: 'punjab kings',
  kkr: 'kolkata knight riders',
  lsg: 'lucknow super giants',
  rr: 'rajasthan royals',
};

const WEBSITE_ROUTE_HINTS = [
  { key: 'home', route: '/', title: 'Home' },
  { key: 'roster', route: '/roster', title: 'Roster' },
  { key: 'schedule', route: '/schedule', title: 'Schedule' },
  { key: 'stats', route: '/stats', title: 'Stats' },
  { key: 'news', route: '/news', title: 'News' },
  { key: 'fan zone', route: '/fanzone', title: 'Fan Zone' },
  { key: 'fanzone', route: '/fanzone', title: 'Fan Zone' },
];

const DOMAIN_KEYWORDS = [
  'rcb', 'royal challengers', 'ipl', 'player', 'players', 'squad', 'roster', 'match', 'matches',
  'schedule', 'fixture', 'fixtures', 'result', 'results', 'standings', 'points table', 'news',
  'stats', 'statistics', 'chinnaswamy', 'bengaluru', 'fanzone', 'fan zone', 'captain', 'wicket', 'runs',
];

const normalize = (text) =>
  (text ?? '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const expandAliases = (text) => {
  let next = ` ${normalize(text)} `;
  Object.entries(TEAM_ALIASES).forEach(([short, full]) => {
    next = next.replace(new RegExp(`\\b${short}\\b`, 'g'), ` ${full} `);
  });
  return normalize(next);
};

const isDomainAllowed = (query) => {
  const q = expandAliases(query);
  const playerMatch = players.some((player) => {
    const name = normalize(player.name);
    const parts = name.split(' ').filter(Boolean);
    return q.includes(name) || parts.some((part) => part.length > 3 && q.includes(part));
  });

  return playerMatch || DOMAIN_KEYWORDS.some((keyword) => q.includes(keyword));
};

const tokenize = (text) =>
  expandAliases(text)
    .split(' ')
    .filter((token) => token && !STOP_WORDS.has(token));

const scoreEntry = (entry, tokens) => {
  const haystack = expandAliases(`${entry.title} ${entry.category} ${entry.content}`);
  let score = 0;

  tokens.forEach((token) => {
    if (haystack.includes(token)) {
      score += 2;
    }
  });

  if (tokens.some((token) => expandAliases(entry.title).includes(token))) {
    score += 2;
  }

  if (tokens.some((token) => token.length > 4 && expandAliases(entry.category).includes(token))) {
    score += 1;
  }

  return score;
};

const getTopEntries = (query, limit = 3) => {
  const tokens = tokenize(query);
  if (!tokens.length) {
    return [];
  }

  return knowledgeBase
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
};

const domainLockResponse = () => ({
  answer:
    'I can only answer about RCB, IPL, players, matches, standings, news, and this website pages. Ask me something in that scope.',
  citations: [
    { title: 'Roster', route: '/roster' },
    { title: 'Schedule', route: '/schedule' },
    { title: 'News', route: '/news' },
  ],
  mode: 'local',
});

const buildQuickAnswer = (query) => {
  const q = expandAliases(query);
  if (q.includes('next match') || q.includes('upcoming match')) {
    const next = upcomingMatches[0];
    if (next) {
      return `RCB's next match is against ${next.opponent} on ${next.date} at ${next.time} IST, venue: ${next.venue}.`;
    }
  }

  if (q.includes('captain')) {
    const captain = players.find((player) => player.isCaptain);
    if (captain) {
      return `${captain.name} is marked as captain in the current website squad data.`;
    }
  }

  if (q.includes('points table') || q.includes('standings')) {
    const top3 = [...pointsTable].slice(0, 3).map((row) => `${row.team} (${row.pts} pts, NRR ${row.nrr})`);
    if (top3.length) {
      return `Top teams right now: ${top3.join('; ')}.`;
    }
  }

  return null;
};

const findPlayerByName = (query) => {
  const q = expandAliases(query);
  return players.find((player) => {
    const fullName = normalize(player.name);
    const parts = fullName.split(' ').filter(Boolean);
    if (q.includes(fullName)) {
      return true;
    }
    return parts.length >= 2 && q.includes(`${parts[0]} ${parts[parts.length - 1]}`);
  });
};

const buildPlayerAnswer = (query) => {
  const player = findPlayerByName(query);
  if (!player) {
    return null;
  }

  return {
    answer: `${player.name} (${player.role}) from ${player.country}. Matches: ${player.stats?.matches ?? 0}, Runs: ${player.stats?.runs ?? 0}, Wickets: ${player.stats?.wickets ?? 0}. Jersey: ${player.jerseyNo}.`,
    citations: [{ title: player.name, route: '/roster' }],
    mode: 'local',
  };
};

const buildWebsiteAnswer = (query) => {
  const q = expandAliases(query);
  const matched = WEBSITE_ROUTE_HINTS.find((hint) => q.includes(hint.key));
  if (!matched) {
    return null;
  }

  const pageEntry = knowledgeBase.find(
    (entry) => entry.category === 'website' && entry.sourceRoute === matched.route,
  );

  if (!pageEntry) {
    return null;
  }

  return {
    answer: pageEntry.content,
    citations: [{ title: pageEntry.title, route: matched.route }],
    mode: 'local',
  };
};

const localAnswer = (message) => {
  if (!isDomainAllowed(message)) {
    return domainLockResponse();
  }

  const playerResponse = buildPlayerAnswer(message);
  if (playerResponse) {
    return playerResponse;
  }

  const websiteResponse = buildWebsiteAnswer(message);
  if (websiteResponse) {
    return websiteResponse;
  }

  const quick = buildQuickAnswer(message);
  if (quick) {
    return {
      answer: quick,
      citations: [{ title: 'Upcoming Match', route: '/schedule' }],
      mode: 'local',
    };
  }

  const topEntries = getTopEntries(message, 3);
  if (!topEntries.length) {
    return {
      answer:
        "I could not find an exact answer from website data yet. Try asking about players, next match, schedule, standings, stats, or latest news.",
      citations: [
        { title: 'Roster', route: '/roster' },
        { title: 'Schedule', route: '/schedule' },
        { title: 'News', route: '/news' },
      ],
      mode: 'local',
    };
  }

  const answerLines = topEntries.map((entry, index) => `${index + 1}. ${entry.title}: ${entry.content.slice(0, 220)}.`);

  return {
    answer: `Here is what I found from the website:\n${answerLines.join('\n')}`,
    citations: topEntries.map((entry) => ({ title: entry.title, route: entry.sourceRoute })),
    mode: 'local',
  };
};

const getOpenAIText = (data) => {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const fromOutput = Array.isArray(data?.output)
    ? data.output
        .flatMap((item) => item?.content || [])
        .filter((part) => part?.type === 'output_text' && typeof part.text === 'string')
        .map((part) => part.text)
        .join('\n')
        .trim()
    : '';

  if (fromOutput) {
    return fromOutput;
  }

  return '';
};

const askOpenAI = async ({ message, history, contextEntries, openAiKey }) => {
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const contextBlock = contextEntries
    .map((entry, index) => `${index + 1}. ${entry.title} (${entry.category}) -> ${entry.content}`)
    .join('\n');

  const historyBlock = history
    .slice(-8)
    .map((item) => `${item.role.toUpperCase()}: ${item.text}`)
    .join('\n');

  const systemPrompt = [
    'You are PlayBold Assistant for an RCB IPL fan website.',
    'Allowed scope only: RCB, IPL, cricket players, matches, standings, stats, news, and website navigation.',
    'If query is outside scope, refuse politely in one line and ask an in-scope question.',
    'Use only the provided context data; do not invent unknown facts.',
    'Keep answer concise and clear (2-5 lines).',
  ].join(' ');

  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/responses',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_output_tokens: 280,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: systemPrompt }],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `WEBSITE_CONTEXT:\n${contextBlock || 'No matching context entries.'}\n\nCHAT_HISTORY:\n${historyBlock || 'No prior history.'}\n\nUSER_QUESTION:\n${message}`,
              },
            ],
          },
        ],
      }),
    },
    15000,
  );

  if (!response.ok) {
    throw new Error(`OpenAI API failed with status ${response.status}`);
  }

  const data = await response.json();
  const answer = getOpenAIText(data);
  if (!answer) {
    throw new Error('OpenAI response did not include text output');
  }

  return {
    answer,
    citations: contextEntries.slice(0, 3).map((entry) => ({ title: entry.title, route: entry.sourceRoute })),
    mode: 'openai',
  };
};

const fetchWithTimeout = async (url, options, timeoutMs = 12000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

export const askWebsiteAgent = async ({ message, history = [] }) => {
  if (!isDomainAllowed(message)) {
    return domainLockResponse();
  }

  const apiUrl = import.meta.env.VITE_CHAT_API_URL;
  const mode = (import.meta.env.VITE_CHAT_AGENT_MODE || (apiUrl ? 'hybrid' : 'local')).toLowerCase();
  const apiKey = import.meta.env.VITE_CHAT_API_KEY;
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const contextEntries = getTopEntries(message, 6);

  if (!apiUrl && openAiKey && mode !== 'local') {
    try {
      return await askOpenAI({
        message,
        history,
        contextEntries,
        openAiKey,
      });
    } catch {
      // Fall through to local answer if direct OpenAI call fails.
    }
  }

  if (apiUrl && mode !== 'local') {
    try {
      const systemPrompt =
        'You are an RCB website assistant. Allowed scope only: RCB, IPL, cricket players, matches, standings, stats, news, and website navigation. Answer only using provided context, and if unavailable say it is not present in website data.';

      const response = await fetchWithTimeout(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          message,
          history,
          contextEntries,
          systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }

      const data = await response.json();
      const answer = data?.answer || data?.outputText || data?.response || data?.message;

      if (answer) {
        return {
          answer,
          citations: Array.isArray(data.citations) ? data.citations : [],
          mode: 'api',
        };
      }
    } catch {
      // If remote mode fails, gracefully fall back to local knowledge answers.
    }
  }

  return localAnswer(message);
};
