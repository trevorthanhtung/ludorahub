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
            <p style={{ marginBottom: '15px' }}>
              Ludora Hub tôn trọng và cam kết bảo vệ quyền riêng tư của người dùng. Hiện tại, nền tảng không yêu cầu người dùng cung cấp các thông tin cá nhân nhạy cảm như họ tên, địa chỉ, số điện thoại hoặc mật khẩu để sử dụng các tính năng cơ bản.
            </p>
            <p style={{ marginBottom: '25px' }}>
              Trong quá trình sử dụng, một số dữ liệu kỹ thuật cơ bản có thể được trình duyệt xử lý nhằm đảm bảo website hoạt động ổn định và mang lại trải nghiệm tốt hơn.
            </p>
            
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>2. Lưu trữ cục bộ (Local Storage)</h3>
            <p style={{ marginBottom: '10px' }}>
              Ludora Hub sử dụng Local Storage trên trình duyệt để lưu một số tùy chọn cá nhân của người dùng, bao gồm:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '15px' }}>
              <li>Ngôn ngữ hiển thị (Tiếng Việt / English)</li>
              <li>Chế độ giao diện (Dark Mode / Light Mode)</li>
              <li>Một số cài đặt hoặc tùy chọn trải nghiệm khác (nếu có)</li>
            </ul>
            <p style={{ marginBottom: '25px' }}>
              Dữ liệu này chỉ được lưu trên thiết bị của bạn và không được sử dụng để nhận dạng cá nhân.
            </p>

            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>3. Trải nghiệm an toàn</h3>
            <p style={{ marginBottom: '15px' }}>
              Các trò chơi trên Ludora Hub được phát triển với mục đích mang lại trải nghiệm giải trí lành mạnh dành cho bạn bè, gia đình và các buổi gặp gỡ.
            </p>
            <p style={{ marginBottom: '25px' }}>
              Người dùng tự chịu trách nhiệm đối với các hoạt động hoặc hình thức thử thách ngoài đời thực được áp dụng trong quá trình chơi.
            </p>

            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>4. Thay đổi chính sách</h3>
            <p>
              Ludora Hub có thể cập nhật hoặc điều chỉnh nội dung của chính sách này trong tương lai nhằm phù hợp với các tính năng mới và trải nghiệm người dùng.
            </p>
          </>
        ) : (
          <>
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>1. Data Collection</h3>
            <p style={{ marginBottom: '15px' }}>
              Ludora Hub respects and is committed to protecting user privacy. Currently, the platform does not require users to provide sensitive personal information such as full name, address, phone number, or password to use basic features.
            </p>
            <p style={{ marginBottom: '25px' }}>
              During use, some basic technical data may be processed by the browser to ensure the website operates stably and provides a better experience.
            </p>
            
            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>2. Local Storage</h3>
            <p style={{ marginBottom: '10px' }}>
              Ludora Hub uses Local Storage on your browser to save some personal preferences, including:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '15px' }}>
              <li>Display language (Vietnamese / English)</li>
              <li>Theme mode (Dark Mode / Light Mode)</li>
              <li>Some other settings or experience preferences (if any)</li>
            </ul>
            <p style={{ marginBottom: '25px' }}>
              This data is only stored on your device and is not used for personal identification.
            </p>

            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>3. Safe Experience</h3>
            <p style={{ marginBottom: '15px' }}>
              Games on Ludora Hub are developed with the purpose of providing a wholesome entertainment experience for friends, family, and gatherings.
            </p>
            <p style={{ marginBottom: '25px' }}>
              Users are personally responsible for real-life activities or challenges applied during gameplay.
            </p>

            <h3 style={{ color: 'var(--text-title)', marginBottom: '15px' }}>4. Policy Changes</h3>
            <p>
              Ludora Hub may update or adjust the content of this policy in the future to adapt to new features and user experiences.
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
