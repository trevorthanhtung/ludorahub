import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Get initial state from localStorage or default
  const [theme, setTheme] = useState(() => localStorage.getItem('ludorahub_theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('ludorahub_lang') || 'vi');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync Theme to HTML class
  useEffect(() => {
    const htmlRoot = document.documentElement;
    if (theme === 'light') {
      htmlRoot.classList.add('light');
      htmlRoot.classList.remove('dark');
    } else {
      htmlRoot.classList.add('dark');
      htmlRoot.classList.remove('light');
    }
    localStorage.setItem('ludorahub_theme', theme);
  }, [theme]);

  // Sync Lang
  useEffect(() => {
    localStorage.setItem('ludorahub_lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, searchQuery, setSearchQuery }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
