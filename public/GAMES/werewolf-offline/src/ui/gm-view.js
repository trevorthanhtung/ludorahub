import { escapeHtml, formatTime, renderPlayerCard, shouldShowByFilter } from "./shared-components.js";

function renderFilterPills(currentFilter) {
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "alive", label: "Còn sống" },
    { id: "dead", label: "Đã chết" },
    { id: "village", label: "Phe dân" },
    { id: "wolf", label: "Phe sói" },
  ];
  return `
    <div class="filter-track">
      ${filters.map(f => `
        <button class="filter-pill ${currentFilter === f.id ? "active" : ""}" data-action="gm-filter-change" data-filter="${f.id}">
          ${f.label}
        </button>
      `).join("")}
    </div>
  `;
}

function renderVotingSection(gameState) {
  if (gameState.phase.key !== "voting") return "";
  
  const alivePlayers = gameState.players.filter(p => p.alive);
  let maxVotes = 0;
  Object.values(gameState.gm.votes).forEach(v => {
    if (v > maxVotes) maxVotes = v;
  });

  return `
    <article class="panel voting-panel" style="grid-column: 1 / -1; border-color: rgba(245, 158, 11, 0.4);">
      <div class="panel-header">
        <div>
          <h2 style="color: var(--warning);">Khu vực Bỏ phiếu (Treo cổ)</h2>
          <p>Quản trò cộng/trừ phiếu cho từng người. Người bị treo cổ sẽ chết ngay lập tức.</p>
        </div>
      </div>
      <div class="voting-list">
        ${alivePlayers.map(p => {
          const votes = gameState.gm.votes[p.id] || 0;
          const isMax = votes > 0 && votes === maxVotes;
          return `
            <div class="vote-row ${isMax ? "highlight" : ""}">
              <span class="vote-name">${escapeHtml(p.name)}</span>
              <div class="stepper-row vote-stepper">
                <button type="button" data-action="gm-vote-sub" data-player-id="${p.id}">−</button>
                <div class="vote-count">${votes}</div>
                <button type="button" data-action="gm-vote-add" data-player-id="${p.id}">+</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      <div class="footer-actions three-col" style="margin-top: 16px;">
        <button class="btn btn-secondary" data-action="gm-vote-reset">Reset phiếu</button>
        <button class="btn btn-danger" style="grid-column: span 2;" data-action="gm-vote-execute">Treo cổ người nhiều phiếu nhất</button>
      </div>
    </article>
  `;
}

export function renderGm(gameState, phases, currentPhase, getRoleDefinition) {
  const visiblePlayers = gameState.players.filter(player => {
    const role = getRoleDefinition(player.roleId);
    // If roles are hidden, team filters don't apply unless the GM explicitly wants to filter by team (but they shouldn't see it if they hide roles).
    // Let's implement this: if showRoles is false and filter is wolf/village, show nothing or just ignore team filters.
    // Actually, "Khi bật 'Hiện vai', filter theo phe mới hiện". So if showRoles is false, hide team filters completely in UI, or just default them to "all".
    // I will show team filters only when showRoles is true.
    return shouldShowByFilter(player, role, gameState.gm.filter);
  });

  return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Bảng điều khiển quản trò</h2>
            <p>Điều phối phase, ghi chú và theo dõi toàn bộ ván chơi.</p>
          </div>
          <span class="tag">Chu kỳ ${gameState.phase.cycle}</span>
        </div>

        <div class="summary-card">
          <p class="muted">Phase hiện tại</p>
          <h3>${currentPhase.label}</h3>
          <p class="helper">${currentPhase.description}</p>
        </div>

        <div class="phase-track" style="margin-top: 14px;">
          ${phases
            .map(
              (phase, index) => `
                <span class="phase-pill ${index === gameState.phase.index ? "active" : ""}">
                  ${phase.shortLabel}
                </span>
              `,
            )
            .join("")}
        </div>

        <div class="footer-actions">
          <button class="btn btn-primary" data-action="gm-next-phase">Phase tiếp theo</button>
          <button class="btn btn-secondary" data-action="gm-toggle-roles">
            ${gameState.gm.showRoles ? "Ẩn vai" : "Hiện vai"}
          </button>
          <button class="btn btn-danger" data-action="gm-end-game">Kết thúc ván</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Trạng thái ván</h2>
            <p>Tự kiểm tra thắng thua khi số người sống thay đổi.</p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="summary-card">
            <p class="muted">Đêm đã chơi</p>
            <h3>${gameState.stats.nightsPlayed}</h3>
          </div>
          <div class="summary-card">
            <p class="muted">Ngày đã chơi</p>
            <h3>${gameState.stats.daysPlayed}</h3>
          </div>
        </div>
        <div class="divider"></div>
        <div class="status-row">
          <span class="badge alive">Sống: ${gameState.players.filter((player) => player.alive).length}</span>
          <span class="badge dead">Chết: ${gameState.players.filter((player) => !player.alive).length}</span>
        </div>
      </article>

      ${renderVotingSection(gameState)}

      <article class="panel" style="grid-column: 1 / -1;">
        <div class="panel-header">
          <div>
            <h2>Người chơi</h2>
            <p>Quản trò có thể bật role thật hoặc chỉ nhìn trạng thái sống/chết.</p>
          </div>
          ${renderFilterPills(gameState.gm.filter)}
        </div>
        <div class="player-list">
          ${visiblePlayers
            .map((player) => renderPlayerCard(player, gameState, getRoleDefinition, true))
            .join("")}
          ${visiblePlayers.length === 0 ? '<div class="empty-state">Không có người chơi nào khớp với bộ lọc.</div>' : ''}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Ghi chú sự kiện</h2>
            <p>Draft này tự lưu. Khi cần, bấm thêm vào lịch sử để chốt ghi chú.</p>
          </div>
        </div>
        <label class="field">
          <span>Nội dung ghi chú</span>
          <textarea data-note-draft placeholder="Ví dụ: Sói chọn Người chơi 4, Bảo vệ giữ Người chơi 4...">${escapeHtml(gameState.gm.noteDraft)}</textarea>
        </label>
        <div class="footer-actions two-col">
          <button class="btn btn-secondary" data-action="gm-add-note">Lưu lịch sử</button>
          <button class="btn btn-ghost" data-action="gm-clear-note">Xóa nháp</button>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Lịch sử ván chơi</h2>
            <p>Ghi lại phase, thay đổi sống/chết và ghi chú của quản trò.</p>
          </div>
        </div>
        ${
          gameState.gm.history.length
            ? `
              <div class="history-list">
                ${gameState.gm.history.slice(0, 20)
                  .map(
                    (item) => `
                      <article class="history-card">
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
                
                ${gameState.gm.history.length > 20 ? `
                  <details style="margin-top: 10px;">
                    <summary style="cursor: pointer; color: var(--muted); padding: 8px 0; font-weight: bold;">Xem thêm lịch sử cũ (${gameState.gm.history.length - 20} sự kiện)</summary>
                    <div style="display: grid; gap: 12px; margin-top: 12px;">
                      ${gameState.gm.history.slice(20)
                        .map(
                          (item) => `
                            <article class="history-card" style="opacity: 0.8;">
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
                  </details>
                ` : ''}
              </div>
            `
            : '<div class="empty-state">Chưa có lịch sử nào. Hãy dùng phase và ghi chú để theo dõi ván.</div>'
        }
      </article>
    </section>
  `;
}
