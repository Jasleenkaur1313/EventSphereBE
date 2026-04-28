import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';

// Helper component to apply global styles based on dark mode state
function AppWrapper({ children, isDarkMode }) {
  // The 'dark-mode-active' class name is controlled by global.css variables
  return (
    <div className={`page-wrapper ${isDarkMode ? 'dark-mode-active' : ''}`} id="home">
      {children}
    </div>
  );
}

// Main App component to handle state and simple routing (page switching)
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('auth');
  const [authMessage, setAuthMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const authToken = localStorage.getItem('eventSphereAuthToken');
    const adminFlag = localStorage.getItem('eventSphereIsAdmin') === 'true';
    if (authToken) {
      setIsAuthenticated(true);
      setIsAdmin(adminFlag);
      setCurrentPage('home');
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setCurrentPage('auth');
    }
  }, []);

  const navigate = (page, message = null) => {
    setCurrentPage(page);
    setAuthMessage(message);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('eventSphereAuthToken');
    localStorage.removeItem('eventSphereIsAdmin');
    // Clear cookie consent so banner shows on next login
    document.cookie = 'es_consent=; max-age=0; path=/';
    document.cookie = 'es_analytics=; max-age=0; path=/';
    document.cookie = 'es_preferences=; max-age=0; path=/';
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentPage('auth');
  };

  const handleLoginSuccess = (adminFlag = false) => {
    setIsAuthenticated(true);
    setIsAdmin(adminFlag);
    setCurrentPage('home');
  };

  // Clear message after display
  useEffect(() => {
    if (authMessage) {
      const timer = setTimeout(() => setAuthMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [authMessage]);

  return (
    <AppWrapper isDarkMode={isDarkMode}>
      {authMessage && (
        <div className="fixed top-0 left-0 right-0 z-[1001] bg-red-600 text-white text-center py-3 font-bold shadow-xl animate-pulse">
          {authMessage}
        </div>
      )}

      {currentPage === 'home' && isAuthenticated && (
        <HomePage 
          onNavigate={navigate} 
          onToggleTheme={handleToggleTheme}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      )}
      {currentPage === 'admin' && isAuthenticated && isAdmin && (
        <AdminPage onNavigate={navigate} onLogout={handleLogout} />
      )}
      {currentPage === 'auth' && !isAuthenticated && (
        <AuthPage 
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </AppWrapper>
  );
}
