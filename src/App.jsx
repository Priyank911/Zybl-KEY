import { useState, useEffect } from 'react';
import './App.css';
import Logo from './assets/Logo.png';
import logoblack from './assets/Zybl-black.png';
import About from './components/About';
import Footer from './components/Footer';
import CallToAction from './components/CallToAction';
import HeroAnimation from './components/HeroAnimation';
import ScrollToTop from './components/ScrollToTop';
import Features from './components/Features';
import FAQ from './components/FAQ';
import { initSmoothScrolling, initScrollAnimations } from './utils/scrollUtils';

// Wallet icon for the button
const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 7H5C3.9 7 3 7.9 3 9V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9C21 7.9 20.1 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 15H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 7V5C19 3.9 18.1 3 17 3H7C5.9 3 5 3.9 5 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Add scroll event listener to handle navbar appearance and animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initialize smooth scrolling and animations
    initSmoothScrolling();
    initScrollAnimations();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="main-container">
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="navbar-logo">
          <img src={Logo} alt="Zybl Logo" className="nav-logo" />
          <span className="nav-brand">Zybl</span>
        </div>
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <a href="#features" className="nav-link" onClick={handleLinkClick}>Features</a>
          <a href="#about" className="nav-link" onClick={handleLinkClick}>About</a>
          <a href="#faq" className="nav-link" onClick={handleLinkClick}>FAQ</a>
          <button className="connect-button">
            <WalletIcon />
            Connect Wallet
          </button>
        </div>
        <button className={`mobile-menu-btn ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
      </nav>

      <div className="content-container">
        {/* Hero Section */}
        <div className="hero-section animate-section">
          <HeroAnimation />
          <div className="hero-content">
            <h1 className="hero-title animate-item">End-to-End Security<br />for Blockchain Applications</h1>
            
            <p className="hero-description animate-item">
              Zybl is the next-gen Sybil-resistance layer for Web3.
              <br />
              <b>Real people. Real proofs. Real revenue</b>
            </p>
            
            <div className="hero-buttons animate-item">
              <button className="primary-button">
                <img src={logoblack} alt="Zybl Logo" className="button-logo" />
                Sign in to Zybl
              </button>
              <a href="#about" className="secondary-button">
                About
              </a>
            </div>
            
            <a href="#learn-more" className="learn-more-link animate-item" style={{ animationDelay: "0.4s" }}>
              Learn More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <Features />

        {/* Enhanced About Section Component */}
        <About />

        {/* FAQ Section */}
        <FAQ />

        {/* Call to Action Section */}
        <CallToAction />
      </div>
      
      {/* Footer Component - ensure it's outside the content container but inside main container */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
