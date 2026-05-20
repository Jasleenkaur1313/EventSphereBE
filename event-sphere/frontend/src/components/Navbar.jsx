import React, { useState } from 'react';

export default function Navbar({ onToggleTheme, onOpenCalendar, onLogout, isAdmin, onNavigateAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle link clicks and close the mobile menu
  const handleNavLinkClick = (e, action) => {
    // If the link has a fragment (#), prevent default scrolling and let the browser handle the smooth scroll later
    if (e.target.hash) {
      e.preventDefault();
      // Force smooth scroll to the target section
      document.querySelector(e.target.hash)?.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (action === 'calendar') {
        onOpenCalendar();
    }
    
    setIsMenuOpen(false); // Close menu after click
  };

  return (
    <nav className="navbar">
      <div className="navdiv">
        
        {/* LOGO - Fixed path reference. Updated Fallback SVG to resemble the logo block. */}
        <div className="logo">
          <img 
            src="/images/Logo.jpg" 
            alt="Event Sphere Logo" 
            // Fallback: Use a simple, sized SVG for proper height/width calculation if image is missing
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="65" viewBox="0 0 100 65"><rect width="100" height="65" fill="#DC143C"/><text x="50" y="38" font-family="Arial, sans-serif" font-weight="bold" font-size="20" fill="white" text-anchor="middle">ES</text></svg>'; 
            }} 
          />
        </div>
        
        {/* The theme toggle checkbox is a hidden sibling for App.jsx's CSS hook */}
        <input type="checkbox" id="theme-toggle" onChange={onToggleTheme} className="hidden" />
        
        {/* Menu Toggle for Mobile */}
        <input type="checkbox" id="menu-toggle" checked={isMenuOpen} onChange={() => setIsMenuOpen(!isMenuOpen)} className="hidden" />
        <label htmlFor="menu-toggle" className="menu-icon">☰</label>

        {/* Navigation Links - Structural tweak for alignment consistency */}
        <ul style={{ display: isMenuOpen ? 'flex' : '' }}>
          <li><a href="#home" onClick={handleNavLinkClick}>Home</a></li>
          <li><a href="#about" onClick={handleNavLinkClick}>About</a></li>
          <li><a href="#categories" onClick={handleNavLinkClick}>Categories</a></li>
          <li>
            {/* LABEL acts as a button for the hidden checkbox */}
            <label htmlFor="theme-toggle" className="mode-btn">Toggle Theme</label>
          </li>
          <li>
            <a 
                href="#cal" 
                onClick={(e) => handleNavLinkClick(e, 'calendar')}
            >
                Calendar
            </a>
          </li>
          <li><a href="#contact" onClick={handleNavLinkClick}>Contact us</a></li>
          {isAdmin && (
            <li>
              <a
                onClick={() => { setIsMenuOpen(false); onNavigateAdmin(); }}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Admin
              </a>
            </li>
          )}
          <li>
            <a 
              onClick={onLogout} 
              style={{ cursor: 'pointer' }}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
