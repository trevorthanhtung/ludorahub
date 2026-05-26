import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function About() {
  const { lang } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-body)' }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '30px', textAlign: 'center' }}>
        {lang === 'vi' ? 'Về PlayNest' : 'About PlayNest'}
      </h1>

      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '24px',
        padding: '40px',
        lineHeight: 1.8,
        fontSize: '1.1rem'
      }}>
        {lang === 'vi' ? (
          <>
            <p style={{ marginBottom: '20px' }}>
              Chào mừng đến với <strong>PlayNest</strong> – Tổ ấm của những cuộc vui! 🎮
            </p>
            <p style={{ marginBottom: '20px' }}>
              PlayNest là một Game Hub / Minigames Hub được tạo ra với mục tiêu mang mọi người đến gần nhau hơn thông qua những trò chơi vui nhộn và mang tính tương tác. Dù là chơi cùng bạn bè, gia đình hay trong những buổi gặp gỡ, party, bạn đều có thể tìm thấy những phút giây giải trí thú vị tại một nơi duy nhất.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Thay vì phải tải nhiều ứng dụng khác nhau, PlayNest tập hợp các minigame trên một nền tảng đơn giản, nhanh chóng và dễ sử dụng, mang đến trải nghiệm mượt mà cùng giao diện hiện đại.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Dự án được phát triển và duy trì bởi <strong>thanhtungg.</strong> với mong muốn tạo ra nhiều hơn một nền tảng trò chơi — đó là nơi lưu giữ tiếng cười, những khoảnh khắc đáng nhớ và sự kết nối giữa mọi người.
            </p>
            <p>
              Hãy chọn trò chơi yêu thích và bắt đầu cuộc vui. 🚀
            </p>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '20px' }}>
              Welcome to <strong>PlayNest</strong> – The nest of fun! 🎮
            </p>
            <p style={{ marginBottom: '20px' }}>
              PlayNest is a Game Hub / Minigames Hub created with the goal of bringing people closer together through fun and interactive games. Whether playing with friends, family, or at gatherings and parties, you can find exciting moments of entertainment all in one place.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Instead of downloading multiple different apps, PlayNest brings together minigames on a simple, fast, and easy-to-use platform, delivering a smooth experience with a modern interface.
            </p>
            <p style={{ marginBottom: '20px' }}>
              The project is developed and maintained by <strong>thanhtungg.</strong> with the desire to create more than just a gaming platform — it's a place to preserve laughter, memorable moments, and human connection.
            </p>
            <p>
              Choose your favorite game and let the fun begin. 🚀
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
