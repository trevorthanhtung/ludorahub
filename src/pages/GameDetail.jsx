import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const GAME_INFO = {
  'g1': {
    title: 'True or Dare',
    url: '/GAMES/TRUE OR DARE/BẠN CÓ DÁM CHƠI.html'
  }
};

export default function GameDetail() {
  const { id } = useParams();
  const game = GAME_INFO[id];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', height: '100%' }}
    >
      <Link to="/" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: 'var(--text-secondary)', 
        marginBottom: '20px',
        fontWeight: 600,
        transition: 'color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={20} /> Quay lại Hub
      </Link>
      
      <div style={{ 
        background: 'var(--glass-bg)', 
        border: '1px solid var(--glass-border)', 
        borderRadius: '40px', 
        padding: '30px',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
          {game ? game.title : 'Đang phát triển'}
        </h1>
        
        {/* Game Canvas / Iframe */}
        <div style={{ 
          background: '#05070a', 
          borderRadius: '24px', 
          aspectRatio: '16/9', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          marginTop: '20px'
        }}>
          {game && game.url ? (
            <iframe 
              src={game.url}
              title={game.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          ) : (
            <>
              <span style={{ fontSize: '2rem', fontWeight: 700, opacity: 0.3 }}>[ Trò chơi đang phát triển ]</span>
              <p style={{ marginTop: '20px', opacity: 0.5 }}>Trò chơi thực tế sẽ được nhúng vào đây</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

