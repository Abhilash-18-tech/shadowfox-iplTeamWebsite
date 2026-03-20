import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Flame } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/roster', label: 'Roster' },
  { path: '/schedule', label: 'Schedule' },
  { path: '/stats', label: 'Stats' },
  { path: '/news', label: 'News' },
  { path: '/fanzone', label: 'Fan Zone' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Left Brand (restored earlier style) */}
        <div className="navbar__brand">
          <NavLink to="/" className="navbar__logo" aria-label="RCB Home">
            <div className="navbar__logo-stack">
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.HQ9AYIAOfZTllPdhGSFRbAAAAA?rs=1&pid=ImgDetMain&o=7&rm=30"
                alt="RCB Logo"
                className="navbar__logo-img"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="navbar__logo-fallback" style={{ display: 'none' }}>
                <span className="navbar__logo-fallback-text">RCB</span>
              </div>
              <span className="navbar__logo-label">PlayBold</span>
            </div>
          </NavLink>

          <div className="navbar__slogan">
            <span className="navbar__slogan-line1">Ee Sala Cup</span>
            <span className="navbar__slogan-line2">
              <span className="navbar__slogan-strike">Namde</span>
              {' '}
              <span className="navbar__slogan-namdu">Namdu</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar__links">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Center Brand */}
        <NavLink to="/" className="navbar__center-brand" aria-label="PlayBold Hub Home">
          <span className="navbar__center-icon" aria-hidden="true">
            <Flame size={14} />
          </span>
          <span className="navbar__center-text">PlayBold Hub</span>
        </NavLink>

        {/* CTA Button */}
        <a
          href="https://www.royalchallengers.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar__cta btn-primary"
        >
          Official Site
        </a>

        {/* Mobile Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} color="#f2f2f2" /> : <Menu size={24} color="#f2f2f2" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <a
          href="https://www.royalchallengers.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary navbar__drawer-cta"
        >
          Official Site
        </a>
      </div>
    </header>
  );
}

export default Navbar;
