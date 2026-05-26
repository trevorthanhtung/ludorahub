import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';

const MOCK_GAMES = [
  { id: 'g1', title: 'True or Dare', players: '2–8 players', time: '5–15 min', rating: '4.9', tag: 'HOT', externalUrl: '/GAMES/TRUE OR DARE/BẠN CÓ DÁM CHƠI.html' }
];

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div style={{ padding: '0 40px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        style={{ textAlign: 'center', margin: '80px 0 100px 0' }}
      >
        <h1 style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
          Play<span style={{ color: 'var(--accent)' }}>Nest</span>
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
          Nơi mọi cuộc vui bắt đầu
        </p>
      </motion.section>

      {/* Featured Games (Horizontal Scroll) */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.5px' }}>
          🔥 Featured Games
        </h2>
        
        {/* Horizontal Scroll Container */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          overflowX: 'auto', 
          padding: '20px 10px 40px 10px',
          scrollSnapType: 'x mandatory',
          margin: '0 -10px'
        }}>
          {MOCK_GAMES.map(game => (
            <div key={`feat-${game.id}`} style={{ minWidth: '320px', scrollSnapAlign: 'start' }}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>

      {/* All Games Grid */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '30px', letterSpacing: '-0.5px' }}>
          🎮 All Games
        </h2>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '40px' 
          }}
        >
          {MOCK_GAMES.map(game => (
            <GameCard key={`all-${game.id}`} game={game} />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
