export function renderHome(gameState) {
  return `
    <section class="screen">
      <div class="hero">
        <div class="eyebrow">🌙 Offline GM Companion</div>
        <h1>Ma Sói Offline</h1>
        <p>1 quản trò cầm 1 máy để chia vai, điều phối phase và lưu tiến độ cho nhóm 5-15 người.</p>

        <div class="button-grid">
          <button class="btn btn-primary" data-action="home-new">Tạo ván mới</button>
          ${
            gameState.storage.hasSavedGame
              ? '<button class="btn btn-secondary" data-action="home-continue">Tiếp tục ván cũ</button>'
              : ""
          }
          <button class="btn btn-ghost" data-action="home-howto">Cách chơi</button>
          <button class="btn btn-ghost" data-action="hub-back">Quay lại Ludora Hub</button>
        </div>
      </div>
    </section>
  `;
}

export function renderHowTo() {
  return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Cách chơi nhanh</h2>
            <p>Bản này dành cho 1 quản trò dùng chung 1 điện thoại hoặc laptop.</p>
          </div>
        </div>
        <div class="info-list">
          <div class="highlight">1. Tạo ván mới, nhập 5-15 người chơi và chỉnh preset nếu cần.</div>
          <div class="highlight">2. Chia vai, lần lượt đưa máy cho từng người xem vai riêng của mình.</div>
          <div class="highlight">3. Sau khi chia xong, quản trò dùng màn hình GM để đi phase, đánh dấu chết/sống và ghi chú.</div>
          <div class="highlight">4. Game tự kiểm tra thắng thua khi số người sống thay đổi.</div>
        </div>
      </article>
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Lưu ý Phase 1</h2>
            <p>Chưa có multiplayer, không có Wi-Fi, không có backend.</p>
          </div>
        </div>
        <div class="info-list">
          <div class="chip">Lưu ván bằng localStorage</div>
          <div class="chip">Không dùng máy riêng cho từng người chơi</div>
          <div class="chip">Quản trò tự điều phối kỹ năng đêm</div>
          <div class="chip">Có replay với setup cũ</div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-primary" data-action="nav-home">Về trang chủ</button>
          <button class="btn btn-secondary" data-action="nav-setup">Đi tới setup</button>
        </div>
      </article>
    </section>
  `;
}
