import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { players } from '../data/players';
import './Roster.css';

const normalizeRole = (role) => {
  const key = String(role || '').trim().toLowerCase();
  if (key.includes('wicket')) return 'Wicketkeeper';
  if (key.includes('all-rounder') || key.includes('all rounder') || key.includes('allrounder')) return 'All-Rounder';
  if (key.includes('bowl')) return 'Bowler';
  return 'Batsman';
};

const ROLE_TABS = ['Batsman', 'Bowler', 'All-Rounder', 'Wicketkeeper'];

function Roster() {
  const [activeRole, setActiveRole] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const normalizedPlayers = players.map((player) => ({
    ...player,
    displayRole: normalizeRole(player.role),
  }));

  const visibleCards = activeRole === 'All'
    ? normalizedPlayers
    : normalizedPlayers.filter((card) => card.displayRole === activeRole);

  return (
    <div className="roster container">
      <div className="page-header">
        <div className="page-badge"><Shield size={14} /> Squad</div>
        <h1 className="page-title">Meet the <span className="text-gradient">Roster</span></h1>
        <p className="page-sub">Organized by role. Click View Profile for complete details.</p>
      </div>

      <div className="roster__filters" role="tablist" aria-label="Roster role filter">
        {['All', ...ROLE_TABS].map((role) => (
          <button
            type="button"
            key={role}
            className={`roster__filter-btn ${activeRole === role ? 'active' : ''}`}
            onClick={() => {
              setActiveRole(role);
              setSelectedPlayer(null);
            }}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="roster__grid">
        {visibleCards.map((card, index) => (
          <article
            key={card.id}
            className="roster-card glass-panel"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <div className="roster-card__media">
              <img
                src={card.image}
                alt={card.name}
                className="roster-card__image"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/480x480/121212/C8102E?text=RCB+Player';
                }}
              />
            </div>

            <div className="roster-card__body">
              <span className="roster-card__tag">{card.displayRole}</span>
              <h3 className="roster-card__title">{card.name}</h3>
              <p className="roster-card__identity">{card.country} | {card.team}</p>

              <div className="roster-card__stats">
                <div className="roster-card__stat">
                  <span className="stat-val">{card.stats.matches}</span>
                  <span className="stat-lbl">Matches</span>
                </div>
                <div className="roster-card__stat">
                  <span className="stat-val">{card.stats.runs}</span>
                  <span className="stat-lbl">Runs</span>
                </div>
                <div className="roster-card__stat">
                  <span className="stat-val">{card.stats.wickets}</span>
                  <span className="stat-lbl">Wickets</span>
                </div>
              </div>

              <button
                type="button"
                className="roster-card__view-btn"
                onClick={() => setSelectedPlayer(card)}
              >
                View Profile
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedPlayer && (
        <div className="player-modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="player-modal glass-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="player-modal__close" onClick={() => setSelectedPlayer(null)}>
              <X size={18} />
            </button>

            <div className="player-modal__top">
              <img
                src={selectedPlayer.image}
                alt={selectedPlayer.name}
                className="player-modal__image"
                onError={(event) => {
                  event.currentTarget.src = 'https://placehold.co/480x480/121212/C8102E?text=RCB+Player';
                }}
              />
              <div>
                <span className="player-modal__role">{selectedPlayer.displayRole}</span>
                <h3 className="player-modal__name">{selectedPlayer.name}</h3>
                <p className="player-modal__identity">{selectedPlayer.country} | {selectedPlayer.team}</p>
              </div>
            </div>

            <p className="player-modal__note">{selectedPlayer.note}</p>
            <p className="player-modal__bio">{selectedPlayer.bio || 'Add player bio in players.js.'}</p>

            <div className="player-modal__stats">
              <div className="player-modal__stat">
                <span className="stat-val">{selectedPlayer.stats.matches}</span>
                <span className="stat-lbl">Matches</span>
              </div>
              <div className="player-modal__stat">
                <span className="stat-val">{selectedPlayer.stats.runs}</span>
                <span className="stat-lbl">Runs</span>
              </div>
              <div className="player-modal__stat">
                <span className="stat-val">{selectedPlayer.stats.wickets}</span>
                <span className="stat-lbl">Wickets</span>
              </div>
            </div>

            <div className="player-modal__actions">
              <a
                href={selectedPlayer.profileUrl || 'https://www.cricbuzz.com/profiles'}
                target="_blank"
                rel="noopener noreferrer"
                className="player-modal__view-more"
              >
                View More
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roster;
