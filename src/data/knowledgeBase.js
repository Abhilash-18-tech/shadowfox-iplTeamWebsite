import { players } from './players';
import { upcomingMatches, pastResults, pointsTable } from './matches';
import { newsFeed } from './news';

const safeText = (value) => (value ?? '').toString().trim();

const playerEntries = players.map((player) => ({
  id: `player-${player.id}`,
  title: player.name,
  category: 'player',
  sourceRoute: '/roster',
  content: [
    `Player ${safeText(player.name)} from ${safeText(player.country)}.`,
    `Role: ${safeText(player.role)}.`,
    `Jersey: ${safeText(player.jerseyNo)}.`,
    `Matches: ${safeText(player.stats?.matches)}, Runs: ${safeText(player.stats?.runs)}, Wickets: ${safeText(player.stats?.wickets)}.`,
    safeText(player.bio),
  ].join(' '),
}));

const upcomingMatchEntries = upcomingMatches.map((match) => ({
  id: `upcoming-${match.id}`,
  title: `RCB vs ${match.opponent}`,
  category: 'upcoming-match',
  sourceRoute: '/schedule',
  content: [
    `Upcoming match against ${safeText(match.opponent)}.`,
    `Venue: ${safeText(match.venue)}.`,
    `Date: ${safeText(match.date)}.`,
    `Time: ${safeText(match.time)} IST.`,
    `Home match: ${match.isHome ? 'Yes' : 'No'}.`,
  ].join(' '),
}));

const resultEntries = pastResults.map((match) => ({
  id: `result-${match.id}`,
  title: `RCB result vs ${match.opponent}`,
  category: 'result',
  sourceRoute: '/schedule',
  content: [
    `Result against ${safeText(match.opponent)}: ${safeText(match.result)}.`,
    `Score: ${safeText(match.score)}.`,
    `Margin: ${safeText(match.margin)}.`,
    `Venue: ${safeText(match.venue)}.`,
    `Date: ${safeText(match.date)}.`,
  ].join(' '),
}));

const standingsEntries = pointsTable.map((row) => ({
  id: `standings-${row.team.replace(/\s+/g, '-').toLowerCase()}`,
  title: `${row.team} standings`,
  category: 'standings',
  sourceRoute: '/schedule',
  content: [
    `Team ${safeText(row.team)} in points table.`,
    `Played ${safeText(row.played)}, Won ${safeText(row.won)}, Lost ${safeText(row.lost)}.`,
    `Points ${safeText(row.pts)}, NRR ${safeText(row.nrr)}.`,
  ].join(' '),
}));

const newsEntries = newsFeed.map((item) => ({
  id: `news-${item.id}`,
  title: item.headline,
  category: 'news',
  sourceRoute: '/news',
  content: [
    `News category ${safeText(item.category)}.`,
    `Headline: ${safeText(item.headline)}.`,
    `Date: ${safeText(item.date)}.`,
    `Summary: ${safeText(item.summary)}.`,
  ].join(' '),
}));

const websiteEntries = [
  {
    id: 'site-home',
    title: 'Home page overview',
    category: 'website',
    sourceRoute: '/',
    content:
      'Home page includes a hero slideshow with RCB visuals, next match card, and latest news preview with navigation to full news page.',
  },
  {
    id: 'site-roster',
    title: 'Roster page overview',
    category: 'website',
    sourceRoute: '/roster',
    content:
      'Roster page contains player cards, role filters, and profile details including bio and player statistics.',
  },
  {
    id: 'site-schedule',
    title: 'Schedule page overview',
    category: 'website',
    sourceRoute: '/schedule',
    content:
      'Schedule page has upcoming fixtures, results, and standings tabs with team logos, venue, date, time, and points table stats.',
  },
  {
    id: 'site-stats',
    title: 'Stats page overview',
    category: 'website',
    sourceRoute: '/stats',
    content:
      'Stats page highlights top performers, batting and bowling indicators, and summary team metrics from squad data.',
  },
  {
    id: 'site-news',
    title: 'News page overview',
    category: 'website',
    sourceRoute: '/news',
    content:
      'News page shows latest RCB updates with API-first fetch strategy and local fallback feed when live API is unavailable.',
  },
  {
    id: 'site-fanzone',
    title: 'Fan Zone page overview',
    category: 'website',
    sourceRoute: '/fanzone',
    content:
      'Fan Zone includes fan engagement with polls, comments, and form submissions for community interaction.',
  },
];

export const knowledgeBase = [
  ...playerEntries,
  ...upcomingMatchEntries,
  ...resultEntries,
  ...standingsEntries,
  ...newsEntries,
  ...websiteEntries,
];
