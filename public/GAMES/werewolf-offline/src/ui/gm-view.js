import { escapeHtml, formatTime, renderPlayerCard, shouldShowByFilter } from "./shared-components.js";

// ---- Filter row ----
function renderFilterRow(currentFilter) {
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "alive", label: "Còn sống" },
    { id: "dead", label: "Đã chết" },
    { id: "village", label: "Phe dân" },
    { id: "wolf", label: "Phe sói" },
  ];
  return `
    <div class="gm-filter-row">
      ${filters.map(f => `
        <button class="gm-filter-btn ${currentFilter === f.id ? "active" : ""}" data-action="gm-filter-change" data-filter="${f.id}">
          ${f.label}
        </button>
      `).join("")}
    </div>
  `;
}

// ---- Compact player item ----
function renderPlayerItem(player, gameState, getRoleDefinition, networkAdapter) {
  const role = getRoleDefinition(player.roleId);
  const isFinished = gameState.status === "finished";
  const showRole = isFinished || (gameState.gm.showRoles && shouldShowByFilter(player, role, gameState.gm.filter));
  const isCupidLinked = gameState.gm.effects?.cupidLinks?.includes(player.id);
  const isFoxLost = gameState.gm.effects?.foxLostPower?.includes(player.id);
  const phaseKey = gameState.phase.key;
  const actions = gameState.gm.nightActions;

  // Night action button
  let nightBtn = "";
  if (player.alive && actions) {
    if (phaseKey === "wolf") {
      const isTarget = actions.wolfTarget === player.id;
      nightBtn = `<button class="gm-night-btn ${isTarget ? "active-target" : ""}" data-action="gm-set-wolf-target" data-player-id="${player.id}">${isTarget ? "Đang bị cắn" : "Cắn"}</button>`;
    } else if (phaseKey === "guard") {
      const isTarget = actions.guardTarget === player.id;
      nightBtn = `<button class="gm-night-btn ${isTarget ? "active-guard" : ""}" data-action="gm-set-guard-target" data-player-id="${player.id}">${isTarget ? "Đang bảo vệ" : "Bảo vệ"}</button>`;
    } else if (phaseKey === "seer") {
      const isWolf = getRoleDefinition(player.roleId).team === "wolf";
      nightBtn = `<button class="gm-night-btn" onclick="alert('${escapeHtml(player.name)} là ${isWolf ? 'SÓI' : 'DÂN'}')">Soi</button>`;
    } else if (phaseKey === "witch") {
      const witchState = gameState.gm.roleStates?.witch;
      if (witchState) {
        if (actions.wolfTarget === player.id && witchState.hasHealPotion) {
          const isHealed = actions.witchHeal;
          nightBtn = `<button class="gm-night-btn ${isHealed ? "active-guard" : ""}" data-action="gm-witch-heal">${isHealed ? "Đã cứu" : "Cứu"}</button>`;
        } else if (witchState.hasPoisonPotion && actions.wolfTarget !== player.id) {
          const isTarget = actions.witchPoisonTarget === player.id;
          nightBtn = `<button class="gm-night-btn ${isTarget ? "active-target" : ""}" data-action="gm-witch-poison" data-player-id="${player.id}">${isTarget ? "Đang đầu độc" : "Đầu độc"}</button>`;
        }
      }
    }
  }

  const networkBadge = networkAdapter && networkAdapter.isHost() && !player.id.startsWith("p-")
    ? (networkAdapter.getConnectionStatus(player.id)
        ? `<span class="gm-online-dot" title="Online"></span>`
        : `<span class="gm-offline-dot" title="Offline"></span>`)
    : "";

  const specialBadges = [
    isCupidLinked ? `<span class="gm-special-badge">Ghép đôi</span>` : "",
    isFoxLost ? `<span class="gm-special-badge">Mất NL</span>` : "",
  ].filter(Boolean).join("");

  return `
    <div class="gm-player-row ${player.alive ? "" : "gm-player-dead"}">
      <div class="gm-player-main">
        <div class="gm-player-info">
          <div class="gm-player-name-row">
            ${networkBadge}
            <span class="gm-player-name">${escapeHtml(player.name)}</span>
            ${specialBadges}
          </div>
          <span class="gm-player-meta">Vị trí ${player.order} · ${showRole ? `<strong>${escapeHtml(role.name)}</strong>` : "Ẩn vai trò"}</span>
        </div>
        <div class="gm-player-status">
          <span class="gm-alive-badge ${player.alive ? "alive" : "dead"}">${player.alive ? "Sống" : "Chết"}</span>
        </div>
      </div>
      <div class="gm-player-actions">
        ${nightBtn}
        ${player.alive
          ? `<button class="gm-act-btn gm-act-kill" data-action="gm-toggle-life" data-player-id="${player.id}">Đánh dấu chết</button>`
          : `<button class="gm-act-btn gm-act-revive" data-action="gm-toggle-life" data-player-id="${player.id}">Hồi sinh</button>`
        }
      </div>
    </div>
  `;
}

