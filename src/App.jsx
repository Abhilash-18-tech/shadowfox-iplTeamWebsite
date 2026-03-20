import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Roster from './pages/Roster';
import Schedule from './pages/Schedule';
import Stats from './pages/Stats';
import News from './pages/News';
import FanZone from './pages/FanZone';
import ChatWidget from './components/chat/ChatWidget';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roster" element={<Roster />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/news" element={<News />} />
            <Route path="/fanzone" element={<FanZone />} />
          </Routes>
        </main>
        <ChatWidget />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
