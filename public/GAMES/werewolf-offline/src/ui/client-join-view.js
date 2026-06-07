import { escapeHtml } from "./shared-components.js";

export function renderClientJoin(errorMsg = "") {
  return `
    <section class="screen">
      <article class="panel" style="max-width: 400px; margin: 40px auto;">
        <div class="panel-header">
          <div>
            <h2>Tham gia phòng Local</h2>
            <p>Nhập mã phòng từ Quản trò và tên của bạn.</p>
          </div>
        </div>
        
        <form data-action="client-join-submit" style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
          <label class="field">
            <span>Mã phòng</span>
            <input type="text" name="roomCode" required placeholder="VD: WOLF9" style="text-transform: uppercase;" autocomplete="off" />
          </label>
          
          <label class="field">
            <span>Tên người chơi</span>
            <input type="text" name="playerName" required placeholder="Nhập tên của bạn" autocomplete="off" maxlength="15" />
          </label>
          
          ${errorMsg ? `<div class="validation-error" style="padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">${escapeHtml(errorMsg)}</div>` : ""}
          
          <div class="footer-actions" style="margin-top: 8px;">
            <button type="submit" class="btn btn-primary">Vào phòng</button>
            <button type="button" class="btn btn-ghost" data-action="nav-home">Hủy & Quay lại</button>
          </div>
        </form>
      </article>
    </section>
  `;
}
