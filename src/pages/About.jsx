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
              Chào mừng bạn đến với <strong>PlayNest</strong> – Tổ ấm của những cuộc vui! 🎮
            </p>
            <p style={{ marginBottom: '20px' }}>
              PlayNest được xây dựng với một mục tiêu duy nhất: trở thành một <strong>HUB (Trung tâm) Minigames</strong> hoàn hảo dành cho các nhóm bạn, gia đình và những buổi party sôi động. Thay vì phải tải hàng tá ứng dụng cồng kềnh, giờ đây mọi người chỉ cần truy cập vào một nền tảng duy nhất để tận hưởng những phút giây giải trí tuyệt vời.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Dự án được phát triển và duy trì bởi <strong>thanhtungg.</strong> với mong muốn mang lại trải nghiệm chơi game mượt mà, giao diện cực kỳ hiện đại và quan trọng nhất là sự gắn kết tiếng cười giữa mọi người.
            </p>
            <p>
              Hãy gọi bạn bè, chọn một trò chơi và để cuộc vui bắt đầu! 🚀
            </p>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '20px' }}>
              Welcome to <strong>PlayNest</strong> – The nest of fun! 🎮
            </p>
            <p style={{ marginBottom: '20px' }}>
              PlayNest was built with a single goal: to become the perfect <strong>Minigames HUB</strong> for friend groups, families, and lively parties. Instead of downloading dozens of heavy apps, everyone can now visit one single platform to enjoy wonderful entertainment moments.
            </p>
            <p style={{ marginBottom: '20px' }}>
              The project is developed and maintained by <strong>thanhtungg.</strong> with the desire to bring smooth gaming experiences, super modern interfaces, and most importantly, connecting laughter among people.
            </p>
            <p>
              Gather your friends, pick a game, and let the fun begin! 🚀
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
