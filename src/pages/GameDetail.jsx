import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const GAME_INFO = {
  'g1': {
    title: 'True or Dare',
    url: '/GAMES/TRUE OR DARE/index.html'
  }
};

export default function GameDetail() {
  const { id } = useParams();
  const { lang } = useAppContext();
  const game = GAME_INFO[id];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      style={{ 
        padding: 'clamp(15px, 4vw, 40px)', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Link to="/" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: 'var(--text-subtext)', 
        marginBottom: '20px',
        fontWeight: 600,
        transition: 'color 0.2s',
        alignSelf: 'flex-start'
      }}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-blue)'}
      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-subtext)'}
      >
        <ArrowLeft size={20} /> {lang === 'vi' ? 'Quay lại Hub' : 'Back to Hub'}
      </Link>
      
      <div style={{ 
        background: 'var(--glass-bg)', 
        border: '1px solid var(--glass-border)', 
        borderRadius: 'clamp(20px, 4vw, 40px)', 
        padding: 'clamp(10px, 3vw, 30px)',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <h1 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
          fontWeight: 800, 
          marginBottom: '10px' 
        }}>
          {game ? game.title : (lang === 'vi' ? 'Đang phát triển' : 'Coming Soon')}
        </h1>
        
        {/* Game Canvas / Iframe */}
        <div style={{ 
          background: '#05070a', 
          borderRadius: 'clamp(12px, 3vw, 24px)', 
          width: '100%',
          flex: 1,
          minHeight: 'min(70vh, 600px)',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          marginTop: '15px'
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
              <span style={{ fontSize: '2rem', fontWeight: 700, opacity: 0.3 }}>
                {lang === 'vi' ? '[ Trò chơi đang phát triển ]' : '[ Game under development ]'}
              </span>
              <p style={{ marginTop: '20px', opacity: 0.5 }}>
                {lang === 'vi' ? 'Trò chơi thực tế sẽ được nhúng vào đây' : 'The actual game will be embedded here'}
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

