# shadowfox-iplTeamWebsite

A modern React + Vite fan website for Royal Challengers Bengaluru (RCB), built as an IPL team portal with a bold visual style, match center, player roster, stats, fan interactions, and curated news.

## Live Concept

This project is designed as a complete fan experience website with:
- Hero slideshow with image/video media
- Upcoming fixtures and past results
- Team standings table
- Interactive squad profiles
- Player and team stats dashboards
- RCB-focused news feed with API fallback
- Fan zone polls and comments

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Lucide React icons
- CSS modules by page/component (plain CSS files)
- ESLint 9

## Project Structure

```text
PLAYBOLD HUB/
  public/
    logos/
  src/
    assets/
    components/
      layout/
        Navbar.jsx
        Navbar.css
        Footer.jsx
        Footer.css
    data/
      matches.js
      news.js
      players.js
    pages/
      Home.jsx
      Home.css
      Roster.jsx
      Roster.css
      Schedule.jsx
      Schedule.css
      Stats.jsx
      Stats.css
      News.jsx
      News.css
      FanZone.jsx
      FanZone.css
    services/
      api.js
    App.jsx
    App.css
    main.jsx
    index.css
  package.json
  vite.config.js
  eslint.config.js
```

## Core Features

### 1. Home
- Full-screen hero section with slideshow transitions
- Mixed media support (images + video)
- Next-match spotlight card
- Latest news preview (limited cards) with "View More"

### 2. Roster
- Role-based filtering
- Rich player cards
- Expanded profile modal with bio and external profile link

### 3. Schedule
- Upcoming matches tab
- Results tab with win/loss badges
- Points table tab with sorting by points and NRR
- Team logo handling with image fallback logic

### 4. Stats
- Team summary cards
- Top batting and bowling insights
- Derived metrics from squad dataset

### 5. News
- API-first approach for live updates
- Safe fallback to local static data when API is unavailable

### 6. Fan Zone
- Poll and interaction-focused page
- Fan comment form with required email field

## Data and API Design

Data is split into dedicated modules for maintainability:
- `src/data/players.js` - Squad details, roles, player metadata
- `src/data/matches.js` - Fixtures, results, standings
- `src/data/news.js` - Static fallback news dataset

Service layer:
- `src/services/api.js`
  - `getLiveNews()` for live news retrieval
  - `getLiveMatches()` placeholder/fallback-ready pattern

The UI follows a resilient strategy:
- Use API responses when available
- Fall back to local curated data when API fails

## Getting Started

### Prerequisites

- Node.js 18+ (recommended Node 20+)
- npm 9+

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

By default, Vite starts on `http://localhost:5173`, and auto-switches ports if already in use.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Notes

If using live news APIs, define required keys in a local `.env` file (not committed):

```env
VITE_NEWS_API_KEY=your_key_here
```

Then consume with `import.meta.env.VITE_NEWS_API_KEY` in service code.

## UI and Branding Direction

- RCB-inspired red/gold/black color system via CSS variables
- Fixed top navigation with responsive drawer behavior
- Glassmorphism utility cards for premium visual hierarchy
- Mobile-first responsive behavior across pages

## Accessibility and UX

- Semantic structure and clear headings
- Button and link affordances for key actions
- Lazy image loading where appropriate
- Graceful fallback for failed remote logos/images

## Scripts

From `package.json`:

- `npm run dev` - start Vite dev server
- `npm run build` - create production bundle
- `npm run preview` - preview built app
- `npm run lint` - run ESLint

## Future Improvements

- Integrate stable live cricket data provider
- Add search and sort for roster/news
- Add dark/light theme toggle controls
- Add unit tests for data mappers and components
- Add CI workflow for lint/build checks

## Repository

GitHub: https://github.com/Abhilash-18-tech/shadowfox-iplTeamWebsite

## Author

Abhilash
