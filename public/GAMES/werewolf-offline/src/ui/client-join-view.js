import { escapeHtml } from "./shared-components.js";

export function renderClientJoin(errorMsg = "") {
  let displayError = errorMsg;
  if (errorMsg) {
    if (errorMsg.includes("name") || errorMsg.includes("Tên")) displayError = "Nhập tên người chơi để tiếp tục.";
    else if (errorMsg.includes("code") || errorMsg.includes("Mã")) displayError = "Nhập mã phòng để tiếp tục.";
    else displayError = "Không tìm thấy phòng. Kiểm tra lại mã hoặc mạng Wi-Fi.";
  }

  return `
    <style>
      .ww-input {
        padding: 14px 16px;
        background: rgba(0,0,0,0.4) !important;
        border: 1px solid #362214 !important;
        color: #fdf5e6 !important;
        border-radius: 8px;
        font-size: 1.05rem;
        outline: none;
        transition: all 0.2s;
        width: 100%;
      }
      .ww-input:focus {
        border-color: #d4af37 !important;
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15) !important;
      }
      .ww-btn-primary {
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
      .ww-btn-primary:hover:not(:disabled) {
        background: #8f2525 !important;
      }
    </style>
    <section class="screen">
      <article class="panel" style="max-width: 480px; margin: 40px auto; background: #1a1210; border: 1px solid #4a2e1b; box-shadow: 0 25px 50px rgba(0,0,0,0.8); border-radius: 16px;">
        <div style="text-align: center; padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid #362214;">
          <h2 style="color: #d4af37; font-family: 'DearPix', serif; font-size: 2.2rem; margin-bottom: 6px;">Tham gia phòng Local</h2>
          <p style="color: #a39586; font-size: 0.95rem;">Nhập mã phòng từ Quản trò và tên của bạn.</p>
        </div>
        
        <form data-action="client-join-submit" style="display: flex; flex-direction: column; gap: 20px;">
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="color: #c7b8a1; font-weight: 500; font-size: 0.95rem;">Mã phòng</span>
            <input type="text" name="roomCode" required placeholder="VD: I18AF" class="ww-input" style="text-transform: uppercase; font-family: monospace; letter-spacing: 2px;" autocomplete="off" />
          </label>
          
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span style="color: #c7b8a1; font-weight: 500; font-size: 0.95rem;">Tên người chơi</span>
            <input type="text" name="playerName" required placeholder="Tên của bạn" class="ww-input" autocomplete="off" maxlength="15" />
          </label>
          
          ${displayError ? `<div style="padding: 12px 16px; background: rgba(122, 31, 31, 0.15); border: 1px solid rgba(122, 31, 31, 0.3); border-radius: 8px; color: #d97777; font-size: 0.9rem; text-align: center;">${escapeHtml(displayError)}</div>` : ""}
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 20px; border-top: 1px solid #362214;">
            <button type="button" class="btn btn-ghost" data-action="nav-home" style="color: #a39586; width: auto; padding: 10px 16px; font-size: 0.95rem;">Quay lại</button>
            <button type="submit" class="btn ww-btn-primary" style="width: auto;">Vào phòng</button>
          </div>
        </form>
      </article>
    </section>
  `;
}
