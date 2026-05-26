import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Home, Info, Shield, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa6';
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
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} style={iconStyle}>
            <Home size={18} /> Hub
          </motion.div>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} style={iconStyle}>
            <Info size={18} /> About
          </motion.div>
        </Link>
        <Link to="/privacy" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} style={iconStyle}>
            <Shield size={18} /> Privacy
          </motion.div>
        </Link>
        <motion.a whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} href="mailto:trevorthanhtung@gmail.com" style={iconStyle}>
          <Mail size={18} /> Contact
        </motion.a>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '30px' }}>
        <motion.a whileHover={{ scale: 1.15, color: '#1877F2' }} title="Facebook" href="https://www.facebook.com/tthanhtung2306/?locale=vi_VN" target="_blank" rel="noreferrer" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <FaFacebook size={24} />
        </motion.a>
        <motion.a whileHover={{ scale: 1.15, color: '#E1306C' }} title="Instagram" href="https://www.instagram.com/_.thanhtungg._/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <FaInstagram size={24} />
        </motion.a>
        <motion.a whileHover={{ scale: 1.15, color: '#FF0000' }} title="YouTube" href="https://www.youtube.com/@kat.thanhtungg" target="_blank" rel="noreferrer" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <FaYoutube size={24} />
        </motion.a>
        <motion.a whileHover={{ scale: 1.15, color: '#000000' }} title="TikTok" href="https://www.tiktok.com/@kat.thanhtungg" target="_blank" rel="noreferrer" style={{ color: 'var(--text-subtext)', transition: 'color 0.2s' }}>
          <FaTiktok size={24} />
        </motion.a>
      </div>

      <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>
        &copy; 2026 PlayNest &bull; All rights reserved
      </p>
      
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-body)' }}>
        {lang === 'vi' ? 'Được phát triển bởi ' : 'Developed by '}
        <a href="https://github.com/trevorthanhtung" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>thanhtungg.</a>
      </p>
    </footer>
  );
}
