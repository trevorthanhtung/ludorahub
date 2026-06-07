import { escapeHtml } from "./shared-components.js";
import { renderPlayerCard } from "./shared-components.js";

export function renderSummary(gameState, getRoleDefinition) {
  return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Kết thúc ván</h2>
            <p>${escapeHtml(gameState.summary.reason)}</p>
          </div>
          <span class="tag">${escapeHtml(gameState.summary.winnerLabel || "Chưa xác định")}</span>
        </div>
        <div class="summary-grid">
          <div class="summary-card">
            <p class="muted">Đêm đã chơi</p>
            <h3>${gameState.stats.nightsPlayed}</h3>
          </div>
          <div class="summary-card">
            <p class="muted">Ngày đã chơi</p>
            <h3>${gameState.stats.daysPlayed}</h3>
          </div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-primary" data-action="summary-replay">Chơi lại với setup cũ</button>
          <button class="btn btn-ghost" data-action="nav-home">Về trang chủ</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Lịch sử ván chơi</h2>
            <p>Nhìn lại toàn bộ diễn biến của ván.</p>
          </div>
        </div>
        ${
          gameState.gm.history.length
            ? `
              <div class="history-list" style="max-height: 400px; overflow-y: auto;">
                <div class="history-timeline">
                  ${gameState.gm.history
                    .map(
                      (item) => `
                        <article class="history-card-timeline">
                          <div class="history-top">
                            <strong>${escapeHtml(item.cycleLabel)} - ${escapeHtml(item.phaseLabel || "Ván chơi")}</strong>
                            <span class="history-time">${formatTime(item.timestamp)}</span>
                          </div>
                          <div class="history-content" style="margin-top: 8px;">
                            <span class="badge" style="margin-right: 8px;">${escapeHtml(item.action)}</span>
                            ${item.targetName ? `<strong>${escapeHtml(item.targetName)}</strong> ` : ''}
                            <span class="muted">${escapeHtml(item.message)}</span>
                          </div>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              </div>
            `
            : '<p class="muted">Chưa có lịch sử nào.</p>'
        }
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Toàn bộ người chơi</h2>
            <p>Hiện role thật và trạng thái cuối ván.</p>
          </div>
        </div>
        <div class="player-list">
          ${gameState.players
            .map((player) => renderPlayerCard(player, gameState, getRoleDefinition, false))
            .join("")}
        </div>
      </article>
    </section>
  `;
}
