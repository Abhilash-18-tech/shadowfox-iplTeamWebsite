import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Trophy, Zap } from 'lucide-react';
import { newsFeed } from '../data/news';
import { upcomingMatches } from '../data/matches';
import { getLiveNews } from '../services/api';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [newsItems, setNewsItems] = React.useState(newsFeed);
  // Optional: Add match state if you have a real cricket API
  // const [nextMatch, setNextMatch] = React.useState(upcomingMatches[0]);

  const nextMatch = upcomingMatches[0];
  const matchDate = new Date(nextMatch.date);
  let dateStr = nextMatch.date;

  if (!isNaN(matchDate.getTime())) {
    dateStr = matchDate.toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  // Effect to fetch live news
  React.useEffect(() => { 
    const fetchNews = async () => {
      const liveData = await getLiveNews();
      if (liveData && liveData.length > 0) {
        setNewsItems(liveData);
      }
    };
    fetchNews();
  }, []);

  const slides = [
    { type: 'image', url: '/PTI06_04_2025_000042A - Copy.jpg', objectPosition: 'center center' },
    { type: 'video', url: '/WhatsApp Video 2026-03-18 at 18.50.49.mp4', objectPosition: 'center center' },
    { type: 'image', url: '/RCB-Royal-Challengers-Bengaluru-IPL-2025-win - Copy.webp', objectPosition: 'center center' },

  ];

  const homeNewsItems = newsItems.slice(0, 4);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__slideshow">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero__slide ${index === currentSlide ? 'active' : ''}`}
            >
              {slide.type === 'image' ? (
                <img
                  src={slide.url}
                  alt={`Slide ${index}`}
                  className="hero__media"
                  style={{ objectPosition: slide.objectPosition || 'center center' }}
                />
              ) : (
                <video
                  src={slide.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="hero__media hero__media--video"
                  style={{ objectPosition: slide.objectPosition || 'center center' }}
                />
              )}
            </div>
          ))}
          <div className="hero__overlay" aria-hidden="true" />
        </div>

        <div className="hero__content container">
          <div className="hero__badge">
            <Zap size={14} />
            <span>IPL 2026 Season</span>
          </div>
          <h1 className="hero__title">
            Royal Challengers<br />
            <span className="text-gradient">Bengaluru</span>
          </h1>
          <p className="hero__subtitle">
            One team. One vibe. Play Bold.<br />
            The home of every RCB fan — schedules, players, stats, and more.
          </p>
          <div className="hero__cta-group">
           
   
          </div>
        </div>
        {/* Floating stats chips */}
        <div className="hero__chips">
          <div className="hero__chip glass-panel">
            <Trophy size={18} className="hero__chip-icon" />
            <div>
              <span className="hero__chip-val">8661</span>
              <span className="hero__chip-label">Kohli Runs</span>
            </div>
          </div>
          <div className="hero__chip glass-panel">
            <Shield size={18} className="hero__chip-icon" />
            <div>
              <span className="hero__chip-val">#PlayBold</span>
              <span className="hero__chip-label">Fanbase Motto</span>
            </div>
          </div>
        </div>
      </section>

      {/* Squad Banner Section */}
      <section className="squad-banner container">
        <div className="squad-banner__content">
          <img 
            src="/squad-banner.png" 
            alt="RCB 2025 Squad" 
            className="squad-banner__img" 
            onError={(e) => { e.target.src = 'https://placehold.co/1200x600/1E1E1E/C8102E?text=Add+squad-banner.png+to+public+folder'; }}
          />
          <div className="squad-banner__overlay">
            <Link to="/roster" className="btn-primary squad-banner__btn">
              See Full Squad <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Next Match Banner */}
      <section className="next-match container">
        <div className="next-match__card glass-panel">
          <div className="next-match__label">
            <Zap size={14} />
            Next Match
          </div>
          <div className="next-match__teams">
            <div className="next-match__team">
              <div className="next-match__logo rcb-logo">
                <img
                  src="https://tse1.mm.bing.net/th/id/OIP.HQ9AYIAOfZTllPdhGSFRbAAAAA?rs=1&pid=ImgDetMain&o=7&rm=30"
                  alt="RCB"
                  className="next-match__logo-img--rcb"
                />
              </div>
              <span>Royal Challengers Bengaluru</span>
            </div>
            <div className="next-match__vs">VS</div>
            <div className="next-match__team">
              <div className="next-match__logo">
                <img src={nextMatch.opponentLogo} alt={nextMatch.opponent} />
              </div>
              <span>{nextMatch.opponent}</span>
            </div>
          </div>
          <div className="next-match__meta">
            <span>📅 {dateStr}</span>
            <span>⏰ {nextMatch.time} IST</span>
            <span>📍 {nextMatch.venue}</span>
          </div>
          <Link to="/schedule" className="btn-primary next-match__btn">
            Full Schedule <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Latest News */}
      <section className="news-section container">
        <div className="section-header">
          <h2 className="section-title">Latest <span className="text-gradient">News</span></h2>
          <p className="section-sub">Stay updated with everything Red & Gold</p>
        </div>
        <div className="news-grid">
          {homeNewsItems.map((article) => (
            <div key={article.id} className="news-card glass-panel">
              <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="news-card__image-wrap">
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="news-card__image"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x220/1E1E1E/C8102E?text=RCB+News'; }}
                  />
                  <span className={`news-card__cat news-cat--${(article.category || 'News').toLowerCase().replace(' ', '-')}`}>
                    {article.category || 'Update'}
                  </span>
                </div>
                <div className="news-card__body">
                  <p className="news-card__date">{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <h3 className="news-card__title">{article.headline}</h3>
                  <p className="news-card__summary">{article.summary ? article.summary.substring(0, 100) + '...' : ''}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
        <div className="news-section__actions">
          <Link to="/news" className="btn-secondary">
            View More <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
