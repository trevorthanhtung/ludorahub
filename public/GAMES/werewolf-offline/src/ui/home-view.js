import { StorageAdapter } from "../storage-adapter.js";

export function renderHome(gameState) {
  return `
    <section class="screen home-screen">
      <div class="ambient-layer parallax-bg">
        <div class="moon"></div>
        <div class="fog-layer fog-1"></div>
        <div class="trees-bg"></div>
        <div class="fog-layer fog-2"></div>
        <div class="trees-fg">
          <svg class="wolf-silhouette" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
            <!-- Simple placeholder wolf howling -->
            <path d="M50 90 L40 60 L45 40 L60 30 L55 50 Z" fill="#0B0A1B"/>
            <path d="M45 40 L40 25 L50 20 L55 35 Z" fill="#0B0A1B"/>
          </svg>
        </div>
        <div class="fireflies">
          ${Array.from({length: 12}).map(() => `
            <div class="firefly" style="
              left: ${Math.random() * 100}%; 
              top: ${Math.random() * 80 + 20}%; 
              animation-delay: ${Math.random() * 5}s;
              animation-duration: ${4 + Math.random() * 3}s;
            "></div>
          `).join('')}
        </div>
      </div>

      <div class="parallax-fg">
        <div class="logo-container">
          <h1 class="logo-title">MA SÓI</h1>
        </div>
        <p class="tagline">"Một đêm. Một bí mật. Không ai đáng tin."</p>

        <div class="button-grid wood-board">
          <button class="btn btn-wood btn-wood-primary" data-action="home-new">Tạo ván mới</button>
          ${
            StorageAdapter.hasSave()
              ? '<button class="btn btn-wood btn-wood-secondary" data-action="home-continue">Tiếp tục ván cũ</button>'
              : ""
          }
          <div class="btn-row">
            <button class="btn btn-wood btn-wood-half" data-action="home-new-host">
              Tạo Local <span class="badge-beta">BETA</span>
            </button>
            <button class="btn btn-wood btn-wood-half" data-action="home-join-client">
              Tham gia Local
            </button>
          </div>
          <button class="btn btn-wood btn-wood-ghost" data-action="home-howto">Hướng dẫn</button>
        </div>

        <div class="info-panel wood-panel">
          <div class="info-item"><strong style="color: #F2C94C;">Offline:</strong> 1 Quản trò điều phối toàn bộ ván chơi.</div>
          <div class="info-item"><strong style="color: #fca5a5;">Local:</strong> Mỗi người sử dụng thiết bị riêng qua Wi-Fi.</div>
          <div class="info-item"><strong style="color: #d8b4e2;">Hỗ trợ:</strong> 5–15 người chơi.</div>
        </div>
      </div>

      <button id="audio-toggle" class="btn-audio" title="Bật/Tắt âm thanh" data-action="toggle-audio">🔈</button>
      <audio id="ambient-audio" loop preload="none">
         <source src="assets/ambient-night.mp3" type="audio/mpeg">
      </audio>
    </section>
  `;
}

export function renderHowTo() {
  return `
    <section class="screen howto-screen">
      <div class="ambient-layer parallax-bg">
        <div class="moon"></div>
        <div class="fog-layer fog-1"></div>
        <div class="trees-bg"></div>
        <div class="fog-layer fog-2"></div>
        <div class="trees-fg">
          <svg class="wolf-silhouette" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet">
            <path d="M50 90 L40 60 L45 40 L60 30 L55 50 Z" fill="#0B0A1B"/>
            <path d="M45 40 L40 25 L50 20 L55 35 Z" fill="#0B0A1B"/>
          </svg>
        </div>
      </div>

      <div class="parallax-fg howto-fg">
        <article class="wood-panel howto-card">
          <div class="howto-header">
            <h2>Cách chơi nhanh</h2>
            <p>Dành cho nhóm 5–15 người. Một người làm Quản trò và dùng thiết bị này để điều phối ván chơi.</p>
          </div>
          
          <div class="howto-steps">
            <div class="howto-step">
              <span class="step-num">1</span>
              <div class="step-content">
                <strong>Tạo ván</strong>
                <p>Chọn số người chơi và preset vai trò phù hợp.</p>
              </div>
            </div>
            <div class="howto-step">
              <span class="step-num">2</span>
              <div class="step-content">
                <strong>Chia vai</strong>
                <p>Lần lượt đưa thiết bị cho từng người xem vai riêng của mình.</p>
              </div>
            </div>
            <div class="howto-step">
              <span class="step-num">3</span>
              <div class="step-content">
                <strong>Điều phối đêm/ngày</strong>
                <p>Quản trò dùng màn hình GM để chuyển phase và ghi nhận hành động.</p>
              </div>
            </div>
            <div class="howto-step">
              <span class="step-num">4</span>
              <div class="step-content">
                <strong>Kết thúc ván</strong>
                <p>Game tự kiểm tra điều kiện thắng/thua khi số người sống thay đổi.</p>
              </div>
            </div>
          </div>

          <div class="howto-tips">
            <strong>Mẹo cho Quản trò</strong>
            <ul>
              <li>Đọc vai chậm, rõ.</li>
              <li>Không để người chơi khác nhìn màn hình khi chia vai.</li>
              <li>Ghi chú các hành động quan trọng trong đêm.</li>
            </ul>
          </div>

          <div class="button-grid wood-board howto-actions">
            <button class="btn btn-wood btn-wood-secondary" data-action="nav-home">Quay lại</button>
          </div>
        </article>
      </div>
    </section>
  `;
}
