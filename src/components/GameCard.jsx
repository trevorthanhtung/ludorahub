import { Users, Clock, Wifi, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

export default function GameCard({ game }) {
  const { lang } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
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
          
          {/* Nhãn phân loại */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '4px' }}>
            {game.categories && game.categories.includes('local-wifi') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
                <Wifi size={16} /> <span style={{ fontWeight: 600 }}>Local WiFi</span>
              </div>
            )}
            {game.categories && game.categories.includes('small-group') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)' }}>
                <Users size={16} /> <span style={{ fontWeight: 600 }}>{lang === 'vi' ? '2–4 người' : '2-4 players'}</span>
              </div>
            )}
            {game.categories && game.categories.includes('party') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-pink)' }}>
                <Users size={16} /> <span style={{ fontWeight: 600 }}>{lang === 'vi' ? '5+ người' : '5+ players'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.div variants={item} style={{ height: '100%' }}>
        {game.comingSoon ? (
          <div onClick={() => setShowModal(true)} style={{ display: 'block', height: '100%' }}>
            <CardContent />
          </div>
        ) : (
          <Link to={`/game/${game.id}`} style={{ display: 'block', height: '100%' }}>
            <CardContent />
          </Link>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div 
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }} 
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                padding: '40px 30px', borderRadius: '32px', maxWidth: '420px', width: '100%',
                textAlign: 'center', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ fontSize: '4.5rem', marginBottom: '20px', textShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>🚧</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', background: 'var(--btn-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {lang === 'vi' ? 'Sắp ra mắt' : 'Coming Soon'}
              </h2>
              <p style={{ color: 'var(--text-subtext)', marginBottom: '32px', lineHeight: 1.6, fontSize: '1.1rem' }}>
                {lang === 'vi' 
                  ? `${game.title} đang được phát triển và sẽ sớm xuất hiện trên PlayNest. Hãy quay lại trong thời gian tới.` 
                  : `${game.title} is currently under development and will be available on PlayNest soon. Please check back later.`}
              </p>
              <button 
                onClick={() => setShowModal(false)}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '16px' }}
              >
                {lang === 'vi' ? 'Khám phá trò khác' : 'Explore other games'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
