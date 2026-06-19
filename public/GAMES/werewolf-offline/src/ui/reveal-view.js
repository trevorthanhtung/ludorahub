import { escapeHtml } from "./shared-components.js";

export function renderReveal(gameState, getRoleDefinition) {
  const player = gameState.players[gameState.reveal.currentIndex];
  const role = getRoleDefinition(player.roleId);
  const stage = gameState.reveal.stage; // "handoff" | "ready" | "revealed"
  const total = gameState.players.length;
  const current = gameState.reveal.currentIndex + 1;
  const isLast = current === total;

  // Team color accent
  const teamColor = role.team === "wolf" ? "#C0392B" : role.team === "village" ? "#10B981" : "#F2C94C";

  return `
    <section class="screen rv-screen">
      <div class="rv-wrap">

        <!-- HEADER -->
        <div class="rv-header">
          <span class="rv-badge">Reveal ${current}/${total}</span>
          <h2 class="rv-title">Đưa máy cho ${escapeHtml(player.name)}</h2>
          <p class="rv-subtitle">Chỉ người này được xem màn hình. Che lại trước khi chuyển máy.</p>
        </div>

        <!-- WARNING -->
        <div class="rv-warning">
          Chỉ người đang cầm máy được xem vai này.
        </div>

        <!-- CARD -->
        ${
          stage === "handoff"
            ? `
          <!-- STATE: HANDOFF — waiting to be passed -->
          <div class="rv-card rv-card-locked">
            <div class="rv-card-inner">
              <div class="rv-lock-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="16" width="18" height="14" rx="3" stroke="#F2C94C" stroke-width="1.5"/>
                  <path d="M12 16V12a6 6 0 0 1 12 0v4" stroke="#F2C94C" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="18" cy="23" r="2" fill="#F2C94C"/>
                </svg>
              </div>
              <p class="rv-card-label">Chưa sẵn sàng</p>
              <p class="rv-card-hint">Quản trò đang cầm máy.<br/>Hãy đưa máy cho đúng người trước.</p>
            </div>
          </div>
          <div class="rv-actions">
            <button class="rv-btn-cta" data-action="reveal-ready">Đã đưa máy đúng người</button>
          </div>
        `
            : stage === "ready"
            ? `
          <!-- STATE: READY — person has the device, has not revealed yet -->
          <button class="rv-card rv-card-face-down" data-action="reveal-show" aria-label="Chạm để xem vai">
            <div class="rv-card-inner">
              <div class="rv-question-mark">?</div>
              <p class="rv-card-label">Chạm để xem vai</p>
              <p class="rv-card-hint">Vai trò chỉ hiện cho ${escapeHtml(player.name)}.</p>
            </div>
          </button>
          <div class="rv-actions">
            <button class="rv-btn-cta" data-action="reveal-show">Xem vai</button>
          </div>
        `
            : `
          <!-- STATE: REVEALED -->
          <div class="rv-card rv-card-revealed" style="border-color: ${teamColor}40;">
            <div class="rv-card-inner rv-reveal-anim">
              <span class="rv-faction" style="color: ${teamColor};">${escapeHtml(role.teamLabel)}</span>
              <h3 class="rv-role-name">${escapeHtml(role.name)}</h3>
              <p class="rv-role-desc">${escapeHtml(role.summary)}</p>
            </div>
          </div>
          <p class="rv-handoff-hint">Che màn hình trước khi đưa cho người tiếp theo.</p>
          <div class="rv-actions">
            <button class="rv-btn-cta rv-btn-cta-next" data-action="reveal-next">
              ${isLast ? "Hoàn tất chia vai" : "Đã xem xong, chuyển máy"}
            </button>
          </div>
        `
        }

      </div>
    </section>
  `;
}
