import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Sun, Moon, Globe } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Navigation() {
  const { theme, toggleTheme, lang, toggleLang, searchQuery, setSearchQuery } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Đóng Menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [settingsRef]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className="nav-container" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      margin: '20px auto',
      width: 'calc(100% - 80px)',
      maxWidth: '1300px',
      background: 'var(--nav-bg, var(--glass-bg))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--nav-border, var(--glass-border))',
      borderRadius: '24px',
      position: 'sticky',
      top: '20px',
      zIndex: 50,
      boxShadow: '0 4px 30px rgba(0,0,0,0.05)'
    }}>
      {/* Logo (Left, flex: 1) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <motion.div whileHover={{ rotate: 5, scale: 1.1 }}>
            <img src="/logo.webp" alt="Ludora Hub Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '10px' }} />
          </motion.div>
          <h1 className="nav-logo-text" style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.5px' }}>
            Play<span style={{ color: 'var(--accent-blue)' }}>Nest</span>
          </h1>
        </a>
      </div>

      {/* Search (Center) */}
      <div className="nav-search-wrapper" style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--glass-bg)',
        padding: '10px 20px',
        borderRadius: '30px',
        width: '100%',
        maxWidth: '350px'
      }}>
        <Search size={18} color="var(--text-subtext)" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={lang === 'vi' ? "Tìm kiếm trò chơi..." : "Search games..."}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-title)',
            marginLeft: '12px',
            width: '100%',
            fontFamily: 'inherit',
            fontSize: '0.95rem'
          }}
        />
      </div>

      {/* Icons (Right, flex: 1) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', position: 'relative' }} ref={settingsRef}>
        
        {/* Settings Button */}
        <motion.button 
          onClick={() => setShowSettings(!showSettings)}
          whileHover={{ scale: 1.1, color: 'var(--accent-blue)' }}
          whileTap={{ scale: 0.95 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-title)' }}
        >
          <Settings size={24} />
        </motion.button>
        
        {/* Settings Dropdown */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                background: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '220px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 100
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', marginBottom: '4px', color: 'var(--text-title)' }}>
                {lang === 'vi' ? 'Cài đặt' : 'Settings'}
              </h3>
              
              {/* Theme Toggle */}
              <div 
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px', borderRadius: '8px', background: 'var(--glass-bg)' }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-body)' }}>
                  {lang === 'vi' ? 'Giao diện' : 'Theme'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', color: theme === 'dark' ? 'var(--accent-purple)' : 'var(--accent-yellow)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    {theme === 'dark' ? (lang === 'vi' ? 'TỐI' : 'DARK') : (lang === 'vi' ? 'SÁNG' : 'LIGHT')}
                  </span>
                </div>
              </div>

              {/* Lang Toggle */}
              <div 
                onClick={toggleLang}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px', borderRadius: '8px', background: 'var(--glass-bg)' }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-body)' }}>
                  {lang === 'vi' ? 'Ngôn ngữ' : 'Language'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-cyan)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{lang.toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
