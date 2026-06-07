import { escapeHtml } from "./shared-components.js";

export function renderHostLobby(roomCode, players) {
  const isReady = roomCode !== null;
  
  return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Tạo phòng Local</h2>
            <p>Mời mọi người vào phòng bằng mã bên dưới.</p>
          </div>
        </div>
        
        <div class="summary-card" style="text-align: center; padding: 32px 18px;">
          ${isReady 
            ? `
              <p class="muted" style="margin-bottom: 8px;">Mã phòng của bạn</p>
              <h1 style="font-size: 3.5rem; letter-spacing: 0.1em; color: #fff;">${escapeHtml(roomCode)}</h1>
              <p class="helper" style="margin-top: 12px; color: var(--accent-3);">✅ Đang chờ người chơi kết nối...</p>
            ` 
            : `
              <div style="padding: 20px;">
                <p>Đang tạo phòng...</p>
              </div>
            `}
        </div>

        <div class="footer-actions">
          <button class="btn btn-primary" data-action="host-lobby-start" ${players.length < 5 ? "disabled title='Cần ít nhất 5 người'" : ""}>
            Đi tới Thiết lập (${players.length} người)
          </button>
          <button class="btn btn-ghost" data-action="nav-home">Hủy & Quay lại</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Người chơi đã tham gia (${players.length}/15)</h2>
            <p>Người chơi sẽ xuất hiện ở đây khi họ nhập mã phòng.</p>
          </div>
        </div>
        
        ${players.length === 0 
          ? `<div class="empty-state">Chưa có ai tham gia.</div>` 
          : `
            <div class="player-list">
              ${players.map((p, index) => `
                <div class="vote-row">
                  <div class="player-meta">
                    <strong>${index + 1}. ${escapeHtml(p.name)}</strong>
                  </div>
                  <span class="badge" style="background: rgba(34, 197, 94, 0.15); color: #bef7cb;">Đã kết nối</span>
                </div>
              `).join("")}
            </div>
          `
        }
      </article>
    </section>
  `;
}
