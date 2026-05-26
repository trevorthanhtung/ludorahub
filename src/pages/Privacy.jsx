import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function Privacy() {
  const { lang } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-body)' }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '30px', textAlign: 'center' }}>
        {lang === 'vi' ? 'Quyền Riêng Tư' : 'Privacy Policy'}
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
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>1. Thu thập dữ liệu</h3>
            <p style={{ marginBottom: '20px' }}>
              PlayNest cam kết bảo vệ quyền riêng tư của bạn. Vì bản chất của chúng tôi là một nền tảng trò chơi giải trí cục bộ, <strong>chúng tôi KHÔNG thu thập, lưu trữ hay chia sẻ</strong> bất kỳ thông tin cá nhân nhạy cảm nào (như tên thật, địa chỉ, số điện thoại, mật khẩu) từ người dùng.
            </p>
            
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>2. Lưu trữ cục bộ (Local Storage)</h3>
            <p style={{ marginBottom: '20px' }}>
              Trang web chỉ sử dụng tính năng lưu trữ tạm thời trên trình duyệt của bạn (Local Storage) để ghi nhớ các tùy chọn cá nhân như: Ngôn ngữ (Tiếng Việt/English) và Chế độ giao diện (Dark/Light mode) nhằm mang lại trải nghiệm tiện lợi nhất cho các lần truy cập sau.
            </p>

            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>3. Trải nghiệm an toàn</h3>
            <p>
              Tất cả các trò chơi trên nền tảng PlayNest đều được thiết kế với mục đích giải trí lành mạnh giữa bạn bè và người thân. Vui lòng tự chịu trách nhiệm nếu các bạn áp dụng các hình phạt bên ngoài đời thực (như uống nước, phạt ca hát,...) khi tham gia chơi nhóm.
            </p>
          </>
        ) : (
          <>
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>1. Data Collection</h3>
            <p style={{ marginBottom: '20px' }}>
              PlayNest is committed to protecting your privacy. Since our platform is designed for local entertainment, <strong>we DO NOT collect, store, or share</strong> any sensitive personal information (such as real name, address, phone number, password) from our users.
            </p>
            
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>2. Local Storage</h3>
            <p style={{ marginBottom: '20px' }}>
              The website only uses your browser's temporary storage (Local Storage) to remember personal preferences such as: Language (Vietnamese/English) and Theme mode (Dark/Light mode) to provide the most convenient experience for your subsequent visits.
            </p>

            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>3. Safe Experience</h3>
            <p>
              All games on the PlayNest platform are designed for wholesome entertainment among friends and family. Please take personal responsibility if you apply real-life penalties (like drinking water, singing penalties, etc.) when participating in group games.
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
