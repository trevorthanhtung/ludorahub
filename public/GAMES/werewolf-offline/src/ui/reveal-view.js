import { escapeHtml } from "./shared-components.js";

export function renderReveal(gameState, getRoleDefinition) {
  const player = gameState.players[gameState.reveal.currentIndex];
  const role = getRoleDefinition(player.roleId);
  const isReady = gameState.reveal.stage !== "handoff";
  const isRevealed = gameState.reveal.stage === "revealed";

  return `
    <section class="screen">
      <div class="reveal-wrap">
        <article class="panel handoff-card">
          <div class="eyebrow">👤 Reveal ${gameState.reveal.currentIndex + 1}/${gameState.players.length}</div>
          <h2>Đưa máy cho ${escapeHtml(player.name)}</h2>
          <p>Chỉ người này nhìn màn hình. Xong rồi hãy che lại trước khi chuyển máy tiếp.</p>
          <div class="highlight" style="margin-top: 14px; font-size: 0.9rem;">
            ⚠️ <strong>Cảnh báo:</strong> Chỉ người đang cầm máy được xem vai này.
          </div>
          ${
            !isReady
              ? '<div class="footer-actions"><button class="btn btn-primary" data-action="reveal-ready">Tôi đã sẵn sàng</button></div>'
              : ""
          }
        </article>

        <article class="role-card ${isRevealed ? "" : "hidden"}">
          ${
            !isReady
              ? '<div class="role-content"><div class="role-icon">🌙</div><h3>Chờ xác nhận</h3><p class="muted">Quản trò hãy đưa máy cho đúng người chơi trước.</p></div>'
              : isRevealed
                ? `
                  <div class="role-content">
                    <div class="role-icon">${role.icon}</div>
                    <div class="role-team">${role.teamLabel}</div>
                    <h3 class="role-name">${role.name}</h3>
                    <p>${role.summary}</p>
                  </div>
                `
                : `
                  <button type="button" data-action="reveal-show" aria-label="Xem vai">
                    <div class="role-content">
                      <div class="role-icon">🂠</div>
                      <h3>Chạm để xem vai</h3>
                      <p class="muted">Vai trò sẽ chỉ hiện trên màn hình này cho ${escapeHtml(player.name)}.</p>
                    </div>
                  </button>
                `
          }
        </article>

        ${
          isRevealed
            ? `
              <div class="footer-actions">
                <button class="btn btn-primary" data-action="reveal-next">
                  Ẩn vai và chuyển người tiếp theo
                </button>
              </div>
            `
            : ""
        }
      </div>
    </section>
  `;
}
