import { useAppContext } from '../context/AppContext';

export default function Footer() {
  const { lang } = useAppContext();

  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      padding: '40px 20px',
      marginTop: '80px',
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      color: 'var(--text-subtext)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>PlayNest Hub</a>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>About</a>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>Privacy Policy</a>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>Contact</a>
      </div>
      <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '8px' }}>&copy; 2026 PlayNest. All rights reserved.</p>
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-body)' }}>
        {lang === 'vi' ? 'Được tạo bởi ' : 'Created by '}
        <a href="https://www.youtube.com/@kat.thanhtungg" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
          thanhtungg.
        </a>
      </p>
    </footer>
  );
}
