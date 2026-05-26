import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import { useAppContext } from '../context/AppContext';

const MOCK_GAMES = [
  { id: 'g1', title: 'True or Dare', players: '∞', time: '∞', tag: 'HOT', image: '/tod-banner.webp', externalUrl: '/GAMES/TRUE OR DARE/index.html' }
];

export default function Home() {
  const { lang } = useAppContext();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div style={{ padding: '0 40px 60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        style={{ 
          textAlign: 'center', 
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '10px' }}>
            Play<span style={{ color: 'var(--accent-blue)' }}>Nest</span>
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-subtext)', letterSpacing: '1px' }}>
            {lang === 'vi' ? 'Nơi mọi cuộc vui bắt đầu' : 'Where all the fun begins'}
          </p>
        </div>
      </motion.section>

      {/* Featured Games */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            {lang === 'vi' ? 'Trò Chơi Nổi Bật' : 'Featured Games'}
          </h2>
          <button style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--accent-blue)', 
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            {lang === 'vi' ? 'Xem tất cả' : 'View All'}
          </button>
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
          {MOCK_GAMES.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </motion.div>
      </section>

      {/* All Games Grid Placeholder */}
      <section>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px' }}>
          {lang === 'vi' ? 'Tất Cả Trò Chơi' : 'All Games'}
        </h2>
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px dashed var(--glass-border)',
          borderRadius: '20px',
          padding: '60px',
          textAlign: 'center',
          color: 'var(--text-subtext)',
          fontSize: '1.1rem'
        }}>
          {lang === 'vi' ? 'Sắp có thêm nhiều trò chơi mới...' : 'More games coming soon...'}
        </div>
      </section>
    </div>
  );
}
