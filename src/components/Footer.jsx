import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Home, Info, Shield, Mail, Heart, X } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function Footer() {
  const { lang } = useAppContext();
  const [showDonate, setShowDonate] = useState(false);

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
      borderTop: '1px solid var(--nav-border, var(--glass-border))',
      padding: '40px 20px',
      marginTop: '80px',
      background: 'var(--nav-bg, var(--glass-bg))',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      textAlign: 'center',
      color: 'var(--text-subtext)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} style={iconStyle}>
            <Home size={18} /> {lang === 'vi' ? 'Trang chủ' : 'Hub'}
          </motion.div>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} style={iconStyle}>
            <Info size={18} /> {lang === 'vi' ? 'Giới thiệu' : 'About'}
          </motion.div>
        </Link>
        <Link to="/privacy" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} style={iconStyle}>
            <Shield size={18} /> {lang === 'vi' ? 'Bảo mật' : 'Privacy'}
          </motion.div>
        </Link>
        <motion.a whileHover={{ scale: 1.05, color: 'var(--accent-blue)' }} href="mailto:trevorthanhtung@gmail.com" style={iconStyle}>
          <Mail size={18} /> {lang === 'vi' ? 'Liên hệ' : 'Contact'}
        </motion.a>
        <motion.div onClick={() => setShowDonate(true)} whileHover={{ scale: 1.05, color: 'var(--accent-pink)' }} style={{ ...iconStyle, cursor: 'pointer' }}>
          <Heart size={18} /> {lang === 'vi' ? 'Ủng hộ' : 'Donate'}
        </motion.div>
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
        {lang === 'vi' ? '© 2026 PlayNest • Bảo lưu mọi quyền' : '© 2026 PlayNest • All rights reserved'}
      </p>
      
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-body)' }}>
        {lang === 'vi' ? 'Được phát triển bởi ' : 'Developed by '}
        <a href="https://github.com/trevorthanhtung" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>thanhtungg.</a>
      </p>

      {/* Donate Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showDonate && (
            <div 
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
              }} 
              onClick={() => setShowDonate(false)}
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
                <button 
                  onClick={() => setShowDonate(false)}
                  style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                    borderRadius: '50%', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.2s'
                  }}
                >
                  <X size={20} />
                </button>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', background: 'var(--btn-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: '20px' }}>
                  {lang === 'vi' ? 'Ủng hộ dự án' : 'Support PlayNest'}
                </h2>
                <p style={{ color: 'var(--text-subtext)', marginBottom: '24px', lineHeight: 1.6, fontSize: '1.05rem' }}>
                  {lang === 'vi' 
                    ? 'Mọi sự đóng góp của bạn đều là nguồn động lực lớn để tôi duy trì và phát triển PlayNest!' 
                    : 'Your support is a great motivation for me to maintain and develop PlayNest!'}
                </p>
                
                {/* QR Code Container */}
                <div style={{ 
                  background: '#fff', 
                  padding: '16px', 
                  borderRadius: '20px', 
                  display: 'inline-block',
                  marginBottom: '20px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                  <img 
                    src="https://img.vietqr.io/image/MB-0816158215-compact.png?accountName=TRAN%20THANH%20TUNG" 
                    alt="Donate QR Code" 
                    style={{ width: '100%', maxWidth: '250px', height: 'auto', borderRadius: '12px' }} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{ 
                    display: 'none', 
                    width: '250px', 
                    height: '250px', 
                    background: '#f3f4f6', 
                    borderRadius: '12px',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontWeight: 600
                  }}>
                    Đang cập nhật mã QR...
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-subtext)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {lang === 'vi' ? 'Quét mã QR bằng ứng dụng ngân hàng' : 'Scan QR code with your banking app'}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </footer>
  );
}
