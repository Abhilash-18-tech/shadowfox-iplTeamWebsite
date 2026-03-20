import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { newsFeed } from '../data/news';
import { getLiveNews } from '../services/api'; 
import './News.css';

const categoryColors = {
  'Match Report': { bg: 'rgba(200,16,46,0.18)', color: '#ff6b86', dot: '#C8102E' },
  'Analysis':     { bg: 'rgba(230,176,20,0.15)', color: '#E6B014', dot: '#E6B014' },
  'Team News':    { bg: 'rgba(42,127,192,0.18)', color: '#60b4ff', dot: '#2A7FC0' },
  'RCB Update':   { bg: 'rgba(110,207,157,0.16)', color: '#8aefc0', dot: '#6ecf9d' },
};

const fallbackCategoryStyle = { bg: 'rgba(255,255,255,0.1)', color: '#f0f0f0' };

const formatDate = (dateValue) => {
  if (!dateValue) return 'Date unavailable';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

function News() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsData, setNewsData] = useState(newsFeed);
  const [isLiveData, setIsLiveData] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Loading RCB news...');

  useEffect(() => {
    const fetchNews = async () => {
      setStatusMessage('Loading RCB news...');
      try {
        const liveData = await getLiveNews();
        if (liveData && liveData.length > 0) {
          setNewsData(liveData);
          setIsLiveData(true);
          setStatusMessage('Showing live RCB-only news.');
          return;
        }
        setNewsData(newsFeed);
        setIsLiveData(false);
        setStatusMessage('Live feed unavailable. Showing curated RCB fallback news.');
      } catch {
        setNewsData(newsFeed);
        setIsLiveData(false);
        setStatusMessage('Live feed unavailable. Showing curated RCB fallback news.');
      }
    };
    fetchNews();
  }, []);

  const categories = ['All', ...new Set(newsData.map(a => a.category))];
  const filtered = activeCategory === 'All'
    ? newsData
    : newsData.filter(a => a.category === activeCategory);

  return (
    <div className="news-page container">
      <div className="page-header">
        <div className="page-badge"><Newspaper size={14} /> Media</div>
        <h1 className="page-title">RCB <span className="text-gradient">News</span></h1>
        <p className="page-sub">Latest RCB-only updates, match reports and team news</p>
      </div>

      <p className={`news-page__status ${isLiveData ? 'is-live' : 'is-fallback'}`}>
        {statusMessage}
      </p>

      {/* Category Filter */}
      <div className="news-page__filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`news-page__filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="news-page__grid">
        {/* Featured top story */}
        {filtered.length > 0 && activeCategory === 'All' && (
          <div className="news-page__featured glass-panel">
            <div className="news-page__featured-img-wrap">
              <img
                src={filtered[0].image}
                alt={filtered[0].headline}
                className="news-page__featured-img"
                onError={(e) => { e.target.src = 'https://placehold.co/800x360/1E1E1E/C8102E?text=RCB+News'; }}
              />
              <span
                className="news-page__cat-badge"
                style={{
                  background: categoryColors[filtered[0].category]?.bg || fallbackCategoryStyle.bg,
                  color: categoryColors[filtered[0].category]?.color || fallbackCategoryStyle.color
                }}
              >
                {filtered[0].category}
              </span>
            </div>
            <div className="news-page__featured-body">
              <p className="news-card__date">{formatDate(filtered[0].date)}</p>
              <p className="news-card__source">{filtered[0].source || 'RCB Desk'}</p>
              <h2 className="news-page__featured-title">{filtered[0].headline}</h2>
              <p className="news-page__featured-summary">{filtered[0].summary}</p>
              <a href={filtered[0].url} target="_blank" rel="noopener noreferrer" className="btn-primary news-page__read-btn">
                Read More <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Rest of articles */}
        <div className="news-page__secondary-grid">
          {(activeCategory === 'All' ? filtered.slice(1) : filtered).map((article, index) => (
            <article
              key={article.id}
              className="news-article-card glass-panel"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="news-article__img-wrap">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="news-article__img"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x220/1E1E1E/C8102E?text=RCB'; }}
                />
                <span
                  className="news-page__cat-badge"
                  style={{
                    background: categoryColors[article.category]?.bg || fallbackCategoryStyle.bg,
                    color: categoryColors[article.category]?.color || fallbackCategoryStyle.color
                  }}
                >
                  {article.category}
                </span>
              </div>
              <div className="news-article__body">
                <p className="news-card__date">{formatDate(article.date)}</p>
                <p className="news-card__source">{article.source || 'RCB Desk'}</p>
                <h3 className="news-article__title">{article.headline}</h3>
                <p className="news-article__summary">{article.summary}</p>
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-article__read-link">
                    View Full Story <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
