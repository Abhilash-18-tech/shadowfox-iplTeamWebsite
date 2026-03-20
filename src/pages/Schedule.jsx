import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { upcomingMatches as staticUpcoming, pastResults, pointsTable } from '../data/matches';
import { getLiveMatches } from '../services/api'; 
import './Schedule.css';

      const RCB_LOGO_URL = 'https://tse1.mm.bing.net/th/id/OIP.HQ9AYIAOfZTllPdhGSFRbAAAAA?rs=1&pid=ImgDetMain&o=7&rm=30';
const TeamLogo = ({ logo, name, isRcb = false }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const normalizedLogo = typeof logo === 'string' ? logo.trim() : '';
  const logoSrc = isRcb ? RCB_LOGO_URL : normalizedLogo;
  const isImageLogo = /^https?:\/\//i.test(normalizedLogo);
  const isShortCode = /^[A-Za-z]{2,4}$/.test(normalizedLogo);
  const fallbackText = isShortCode
    ? normalizedLogo.toUpperCase()
    : name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

  if ((isRcb || isImageLogo) && !imageFailed) {
    return (
      <img
        src={logoSrc}
        alt={name}
        className={`match-card__logo-img ${isRcb ? 'is-rcb' : ''}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return <span className={`match-card__logo-fallback ${isRcb ? 'is-rcb' : ''}`}>{fallbackText}</span>;
};

function Schedule() {
  const [tab, setTab] = useState('upcoming');
  const [upcomingMatches, setUpcomingMatches] = useState(staticUpcoming);

  useEffect(() => {
      const fetchMatches = async () => {
        const liveData = await getLiveMatches();
        if (liveData && liveData.length > 0) {
          setUpcomingMatches(liveData);
        }
      };
      fetchMatches();
    }, []);

  return (
    <div className="schedule container">
      <div className="page-header">
        <div className="page-badge"><CalendarDays size={14} /> Schedule</div>
        <h1 className="page-title">Match <span className="text-gradient">Schedule</span></h1>
        <p className="page-sub">IPL 2026 — All RCB fixtures and results</p>
      </div>

      {/* Tabs */}
      <div className="schedule__tabs">
        {['upcoming', 'results', 'standings'].map((t) => (
          <button
            key={t}
            className={`schedule__tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Upcoming Matches */}
      {tab === 'upcoming' && (
        <div className="match-list">
          {upcomingMatches.map((match) => {
            const d = new Date(match.date);
            const dateStr = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            return (
              <div key={match.id} className="match-card glass-panel">
                <div className="match-card__header">
                  <span className={`match-card__home-tag ${match.isHome ? '' : 'away'}`}>
                    {match.isHome ? '🏠 Home' : '✈️ Away'}
                  </span>
                  <span className="match-card__tournament">IPL 2025</span>
                </div>
                <div className="match-card__teams">
                  <div className="match-card__team">
                    <div className="match-card__logo rcb-logo">
                      <TeamLogo name="Royal Challengers Bengaluru" isRcb />
                    </div>
                    <span>Royal Challengers Bengaluru</span>
                  </div>
                  <div className="match-card__vs">VS</div>
                  <div className="match-card__team">
                    <div className="match-card__logo">
                      <TeamLogo logo={match.opponentLogo} name={match.opponent} />
                    </div>
                    <span>{match.opponent}</span>
                  </div>
                </div>
                <div className="match-card__meta">
                  <span><CalendarDays size={14} /> {dateStr}</span>
                  <span><Clock size={14} /> {match.time} IST</span>
                  <span><MapPin size={14} /> {match.venue}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Results */}
      {tab === 'results' && (
        <div className="match-list">
          {pastResults.map((match) => {
            const d = new Date(match.date);
            const dateStr = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
            return (
              <div key={match.id} className="match-card glass-panel">
                <div className="match-card__header">
                  <span className={`result-badge ${match.result === 'WON' ? 'won' : 'lost'}`}>
                    {match.result === 'WON' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {match.result}
                  </span>
                  <span className="match-card__tournament">IPL 2025</span>
                </div>
                <div className="match-card__teams">
                  <div className="match-card__team">
                    <div className="match-card__logo rcb-logo">
                      <TeamLogo name="Royal Challengers Bengaluru" isRcb />
                    </div>
                    <span>Royal Challengers Bengaluru</span>
                  </div>
                  <div className="match-card__vs">VS</div>
                  <div className="match-card__team">
                    <div className="match-card__logo">
                      <TeamLogo logo={match.opponentLogo} name={match.opponent} />
                    </div>
                    <span>{match.opponent}</span>
                  </div>
                </div>
                <div className="match-card__score">
                  <p className="match-score-text">{match.score}</p>
                  <p className="match-margin">{match.margin}</p>
                </div>
                <div className="match-card__meta">
                  <span><CalendarDays size={14} /> {dateStr}</span>
                  <span><MapPin size={14} /> {match.venue}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Points Table */}
      {tab === 'standings' && (
        <div className="standings">
          <div className="standings__header">
            <TrendingUp size={20} className="standings__icon" />
            <h2>Points Table (All Teams — IPL 2026)</h2>
          </div>
          <div className="standings__table-wrap glass-panel">
            <table className="standings__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>L</th>
                  <th>Pts</th>
                  <th>NRR</th>
                </tr>
              </thead>
              <tbody>
                {[...pointsTable]
                  .sort((a, b) => parseInt(b.pts) - parseInt(a.pts) || parseFloat(b.nrr) - parseFloat(a.nrr))
                  .map((row, idx) => (
                    <tr key={row.team} className={row.team.includes('Challengers') ? 'standings__row--rcb' : ''}>
                      <td>{idx + 1}</td>
                      <td className="standings__team-name">{row.team}</td>
                      <td>{row.played}</td>
                      <td>{row.won}</td>
                      <td>{row.lost}</td>
                      <td className="standings__pts">{row.pts}</td>
                      <td className={parseFloat(row.nrr) > 0 ? 'nrr-pos' : 'nrr-neg'}>{row.nrr}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;
