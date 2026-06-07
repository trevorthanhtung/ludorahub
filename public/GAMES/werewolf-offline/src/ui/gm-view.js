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

function renderRoleEffectsSection(gameState) {
  const hasCupid = gameState.players.some(p => p.roleId === "cupid");
  const hasFox = gameState.players.some(p => p.roleId === "fox");

  if (!hasCupid && !hasFox) return "";

  const cupidLinks = gameState.gm.effects?.cupidLinks || [];
  const foxLostPower = gameState.gm.effects?.foxLostPower || [];

  return `
    <article class="panel" style="grid-column: 1 / -1; border-color: rgba(255, 128, 179, 0.4);">
      <div class="panel-header">
        <div>
          <h2 style="color: var(--primary);">Hiệu ứng Role đặc biệt</h2>
          <p>Quản lý các trạng thái đặc biệt của Cupid, Cáo...</p>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
        ${hasCupid ? `
          <div class="effect-row" style="background: var(--surface-hover); padding: 12px; border-radius: 8px;">
            <strong>👼 Cupid (Ghép đôi)</strong>
            ${cupidLinks.length === 2 ? `
              <p style="margin-top: 4px; color: #ff80b3;">Đã ghép đôi 2 người. Một người chết, người kia sẽ tự động chết theo.</p>
              <div style="margin-top: 8px;">
                <button class="btn btn-secondary" data-action="gm-set-cupid-link" data-p1-id="" data-p2-id="">Hủy ghép đôi</button>
              </div>
            ` : `
              <p style="margin-top: 4px;" class="muted">Chưa ghép đôi. (Quản trò có thể tự nhớ hoặc sử dụng tính năng này nếu cần)</p>
              <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <select id="cupid-p1" class="field" style="max-width: 150px; padding: 4px;">
                  <option value="">-- Chọn --</option>
                  ${gameState.players.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}
                </select>
                <span>❤️</span>
                <select id="cupid-p2" class="field" style="max-width: 150px; padding: 4px;">
                  <option value="">-- Chọn --</option>
                  ${gameState.players.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}
                </select>
                <button class="btn btn-primary" data-action="gm-set-cupid-link" onclick="
                  const p1 = document.getElementById('cupid-p1').value;
                  const p2 = document.getElementById('cupid-p2').value;
                  if(p1 === p2 || !p1 || !p2) {
                    alert('Vui lòng chọn 2 người khác nhau.');
                    event.stopPropagation();
                    return false;
                  }
                  this.dataset.p1Id = p1;
                  this.dataset.p2Id = p2;
                ">Ghép đôi</button>
              </div>
            `}
          </div>
        ` : ""}
        
        ${hasFox ? `
          <div class="effect-row" style="background: var(--surface-hover); padding: 12px; border-radius: 8px;">
            <strong>🦊 Cáo (Mất năng lực)</strong>
            <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
              ${gameState.players.filter(p => p.roleId === "fox").map(fox => {
                const isLost = foxLostPower.includes(fox.id);
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${escapeHtml(fox.name)} ${isLost ? "❌ Đã mất năng lực" : "✅ Còn năng lực"}</span>
                    <button class="btn ${isLost ? 'btn-secondary' : 'btn-danger'}" data-action="gm-toggle-fox-power" data-player-id="${fox.id}">
                      ${isLost ? 'Phục hồi' : 'Tước năng lực'}
                    </button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    </article>
  `;
}

function renderHunterPendingShot(gameState) {
  const pendingShotId = gameState.gm.roleStates?.hunter?.pendingShot;
  if (!pendingShotId) return "";

  const hunter = gameState.players.find(p => p.id === pendingShotId);
  return `
    <article class="panel pulse-danger" style="grid-column: 1 / -1; border-color: red; background: rgba(255, 0, 0, 0.1);">
      <div class="panel-header">
        <div>
          <h2 style="color: #ff6b6b;">🚨 Thợ săn trả đũa</h2>
          <p style="color: #fca5a5;">Thợ săn (${escapeHtml(hunter?.name || "")}) đã chết và có thể bắn 1 người. Yêu cầu chọn người bị bắn ngay!</p>
        </div>
      </div>
      <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
        ${gameState.players.filter(p => p.alive).map(p => `
          <button class="btn btn-danger" data-action="gm-hunter-shoot" data-player-id="${p.id}">Bắn ${escapeHtml(p.name)}</button>
        `).join("")}
        <button class="btn btn-secondary" data-action="gm-hunter-shoot" data-player-id="skip">Không bắn ai</button>
      </div>
    </article>
  `;
}

function renderNightResults(gameState) {
  const results = gameState.gm.nightResults;
  if (!results || results.length === 0 || gameState.phase.key !== "morning") return "";

  return `
    <article class="panel" style="grid-column: 1 / -1; border-color: var(--accent); background: rgba(139, 92, 246, 0.08);">
      <div class="panel-header">
        <div>
          <h2 style="color: #ddd1ff;">🌅 Tóm tắt đêm qua</h2>
          <p style="color: #b6a9d6;">Thông báo cho Làng kết quả sau khi Đêm kết thúc.</p>
        </div>
      </div>
      <ul style="margin-top: 12px; padding-left: 20px; font-size: 1.1rem; line-height: 1.6;">
        ${results.map(r => `<li style="margin-bottom: 8px;">${escapeHtml(r)}</li>`).join("")}
      </ul>
    </article>
  `;
}

export function renderGm(gameState, phases, currentPhase, getRoleDefinition, networkAdapter = null) {
  const visiblePlayers = gameState.players.filter(player => {
    const role = getRoleDefinition(player.roleId);
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

        <div class="summary-card" style="background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4);">
          <p style="color: #ddd1ff; font-weight: bold; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;">Phase hiện tại</p>
          <h3 style="font-size: 1.8rem; margin: 4px 0;">${currentPhase.label}</h3>
          <p style="color: #ddd1ff; opacity: 0.9;">${currentPhase.description}</p>
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
          <button class="btn btn-primary" data-action="gm-next-phase" ${gameState.gm.roleStates?.hunter?.pendingShot ? 'disabled title="Phải chọn người bị Thợ săn bắn"' : ''}>Phase tiếp theo</button>
          <button class="btn btn-secondary" data-action="gm-toggle-roles">
            ${gameState.gm.showRoles ? "Ẩn vai" : "Hiện vai"}
          </button>
          ${networkAdapter && networkAdapter.isHost() ? `
          <button class="btn btn-secondary" data-action="GM_FORCE_BROADCAST" title="Gửi lại dữ liệu cho người chơi">
            Gửi lại (Sync)
          </button>
          ` : ''}
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
      
      ${renderRoleEffectsSection(gameState)}
      
      ${renderHunterPendingShot(gameState)}
      
      ${renderNightResults(gameState)}

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
            .map((player) => {
              const networkStatus = networkAdapter && networkAdapter.isHost() && !player.id.startsWith("p-") 
                                    ? networkAdapter.getConnectionStatus(player.id) 
                                    : undefined;
              return renderPlayerCard(player, gameState, getRoleDefinition, true, networkStatus);
            })
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
                <div class="history-timeline">
                  ${gameState.gm.history.slice(0, 20)
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
                  
                  ${gameState.gm.history.length > 20 ? `
                    <details style="margin-top: 10px;">
                      <summary style="cursor: pointer; color: var(--muted); padding: 8px 0; font-weight: bold;">Xem thêm lịch sử cũ (${gameState.gm.history.length - 20} sự kiện)</summary>
                      <div style="display: flex; flex-direction: column; gap: 0; margin-top: 12px;">
                        ${gameState.gm.history.slice(20)
                          .map(
                            (item) => `
                              <article class="history-card-timeline" style="opacity: 0.8;">
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
                  ` : ""}
                </div>
              </div>
            `
            : '<div class="empty-state">Chưa có lịch sử nào. Hãy dùng phase và ghi chú để theo dõi ván.</div>'
        }
      </article>
    </section>
  `;
}