// ---- Voting section ----
function renderVotingSection(gameState) {
  if (gameState.phase.key !== "voting") return "";
  let maxVotes = 0;
  Object.values(gameState.gm.votes).forEach(v => { if (v > maxVotes) maxVotes = v; });
  const alivePlayers = gameState.players.filter(p => p.alive);

  return `
    <div class="gm-alert-panel gm-alert-vote">
      <p class="gm-alert-title">Bỏ phiếu treo cổ</p>
      <div class="gm-vote-list">
        ${alivePlayers.map(p => {
          const votes = gameState.gm.votes[p.id] || 0;
          const isMax = votes > 0 && votes === maxVotes;
          return `
            <div class="gm-vote-row ${isMax ? "gm-vote-top" : ""}">
              <span class="gm-vote-name">${escapeHtml(p.name)}</span>
              <div class="gm-vote-stepper">
                <button type="button" class="gm-step-btn" data-action="gm-vote-sub" data-player-id="${p.id}">−</button>
                <span class="gm-vote-count">${votes}</span>
                <button type="button" class="gm-step-btn" data-action="gm-vote-add" data-player-id="${p.id}">+</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
      <div class="gm-vote-actions">
        <button class="gm-act-btn" data-action="gm-vote-reset">Reset phiếu</button>
        <button class="gm-act-btn gm-act-kill" data-action="gm-vote-execute">Treo cổ người nhiều phiếu nhất</button>
      </div>
    </div>
  `;
}

// ---- Role effects (Cupid / Fox) ----
function renderRoleEffectsSection(gameState) {
  const hasCupid = gameState.players.some(p => p.roleId === "cupid");
  const hasFox = gameState.players.some(p => p.roleId === "fox");
  if (!hasCupid && !hasFox) return "";
  const cupidLinks = gameState.gm.effects?.cupidLinks || [];
  const foxLostPower = gameState.gm.effects?.foxLostPower || [];

  return `
    <div class="gm-alert-panel">
      <p class="gm-alert-title">Hiệu ứng vai đặc biệt</p>
      ${hasCupid ? `
        <div class="gm-effect-row">
          <strong>Cupid – Ghép đôi</strong>
          ${cupidLinks.length === 2
            ? `<span class="gm-muted">Đã ghép đôi. <button class="gm-link-btn" data-action="gm-set-cupid-link" data-p1-id="" data-p2-id="">Hủy</button></span>`
            : `<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:6px;">
                <select id="cupid-p1" class="gm-select"><option value="">-- Chọn --</option>${gameState.players.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}</select>
                <span class="gm-muted">+</span>
                <select id="cupid-p2" class="gm-select"><option value="">-- Chọn --</option>${gameState.players.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}</select>
                <button class="gm-act-btn" data-action="gm-set-cupid-link" onclick="const p1=document.getElementById('cupid-p1').value;const p2=document.getElementById('cupid-p2').value;if(p1===p2||!p1||!p2){alert('Chọn 2 người khác nhau.');event.stopPropagation();return false;}this.dataset.p1Id=p1;this.dataset.p2Id=p2;">Ghép đôi</button>
              </div>`
          }
        </div>
      ` : ""}
      ${hasFox ? `
        <div class="gm-effect-row">
          <strong>Cáo – Năng lực</strong>
          ${gameState.players.filter(p => p.roleId === "fox").map(fox => {
            const isLost = foxLostPower.includes(fox.id);
            return `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
              <span>${escapeHtml(fox.name)} — ${isLost ? "Mất năng lực" : "Còn năng lực"}</span>
              <button class="gm-act-btn ${isLost ? "" : "gm-act-kill"}" data-action="gm-toggle-fox-power" data-player-id="${fox.id}">${isLost ? "Phục hồi" : "Tước"}</button>
            </div>`;
          }).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

// ---- Hunter pending shot ----
function renderHunterPendingShot(gameState) {
  const pendingShotId = gameState.gm.roleStates?.hunter?.pendingShot;
  if (!pendingShotId) return "";
  const hunter = gameState.players.find(p => p.id === pendingShotId);
  return `
    <div class="gm-alert-panel gm-alert-danger">
      <p class="gm-alert-title">Thợ săn trả đũa</p>
      <p class="gm-muted">${escapeHtml(hunter?.name || "")} đã chết — chọn người bị bắn:</p>
      <div class="gm-hunter-targets">
        ${gameState.players.filter(p => p.alive).map(p => `
          <button class="gm-act-btn gm-act-kill" data-action="gm-hunter-shoot" data-player-id="${p.id}">Bắn ${escapeHtml(p.name)}</button>
        `).join("")}
        <button class="gm-act-btn" data-action="gm-hunter-shoot" data-player-id="skip">Không bắn</button>
      </div>
    </div>
  `;
}

// ---- Night results ----
function renderNightResults(gameState) {
  const results = gameState.gm.nightResults;
  if (!results || results.length === 0 || gameState.phase.key !== "morning") return "";
  return `
    <div class="gm-alert-panel gm-alert-info">
      <p class="gm-alert-title">Tóm tắt đêm qua</p>
      <ul class="gm-result-list">
        ${results.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
      </ul>
    </div>
  `;
}

// ---- History entry ----
function renderHistoryEntry(item) {
  return `
    <div class="gm-history-item">
      <div class="gm-history-top">
        <span class="gm-history-label">${escapeHtml(item.cycleLabel)} · ${escapeHtml(item.phaseLabel || "Ván chơi")}</span>
        <span class="gm-history-time">${formatTime(item.timestamp)}</span>
      </div>
      <div class="gm-history-body">
        <span class="gm-history-tag">${escapeHtml(item.action)}</span>
        ${item.targetName ? `<strong>${escapeHtml(item.targetName)}</strong> ` : ""}
        <span class="gm-muted">${escapeHtml(item.message)}</span>
      </div>
    </div>
  `;
}

// ---- MAIN EXPORT ----
export function renderGm(gameState, phases, currentPhase, getRoleDefinition, networkAdapter = null) {
  const visiblePlayers = gameState.players.filter(player => {
    const role = getRoleDefinition(player.roleId);
    return shouldShowByFilter(player, role, gameState.gm.filter);
  });

  const aliveCt = gameState.players.filter(p => p.alive).length;
  const deadCt = gameState.players.length - aliveCt;
  const hunterBlocked = !!gameState.gm.roleStates?.hunter?.pendingShot;

  // Phase timeline
  const phaseTimeline = phases.map((phase, index) => `
    <span class="gm-phase-step ${index === gameState.phase.index ? "active" : ""}">${phase.shortLabel}</span>
  `).join("<span class='gm-phase-sep'>›</span>");

  return `
    <section class="screen gm-screen">
      <div class="gm-wrap">

        <!-- ===== LEFT COLUMN ===== -->
        <div class="gm-col-left">

          <!-- Phase control -->
          <div class="gm-panel gm-phase-panel">
            <div class="gm-panel-header">
              <div>
                <h2 class="gm-panel-title">Bảng điều khiển quản trò</h2>
                <p class="gm-panel-sub">Điều phối phase, theo dõi người chơi và ghi chú ván.</p>
              </div>
              <span class="gm-cycle-badge">Chu kỳ ${gameState.phase.cycle}</span>
            </div>

            <div class="gm-current-phase">
              <span class="gm-phase-name">${escapeHtml(currentPhase.label)}</span>
              <p class="gm-phase-desc">${escapeHtml(currentPhase.description)}</p>
            </div>

            <div class="gm-phase-timeline" aria-label="Tiến trình phase">
              ${phaseTimeline}
            </div>

            <div class="gm-phase-actions">
              <button class="gm-btn-primary" data-action="gm-next-phase" ${hunterBlocked ? 'disabled title="Phải chọn người Thợ săn bắn trước"' : ""}>
                Sang phase tiếp theo
              </button>
              <button class="gm-btn-sec" data-action="gm-toggle-roles">
                ${gameState.gm.showRoles ? "Ẩn vai" : "Hiện vai"}
              </button>
              ${networkAdapter && networkAdapter.isHost()
                ? `<button class="gm-btn-sec" data-action="GM_FORCE_BROADCAST">Sync</button>`
                : ""}
              <button class="gm-btn-danger" data-action="gm-end-game">Kết thúc ván</button>
            </div>
          </div>

          <!-- Alert panels (voting, hunter, night results, effects) -->
          ${renderVotingSection(gameState)}
          ${renderHunterPendingShot(gameState)}
          ${renderNightResults(gameState)}
          ${renderRoleEffectsSection(gameState)}

          <!-- Player board -->
          <div class="gm-panel gm-players-panel">
            <div class="gm-panel-header gm-panel-header-row">
              <h2 class="gm-panel-title">Người chơi</h2>
              ${renderFilterRow(gameState.gm.filter)}
            </div>
            <div class="gm-player-board">
              ${visiblePlayers.map(player =>
                renderPlayerItem(player, gameState, getRoleDefinition, networkAdapter)
              ).join("")}
              ${visiblePlayers.length === 0
                ? `<div class="gm-empty">Không có người chơi nào khớp với bộ lọc.</div>`
                : ""}
            </div>
          </div>

        </div><!-- /LEFT -->

        <!-- ===== RIGHT COLUMN ===== -->
        <div class="gm-col-right">

          <!-- Game status -->
          <div class="gm-panel gm-status-panel">
            <h2 class="gm-panel-title">Trạng thái ván</h2>
            <p class="gm-panel-sub">Theo dõi tiến trình và điều kiện thắng/thua.</p>
            <div class="gm-stat-grid">
              <div class="gm-stat-item">
                <span class="gm-stat-label">Đêm đã chơi</span>
                <span class="gm-stat-val">${gameState.stats.nightsPlayed}</span>
              </div>
              <div class="gm-stat-item">
                <span class="gm-stat-label">Ngày đã chơi</span>
                <span class="gm-stat-val">${gameState.stats.daysPlayed}</span>
              </div>
              <div class="gm-stat-item">
                <span class="gm-stat-label">Còn sống</span>
                <span class="gm-stat-val gm-val-alive">${aliveCt}</span>
              </div>
              <div class="gm-stat-item">
                <span class="gm-stat-label">Đã chết</span>
                <span class="gm-stat-val gm-val-dead">${deadCt}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="gm-panel gm-notes-panel">
            <h2 class="gm-panel-title">Ghi chú quản trò</h2>
            <p class="gm-panel-sub">Lưu nhanh các sự kiện quan trọng trong đêm/ngày.</p>
            <textarea
              class="gm-textarea"
              data-note-draft
              placeholder="Ví dụ: Sói chọn Người chơi 4, Bảo vệ giữ Người chơi 2..."
            >${escapeHtml(gameState.gm.noteDraft)}</textarea>
            <div class="gm-note-actions">
              <button class="gm-btn-sec" data-action="gm-add-note">Lưu ghi chú</button>
              <button class="gm-btn-ghost" data-action="gm-clear-note">Xóa nháp</button>
            </div>
          </div>

          <!-- History -->
          <div class="gm-panel gm-history-panel">
            <h2 class="gm-panel-title">Lịch sử ván</h2>
            ${gameState.gm.history.length > 0
              ? `<div class="gm-history-list">
                  ${gameState.gm.history.slice(0, 20).map(renderHistoryEntry).join("")}
                  ${gameState.gm.history.length > 20
                    ? `<details class="gm-history-more">
                        <summary>Xem thêm (${gameState.gm.history.length - 20})</summary>
                        ${gameState.gm.history.slice(20).map(renderHistoryEntry).join("")}
                      </details>`
                    : ""}
                </div>`
              : `<div class="gm-empty">Chưa có lịch sử nào.</div>`
            }
          </div>

        </div><!-- /RIGHT -->

      </div>
    </section>
  `;
}
