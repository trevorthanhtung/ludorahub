import { Search, User, Settings, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navigation() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      background: 'rgba(11, 16, 32, 0.6)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <motion.div whileHover={{ rotate: 5, scale: 1.1 }}>
          <img src="/logo.webp" alt="PlayNest Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '10px' }} />
        </motion.div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.5px' }}>
          Play<span style={{ color: 'var(--accent)' }}>Nest</span>
        </h1>
      </Link>

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--glass-bg)',
        padding: '10px 20px',
        borderRadius: '30px',
        width: '350px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)'
      }}>
        <Search size={18} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search for games..." 
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            marginLeft: '12px',
            width: '100%',
            fontFamily: 'inherit',
            fontSize: '0.95rem'
          }}
        />
      </div>

      {/* Icons */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <motion.button 
          whileHover={{ scale: 1.1, color: 'var(--accent)' }}
          whileTap={{ scale: 0.95 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <Settings size={24} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, color: 'var(--accent)' }}
          whileTap={{ scale: 0.95 }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <User size={24} />
        </motion.button>
      </div>
    </nav>
  );
}
