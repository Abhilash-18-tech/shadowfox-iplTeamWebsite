import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Twitter, Youtube, Instagram, Facebook, Github, Linkedin } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <Flame size={24} strokeWidth={2} className="footer__logo-icon" />
            <span>Play<strong>Bold</strong></span>
          </div>
          <p className="footer__tagline">
            The #1 fan hub for Royal Challengers Bengaluru. <br />
            Play Bold. Win Bold. Live Red.
          </p>
          <div className="footer__socials">
            <a href="https://twitter.com/RCBTweets" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://www.instagram.com/royalchallengersbengaluru" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://www.youtube.com/royalchallengersbangalore" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={18} /></a>
            <a href="https://www.facebook.com/RoyalChallengersBangalore" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://github.com/Abhilash-18-tech" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/abhilash-jamalla-06ba31322/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Nav Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Explore</h4>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/roster">Roster</NavLink></li>
            <li><NavLink to="/schedule">Schedule</NavLink></li>
            <li><NavLink to="/stats">Statistics</NavLink></li>
            <li><NavLink to="/fanzone">Fan Zone</NavLink></li>
          </ul>
        </div>

        {/* External Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul>
            <li><a href="https://www.royalchallengers.com" target="_blank" rel="noopener noreferrer">Official Website</a></li>
            <li><a href="https://www.iplt20.com" target="_blank" rel="noopener noreferrer">IPLT20.com</a></li>
            <li><a href="https://www.iplt20.com/teams/royal-challengers-bengaluru/squad" target="_blank" rel="noopener noreferrer">Official Squad</a></li>
            <li><a href="https://www.espncricinfo.com" target="_blank" rel="noopener noreferrer">ESPNCricinfo</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2025 PlayBold Hub. A fan-made tribute to Royal Challengers Bengaluru. Not affiliated with BCCI or RCB.</p>
      </div>
    </footer>
  );
}

export default Footer;
