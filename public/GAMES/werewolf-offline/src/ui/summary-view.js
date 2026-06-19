import { escapeHtml, formatTime } from "./shared-components.js";

function renderPlayerCard(player, role) {
  const isWolf = role.team === "wolf";
  const teamColor = isWolf ? "#C0392B" : role.team === "village" ? "#10B981" : "#F2C94C";

  return `
    <div class="sm-player-card ${player.alive ? "alive" : "dead"}">
      <div class="sm-p-top">
        <div class="sm-p-name-row">
          <span class="sm-p-name">${escapeHtml(player.name)}</span>
          <span class="sm-p-order">Vị trí ${player.order}</span>
        </div>
        <span class="sm-p-status ${player.alive ? "alive" : "dead"}">${player.alive ? "Sống" : "Chết"}</span>
      </div>
      <div class="sm-p-bottom">
        <div class="sm-p-role">
          <span class="sm-label">Vai trò:</span>
          <strong>${escapeHtml(role.name)}</strong>
        </div>
        <div class="sm-p-team">
          <span class="sm-label">Phe:</span>
          <span style="color: ${teamColor};">${escapeHtml(role.teamLabel)}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderSummary(gameState, getRoleDefinition) {
  const isWolfWin = gameState.summary.winner === "wolf";
  const isVillageWin = gameState.summary.winner === "village";
  
  let winnerClass = "neutral";
  let winnerText = gameState.summary.winnerLabel || "Chưa xác định";
  
  if (isWolfWin) {
    winnerClass = "wolf";
    winnerText = "PHE SÓI CHIẾN THẮNG";
  } else if (isVillageWin) {
    winnerClass = "village";
    winnerText = "PHE DÂN CHIẾN THẮNG";
  }

  const aliveCt = gameState.players.filter(p => p.alive).length;
  const deadCt = gameState.players.length - aliveCt;

  return `
    <section class="screen sm-screen">
      <div class="sm-wrap">
        
        <!-- SECTION 1: HERO SUMMARY -->
        <div class="sm-hero">
          <div class="sm-hero-inner">
            <h1 class="sm-hero-title sm-win-${winnerClass}">${escapeHtml(winnerText)}</h1>
            <p class="sm-hero-sub">Ván đấu kết thúc sau ${gameState.stats.nightsPlayed} đêm và ${gameState.stats.daysPlayed} ngày.</p>
            <p class="sm-hero-reason">${escapeHtml(gameState.summary.reason)}</p>
            
            <div class="sm-stat-row">
              <div class="sm-stat">
                <span class="sm-stat-label">Đêm đã chơi</span>
                <span class="sm-stat-val">${gameState.stats.nightsPlayed}</span>
              </div>
              <div class="sm-stat">
                <span class="sm-stat-label">Ngày đã chơi</span>
                <span class="sm-stat-val">${gameState.stats.daysPlayed}</span>
              </div>
              <div class="sm-stat">
                <span class="sm-stat-label">Người sống</span>
                <span class="sm-stat-val sm-val-alive">${aliveCt}</span>
              </div>
              <div class="sm-stat">
                <span class="sm-stat-label">Người chết</span>
                <span class="sm-stat-val sm-val-dead">${deadCt}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: PLAYER GRID -->
        <div class="sm-panel">
          <div class="sm-panel-header">
            <h2 class="sm-panel-title">TOÀN BỘ NGƯỜI CHƠI</h2>
            <p class="sm-panel-sub">Vai trò cuối cùng của tất cả người chơi.</p>
          </div>
          <div class="sm-player-grid">
            ${gameState.players.map(player => {
              const role = getRoleDefinition(player.roleId);
              return renderPlayerCard(player, role);
            }).join("")}
          </div>
        </div>

        <!-- SECTION 3: TIMELINE -->
        <div class="sm-panel">
          <div class="sm-panel-header">
            <h2 class="sm-panel-title">DIỄN BIẾN CHÍNH</h2>
            <p class="sm-panel-sub">Những khoảnh khắc quan trọng của ván đấu.</p>
          </div>
          ${gameState.gm.history.length > 0 ? `
            <div class="sm-timeline-wrap">
              <div class="sm-timeline">
                ${gameState.gm.history.map(item => `
                  <div class="sm-tl-item">
                    <div class="sm-tl-left">
                      <span class="sm-tl-cycle">${escapeHtml(item.cycleLabel)}</span>
                      <span class="sm-tl-phase">${escapeHtml(item.phaseLabel || "Ván chơi")}</span>
                      <span class="sm-tl-time">${formatTime(item.timestamp)}</span>
                    </div>
                    <div class="sm-tl-right">
                      <span class="sm-tl-tag">${escapeHtml(item.action)}</span>
                      <div class="sm-tl-text">
                        ${item.targetName ? `<strong class="sm-tl-target">${escapeHtml(item.targetName)}</strong> ` : ""}
                        ${escapeHtml(item.message)}
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : `
            <div class="sm-empty">Chưa có lịch sử nào được ghi nhận.</div>
          `}
        </div>

        <!-- SECTION 4: ACTIONS -->
        <div class="sm-panel sm-actions-panel">
          <div class="sm-actions">
            <button class="sm-btn-primary" data-action="summary-replay">Chơi lại với setup cũ</button>
            <button class="sm-btn-sec" data-action="nav-setup">Tạo ván mới</button>
            <button class="sm-btn-ghost" data-action="nav-home">Về trang chủ</button>
          </div>
        </div>

      </div>
    </section>
  `;
}
