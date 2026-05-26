import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameDetail() {
  const { id } = useParams();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}
    >
      <Link to="/" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: 'var(--text-secondary)', 
        marginBottom: '40px',
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
        padding: '60px',
        textAlign: 'center',
        backdropFilter: 'blur(20px)'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>Game Player</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px' }}>
          Đang chuẩn bị khởi chạy game: <strong style={{ color: 'var(--accent)' }}>{id}</strong>
        </p>
        
        {/* Game Canvas Placeholder */}
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
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
        }}>
          <span style={{ fontSize: '2rem', fontWeight: 700, opacity: 0.3 }}>[ HTML5 Canvas / Iframe area ]</span>
          <p style={{ marginTop: '20px', opacity: 0.5 }}>Trò chơi thực tế sẽ được nhúng vào đây</p>
        </div>
      </div>
    </motion.div>
  );
}
