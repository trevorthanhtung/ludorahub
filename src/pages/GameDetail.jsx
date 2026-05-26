import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const GAME_INFO = {
  'true-or-dare': {
    title: 'True or Dare',
    url: '/GAMES/TRUE OR DARE/index.html'
  }
};

export default function GameDetail() {
  const { id } = useParams();
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const game = GAME_INFO[id];
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <button onClick={handleExit} style={{ 
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10000,
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: '#fff', 
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 16px',
        borderRadius: '30px',
        fontWeight: 600,
        transition: 'all 0.2s',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1.05)' }}
      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'scale(1)' }}
      >
        <ArrowLeft size={20} /> {lang === 'vi' ? 'Thoát' : 'Exit'}
      </button>
      
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        {game && game.url ? (
          <iframe 
            src={game.url}
            title={game.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-subtext)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, opacity: 0.5 }}>
              {lang === 'vi' ? '[ Trò chơi đang phát triển ]' : '[ Game under development ]'}
            </span>
          </div>
        )}
      </div>

      {/* Custom Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 99999,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '30px',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px', color: 'var(--text-title)' }}>
                {lang === 'vi' ? 'Thoát khỏi trò chơi?' : 'Exit from game?'}
              </h3>
              <p style={{ color: 'var(--text-subtext)', marginBottom: '30px', lineHeight: 1.5 }}>
                {lang === 'vi' 
                  ? 'Bạn có chắc chắn muốn thoát? Tiến trình hiện tại có thể sẽ không được lưu.' 
                  : 'Are you sure you want to exit? Your current progress may not be saved.'}
              </p>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    background: 'transparent',
                    color: 'var(--text-body)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--glass-bg)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {lang === 'vi' ? 'Ở lại' : 'Stay'}
                </button>
                <button 
                  onClick={() => navigate('/')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'var(--btn-gradient)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                >
                  {lang === 'vi' ? 'Thoát' : 'Exit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

