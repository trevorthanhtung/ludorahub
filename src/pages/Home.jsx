import { useState } from 'react';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import { useAppContext } from '../context/AppContext';

const MOCK_GAMES = [
  { id: 'true-or-dare', title: 'True or Dare', players: '2-10', time: '∞', tag: 'HOT', categories: ['party', 'pass-and-play'], image: '/tod-banner.webp', externalUrl: '/GAMES/TRUE OR DARE/index.html' },
  { id: 'mafia', title: 'Ma Sói', players: '8-15', time: '30', tag: 'NEW', categories: ['party', 'pass-and-play'], image: '/ww-banner.webp' },
];

const CATEGORY_TABS = [
  { id: 'all', label_vi: 'Tất cả', label_en: 'All Games' },
  { id: 'local-wifi', label_vi: 'Local WiFi', label_en: 'Local WiFi' },
  { id: 'small-group', label_vi: '2–4 người', label_en: '2-4 players' },
  { id: 'party', label_vi: '5+ người', label_en: '5+ players' }
];

export default function Home() {
  const { lang, searchQuery } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('all');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const filteredGames = MOCK_GAMES.filter(game => {
    const matchSearch = game.title.toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchCat = activeCategory === 'all' || game.categories.includes(activeCategory);
    return matchSearch && matchCat;
  });

  const scrollToGames = () => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container" style={{ padding: '0 40px 60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {!searchQuery && (
        <>
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ 
              textAlign: 'center', 
              padding: 'clamp(60px, 10vw, 100px) 0 clamp(40px, 8vw, 80px) 0',
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
              {/* Glow Trái */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '20%',
                transform: 'translate(-50%, -50%)',
                width: '30vw',
                height: '30vw',
                background: '#5B8CFF',
                opacity: 0.2,
                filter: 'blur(100px)',
                zIndex: -1,
                pointerEvents: 'none',
                borderRadius: '50%'
              }}></div>
              {/* Glow Phải */}
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '20%',
                transform: 'translate(50%, -50%)',
                width: '30vw',
                height: '30vw',
                background: '#FF7BCB',
                opacity: 0.15,
                filter: 'blur(100px)',
                zIndex: -1,
                pointerEvents: 'none',
                borderRadius: '50%'
              }}></div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 className="hero-title" style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-1px' }}>
                  Play<span style={{ color: 'var(--accent-blue)' }}>Nest</span>
                </h2>
              <p className="hero-subtitle" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '15px' }}>
                {lang === 'vi' ? 'Một nơi, vô vàn cuộc vui' : 'One place, endless fun'}
              </p>
              <p className="hero-description" style={{ fontSize: '1.2rem', color: 'var(--text-subtext)', letterSpacing: '1px', marginBottom: '40px' }}>
                {lang === 'vi' ? 'Kết nối bạn bè và gia đình qua những trò chơi thú vị' : 'Connect friends and family through exciting games'}
              </p>
              <motion.button 
                onClick={scrollToGames}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(91,140,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'var(--btn-gradient)',
                  color: '#fff',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
              >
                {lang === 'vi' ? 'Khám phá ngay' : 'Explore Now'}
              </motion.button>
            </div>
            </div>
          </motion.section>

          {/* Filter Categories */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: activeCategory === tab.id ? 'none' : '1px solid var(--glass-border)',
                  background: activeCategory === tab.id ? 'var(--btn-gradient)' : 'var(--glass-bg)',
                  color: activeCategory === tab.id ? '#fff' : 'var(--text-body)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeCategory === tab.id ? '0 5px 15px rgba(91,140,255,0.3)' : 'none'
                }}
              >
                {lang === 'vi' ? tab.label_vi : tab.label_en}
              </button>
            ))}
          </div>

          {/* Featured Games */}
          <section id="games-section" style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                {activeCategory === 'all' 
                  ? (lang === 'vi' ? 'Trò Chơi Nổi Bật' : 'Featured Games')
                  : CATEGORY_TABS.find(t => t.id === activeCategory)?.[lang === 'vi' ? 'label_vi' : 'label_en']}
              </h2>
              {activeCategory === 'all' && (
                <button 
                  onClick={() => {
                    const allGamesSection = document.getElementById('all-games-section');
                    if (allGamesSection) {
                      allGamesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--accent-blue)', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {lang === 'vi' ? 'Xem tất cả' : 'View All'}
                </button>
              )}
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '30px' 
              }}
            >
              {filteredGames.slice(0, activeCategory === 'all' ? 4 : filteredGames.length).map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </motion.div>
          </section>
        </>
      )}

      {/* All Games / Search Results */}
      <section id="all-games-section" style={{ paddingTop: searchQuery ? '40px' : '0' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px' }}>
          {searchQuery 
            ? (lang === 'vi' ? `Kết quả tìm kiếm cho "${searchQuery}"` : `Search results for "${searchQuery}"`) 
            : (lang === 'vi' ? 'Tất Cả Trò Chơi' : 'All Games')}
        </h2>
        
        {filteredGames.length === 0 && searchQuery ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-subtext)', fontSize: '1.1rem' }}>
            {lang === 'vi' ? 'Không tìm thấy trò chơi nào phù hợp.' : 'No games found.'}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '30px' 
            }}
          >
            {filteredGames.map(game => (
              <GameCard key={`all-${game.id}`} game={game} />
            ))}
          
          {/* Coming soon placeholder card */}
          <div style={{
            background: 'var(--glass-bg)',
            border: '2px dashed var(--glass-border)',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-subtext)',
            fontSize: '1.1rem',
            fontWeight: 500,
            minHeight: '350px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            {lang === 'vi' ? 'Đang phát triển...' : 'Coming soon...'}
          </div>
        </motion.div>
        )}
      </section>
    </div>
  );
}
