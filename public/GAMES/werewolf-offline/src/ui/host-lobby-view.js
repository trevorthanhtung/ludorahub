import { escapeHtml } from "./shared-components.js";

export function renderHostLobby(roomCode, players) {
  const isReady = roomCode !== null;
  const playerCount = players.length;
  
  return `
    <style>
      .ww-host-btn {
        background: #7a1f1f !important;
        color: #fdf5e6 !important;
        border: 1px solid #9c2a2a !important;
        padding: 12px 32px !important;
        font-size: 1.1rem !important;
        border-radius: 8px !important;
        font-family: 'DearPix', serif !important;
        letter-spacing: 1px !important;
        transition: all 0.2s !important;
      }
      .ww-host-btn:hover:not(:disabled) {
        background: #8f2525 !important;
      }
      .ww-host-btn:disabled {
        background: #2c2421 !important;
        color: #5e5048 !important;
        border-color: #3d302b !important;
        cursor: not-allowed !important;
        opacity: 1 !important;
      }
    </style>
    <section class="screen">
      <article class="panel" style="max-width: 540px; margin: 40px auto; background: #1a1210; border: 1px solid #4a2e1b; box-shadow: 0 25px 50px rgba(0,0,0,0.8); border-radius: 16px;">
        <div style="text-align: center; padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid #362214;">
          <h2 style="color: #d4af37; font-family: 'DearPix', serif; font-size: 2.2rem; margin-bottom: 6px;">Tạo phòng Local</h2>
          <p style="color: #a39586; font-size: 0.95rem;">Chia mã phòng cho người chơi cùng mạng Wi-Fi.</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 32px;">
          ${isReady 
            ? `
              <p style="color: #8c7a6b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Mã phòng</p>
              <h1 style="font-family: monospace; font-size: 4.5rem; color: #fdf5e6; text-shadow: 0 0 20px rgba(212, 175, 55, 0.3); margin: 0; letter-spacing: 6px;">${escapeHtml(roomCode)}</h1>
              <p style="margin-top: 12px; color: #5a825a; font-size: 0.95rem;">Đang chờ người chơi tham gia...</p>
            ` 
            : `
              <div style="padding: 40px 20px;">
                <p style="color: #a39586;">Đang tạo phòng...</p>
              </div>
            `}
        </div>

        <div style="background: rgba(0,0,0,0.4); border: 1px solid #2a1a12; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #c7b8a1; font-size: 1.1rem; margin-bottom: 12px; font-family: 'DearPix', serif;">Người chơi đã tham gia (${playerCount}/15)</h3>
          
          ${playerCount === 0 
            ? `<div style="text-align: center; padding: 24px 10px; color: #7a6b5d; font-size: 0.95rem; line-height: 1.6;">
                 Chưa có người chơi nào.<br/>
                 Hãy đưa mã phòng cho người chơi nhập ở màn hình Tham gia Local.
               </div>` 
            : `
              <div style="display: grid; gap: 8px; max-height: 250px; overflow-y: auto;">
                ${players.map((p, index) => `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(212, 175, 55, 0.04); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.1);">
                    <strong style="color: #e8dcc7; font-weight: 500;">${index + 1}. ${escapeHtml(p.name)}</strong>
                    <span style="color: #5a825a; font-size: 0.85rem;">Đã kết nối</span>
                  </div>
                `).join("")}
              </div>
            `
          }
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 16px; border-top: 1px solid #362214;">
          <button class="btn btn-ghost" data-action="nav-home" style="color: #a39586; width: auto; padding: 10px 16px; font-size: 0.95rem;">Quay lại</button>
          
          <div style="text-align: right;">
            <button class="btn ww-host-btn" data-action="host-lobby-start" ${playerCount < 1 ? "disabled" : ""} style="width: auto;">
              Đi tới setup
            </button>
            ${playerCount < 1 ? `<div style="font-size: 0.8rem; color: #7a6b5d; margin-top: 8px;">Cần ít nhất 1 người chơi để setup</div>` : ""}
          </div>
        </div>
      </article>
    </section>
  `;
}
