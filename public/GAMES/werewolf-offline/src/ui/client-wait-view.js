import { escapeHtml } from "./shared-components.js";

export function renderClientWait(clientStatus) {
  const roomCode = clientStatus?.roomCode || "???";
  return `
    <section class="screen" style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
      <article class="panel" style="max-width: 400px; text-align: center; padding: 40px 20px;">
        <div class="role-icon" style="font-size: 4rem; animation: pulse 2s infinite;">⏳</div>
        <h2 style="margin-top: 16px;">Đã vào phòng ${escapeHtml(roomCode)}</h2>
        <p class="muted" style="margin-top: 12px; line-height: 1.5;">Vui lòng đợi Quản trò thiết lập ván chơi và chia vai...</p>
        <div class="divider" style="margin: 20px 0;"></div>
        <p class="helper">Không tắt trình duyệt hoặc tải lại trang.</p>
        <div style="margin-top: 20px;">
          <button class="btn btn-ghost" data-action="client-disconnect">Thoát phòng</button>
        </div>
      </article>

      ${clientStatus?.error ? `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; padding: 20px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
        <h2 style="color: #fca5a5; margin-bottom: 8px;">Mất kết nối</h2>
        <p style="color: #ddd; margin-bottom: 24px;">${escapeHtml(clientStatus.error)}</p>
        <button class="btn btn-primary" data-action="client-reconnect-submit" ${clientStatus.isReconnecting ? 'disabled' : ''}>
          ${clientStatus.isReconnecting ? 'Đang thử lại...' : 'Thử kết nối lại'}
        </button>
        <button class="btn btn-ghost" data-action="client-disconnect" style="margin-top: 16px;">Thoát</button>
      </div>
      ` : ''}
    </section>
  `;
}
