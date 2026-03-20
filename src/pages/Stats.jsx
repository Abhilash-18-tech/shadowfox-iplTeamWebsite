import React from 'react';
import { BarChart3, Award, Target } from 'lucide-react';
import { players } from '../data/players';
import './Stats.css';

const topBatters = [...players]
  .filter(p => p.stats.runs)
  .sort((a, b) => b.stats.runs - a.stats.runs)
  .slice(0, 5);

const topBowlers = [...players]
  .filter(p => p.stats.wickets)
  .sort((a, b) => b.stats.wickets - a.stats.wickets)
  .slice(0, 5);

const maxRuns = Math.max(...topBatters.map(p => p.stats.runs));
const maxWkts = Math.max(...topBowlers.map(p => p.stats.wickets));

const safeNumber = (value) => (Number.isFinite(value) ? value : 0);
const squadSize = players.length;
const overseasCount = players.filter((p) => p.country !== 'INDIA').length;
const wicketkeeperCount = players.filter((p) => p.role.toLowerCase().includes('wicket')).length;
const allRounderCount = players.filter((p) => p.role.toLowerCase().includes('all-rounder') || p.role.toLowerCase().includes('all rounder')).length;
const totalSquadRuns = players.reduce((sum, p) => sum + safeNumber(p.stats.runs), 0);
const totalSquadWickets = players.reduce((sum, p) => sum + safeNumber(p.stats.wickets), 0);

const teamStats = [
  { label: 'Total Matches', value: '252+', icon: '🏏', sub: 'Franchise history' },
  { label: 'Highest Score', value: '263/5', icon: '🔥', sub: 'vs PWI, 2013' },
  { label: 'Kohli Runs', value: '8,004', icon: '👑', sub: 'All-time top scorer' },
  { label: 'Chahal Wickets', value: '139', icon: '🎯', sub: 'All-time top bowler' },
  { label: 'Home Wins %', value: '58%', icon: '🏠', sub: 'Chinnaswamy fortress' },
  { label: 'Titles Won', value: '1', icon: '🏆', sub: 'IPL 2024 Champions' },
  { label: 'Squad Size', value: `${squadSize}`, icon: '👥', sub: 'Current listed players' },
  { label: 'Overseas Players', value: `${overseasCount}`, icon: '🌍', sub: 'International options' },
  { label: 'Wicketkeepers', value: `${wicketkeeperCount}`, icon: '🧤', sub: 'Specialist keeping options' },
  { label: 'All-Rounders', value: `${allRounderCount}`, icon: '⚖️', sub: 'Balance across departments' },
  { label: 'Squad Runs', value: `${totalSquadRuns.toLocaleString()}`, icon: '📈', sub: 'Total IPL runs in squad' },
  { label: 'Squad Wickets', value: `${totalSquadWickets.toLocaleString()}`, icon: '🎳', sub: 'Total IPL wickets in squad' },
];

function Stats() {
  return (
    <div className="stats container">
      <div className="page-header">
        <div className="page-badge"><BarChart3 size={14} /> Statistics</div>
        <h1 className="page-title">Team <span className="text-gradient">Statistics</span></h1>
        <p className="page-sub">Royal Challengers Bengaluru — IPL Performance Metrics</p>
      </div>

      {/* Team Summary Cards */}
      <section className="stats__summary">
        {teamStats.map((s) => (
          <div key={s.label} className="stats-card glass-panel">
            <span className="stats-card__icon">{s.icon}</span>
            <span className="stats-card__val">{s.value}</span>
            <span className="stats-card__label">{s.label}</span>
            <span className="stats-card__sub">{s.sub}</span>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <div className="stats__charts">
        {/* Top Run Scorers */}
        <div className="bar-chart glass-panel">
          <div className="bar-chart__header">
            <Award size={20} className="chart-icon-bat" />
            <h3>Top Run Scorers <span className="gold-gradient">(RCB All-time)</span></h3>
          </div>
          {topBatters.map((player) => (
            <div key={player.id} className="bar-row">
              <div className="bar-row__label">
                <img
                  src={player.image}
                  alt={player.name}
                  className="bar-row__avatar"
                  onError={(e) => { e.target.src = `https://placehold.co/40x40/1E1E1E/C8102E?text=${player.jerseyNo}`; }}
                />
                <div>
                  <span className="bar-row__name">{player.name}</span>
                  <span className="bar-row__sub">{player.stats.matches} matches</span>
                </div>
              </div>
              <div className="bar-row__bar-wrap">
                <div
                  className="bar-row__bar bar--red"
                  style={{ width: `${(player.stats.runs / maxRuns) * 100}%` }}
                />
              </div>
              <span className="bar-row__val">{player.stats.runs.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Top Wicket Takers */}
        <div className="bar-chart glass-panel">
          <div className="bar-chart__header">
            <Target size={20} className="chart-icon-bowl" />
            <h3>Top Wicket Takers <span className="gold-gradient">(RCB All-time)</span></h3>
          </div>
          {topBowlers.map((player) => (
            <div key={player.id} className="bar-row">
              <div className="bar-row__label">
                <img
                  src={player.image}
                  alt={player.name}
                  className="bar-row__avatar"
                  onError={(e) => { e.target.src = `https://placehold.co/40x40/1E1E1E/C8102E?text=${player.jerseyNo}`; }}
                />
                <div>
                  <span className="bar-row__name">{player.name}</span>
                  <span className="bar-row__sub">{player.stats.matches} matches</span>
                </div>
              </div>
              <div className="bar-row__bar-wrap">
                <div
                  className="bar-row__bar bar--gold"
                  style={{ width: `${(player.stats.wickets / maxWkts) * 100}%` }}
                />
              </div>
              <span className="bar-row__val">{player.stats.wickets}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stats;
