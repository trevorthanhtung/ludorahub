export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border)',
      padding: '40px 20px',
      marginTop: '80px',
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>PlayNest Hub</a>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>About</a>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>Privacy Policy</a>
        <a href="#" style={{ transition: 'color 0.2s', fontWeight: 600 }}>Contact</a>
      </div>
      <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>&copy; 2026 PlayNest. All rights reserved.</p>
    </footer>
  );
}
