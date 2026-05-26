// Cập nhật lại file để sửa lỗi HMR của Vite
import { Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function GameCard({ game }) {
  const { lang } = useAppContext();
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const CardContent = () => (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        y: -8, 
        boxShadow: '0 15px 40px rgba(91,140,255,0.25)' 
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      <div style={{ height: '200px', width: '100%', background: '#1f2937', position: 'relative' }}>
        {game.image ? (
          <img src={game.image} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1f2937, #374151)' }}>
            <span style={{ fontSize: '3rem', opacity: 0.4, fontWeight: 800 }}>{game.title.charAt(0)}</span>
          </div>
        )}
        
        {game.tag && (
          <div style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            background: game.tag === 'HOT' ? 'var(--btn-gradient)' : 'var(--accent-pink)', 
            color: '#fff', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: 800,
            letterSpacing: '1px'
          }}>
            {game.tag}
          </div>
        )}
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>{game.title}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', fontSize: '0.9rem', color: 'var(--text-subtext)', fontWeight: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} /> <span>{game.players} {lang === 'vi' ? 'người' : 'players'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} /> <span>{game.time} {lang === 'vi' ? 'phút' : 'min'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div variants={item} style={{ height: '100%' }}>
      <Link to={`/game/${game.id}`} style={{ display: 'block', height: '100%' }}>
        <CardContent />
      </Link>
    </motion.div>
  );
}
