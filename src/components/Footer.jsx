import { useAppContext } from '../context/AppContext';
import { Home, Info, Shield, Mail, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const { lang } = useAppContext();

  const iconStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    transition: 'color 0.2s', 
    fontWeight: 600, 
    color: 'var(--text-body)', 
    textDecoration: 'none' 
  };
  
  return (
    <footer style={{
      borderTop: '1px solid var(--nav-border, rgba(255,255,255,0.4))',
      padding: '40px 20px',
      marginTop: '80px',
      background: 'var(--nav-bg, rgba(255,255,255,0.35))',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      textAlign: 'center',
      color: 'var(--text-subtext)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <motion.a whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} href="#" style={iconStyle}>
          <Home size={18} /> Hub
        </motion.a>
        <motion.a whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} href="#" style={iconStyle}>
          <Info size={18} /> About
        </motion.a>
        <motion.a whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} href="#" style={iconStyle}>
          <Shield size={18} /> Privacy
        </motion.a>
        <motion.a whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} href="#" style={iconStyle}>
          <Mail size={18} /> Contact
        </motion.a>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '30px' }}>
        <motion.a whileHover={{ scale: 1.15, color: '#1877F2' }} href="#" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <Facebook size={24} />
        </motion.a>
        <motion.a whileHover={{ scale: 1.15, color: '#FF0000' }} href="#" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <Youtube size={24} />
        </motion.a>
        <motion.a whileHover={{ scale: 1.15, color: '#5865F2' }} href="#" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <MessageCircle size={24} />
        </motion.a>
      </div>

      <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>
        &copy; 2026 PlayNest &bull; All rights reserved
      </p>
      
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-body)' }}>
        {lang === 'vi' ? 'Được phát triển với ❤️ bởi ' : 'Made with ❤️ by '}
        <span style={{ color: 'var(--accent-blue)' }}>PlayNest Team</span>
      </p>
    </footer>
  );
}
