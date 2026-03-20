import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import './FanZone.css';

const polls = [
  {
    id: 1,
    question: "Who will be RCB's Player of the Tournament in IPL 2025?",
    options: ['Virat Kohli', 'Rajat Patidar', 'Mohammed Siraj', 'Glenn Maxwell'],
    votes: [482, 134, 97, 88],
  },
  {
    id: 2,
    question: "What's your prediction for RCB's final standings in 2025?",
    options: ['Champions 🏆', 'Runners Up', 'Playoffs', 'Won\'t Qualify'],
    votes: [561, 233, 120, 45],
  },
  {
    id: 3,
    question: "Which is RCB's greatest ever season?",
    options: ['IPL 2024 (Champions!)', 'RCB 2016 (Finalists)', 'RCB 2011', 'IPL 2023'],
    votes: [890, 420, 88, 56],
  },
];

const initialComments = [
  { id: 1, user: 'ViratFanatic_18', avatar: '🦁', text: 'Ee sala cup namde! 2025 is our year!', likes: 142, time: '2h ago' },
  { id: 2, user: 'BoldBengaluru', avatar: '🔴', text: "Siraj's spell vs SRH was one for the ages. Pure fire! 🔥", likes: 87, time: '4h ago' },
  { id: 3, user: 'ChinnaswamyRoar', avatar: '👑', text: 'Kohli at home is just different. Absolutely magical to watch.', likes: 65, time: '6h ago' },
  { id: 4, user: 'PlayBoldFan', avatar: '⚡', text: 'Patidar stepping up as captain is amazing. Future of RCB right there.', likes: 54, time: '8h ago' },
];

function PollWidget({ poll }) {
  const [userVote, setUserVote] = useState(null);
  const [votes, setVotes] = useState(poll.votes);
  const total = votes.reduce((a, b) => a + b, 0);

  const handleVote = (idx) => {
    if (userVote !== null) return;
    const updated = [...votes];
    updated[idx]++;
    setVotes(updated);
    setUserVote(idx);
  };

  return (
    <div className="poll glass-panel">
      <p className="poll__question">{poll.question}</p>
      <div className="poll__options">
        {poll.options.map((opt, idx) => {
          const pct = Math.round((votes[idx] / (total + (userVote !== null ? 1 : 0))) * 100);
          return (
            <button
              key={idx}
              className={`poll__option ${userVote !== null ? 'voted' : ''} ${userVote === idx ? 'selected' : ''}`}
              onClick={() => handleVote(idx)}
              disabled={userVote !== null}
            >
              <div className="poll__option-bar" style={{ width: userVote !== null ? `${pct}%` : '0%' }} />
              <span className="poll__option-text">{opt}</span>
              {userVote !== null && (
                <span className="poll__option-pct">{pct}%</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="poll__meta">{total.toLocaleString()} votes · {userVote !== null ? 'Thanks for voting!' : 'Click to vote'}</p>
    </div>
  );
}

function FanZone() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [likedIds, setLikedIds] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !email.trim()) return;
    const comment = {
      id: Date.now(),
      user: userName.trim() || 'Anonymous Fan',
      email: email.trim(),
      avatar: '🏏',
      text: newComment.trim(),
      likes: 0,
      time: 'Just now',
    };
    setComments([comment, ...comments]);
    setNewComment('');
    setEmail('');
  };

  const handleLike = (id) => {
    if (likedIds.includes(id)) return;
    setLikedIds([...likedIds, id]);
    setComments(comments.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  return (
    <div className="fanzone container">
      <div className="page-header">
        <div className="page-badge"><Users size={14} /> Community</div>
        <h1 className="page-title">Fan <span className="text-gradient">Zone</span></h1>
        <p className="page-sub">RCB's Global Community — Play Bold, Think Bold</p>
      </div>

      {/* Social Icons Banner */}
      <div className="fanzone__social-banner glass-panel">
        <p className="fanzone__social-text">Join & follow RCB on social media</p>
        <div className="fanzone__social-links">
          {[
            { label: '𝕏 Twitter', href: 'https://twitter.com/RCBTweets', color: '#1DA1F2' },
            { label: '📷 Instagram', href: 'https://www.instagram.com/royalchallengersbengaluru', color: '#E1306C' },
            { label: '▶️ YouTube', href: 'https://www.youtube.com/royalchallengersbangalore', color: '#FF0000' },
            { label: '🌐 Official', href: 'https://www.royalchallengers.com', color: '#C8102E' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="fanzone__social-chip" style={{ '--chip-color': s.color }}>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Polls Section */}
      <section className="fanzone__section">
        <h2 className="fanzone__section-title">Fan <span className="gold-gradient">Polls</span></h2>
        <div className="polls-grid">
          {polls.map(poll => <PollWidget key={poll.id} poll={poll} />)}
        </div>
      </section>

      {/* Forum / Comments */}
      <section className="fanzone__section">
        <h2 className="fanzone__section-title">Fan <span className="text-gradient">Forum</span></h2>

        {/* Post a Comment */}
        <form className="forum__form glass-panel" onSubmit={handleSubmit}>
          <h3 className="forum__form-title"><MessageSquare size={18} /> Share your thoughts</h3>
          <input
            type="text"
            className="forum__input"
            placeholder="Your name (optional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={30}
          />
          <input
            type="email"
            className="forum__input"
            placeholder="Your email (required)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            required
          />
          <textarea
            className="forum__textarea"
            placeholder="What's on your mind, RCB fan? 🔴⚫"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            maxLength={300}
            required
          />
          <button type="submit" className="btn-primary forum__submit">
            Post <Send size={15} />
          </button>
        </form>

        {/* Comments List */}
        <div className="forum__comments">
          {comments.map((c) => (
            <div key={c.id} className="comment glass-panel">
              <div className="comment__avatar">{c.avatar}</div>
              <div className="comment__body">
                <div className="comment__meta">
                  <span className="comment__user">{c.user}</span>
                  <span className="comment__time">{c.time}</span>
                </div>
                <p className="comment__text">{c.text}</p>
                <button
                  className={`comment__like ${likedIds.includes(c.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(c.id)}
                >
                  <ThumbsUp size={14} /> {c.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FanZone;
