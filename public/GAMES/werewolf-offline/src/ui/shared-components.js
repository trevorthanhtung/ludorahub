export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatTime(timestamp) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function renderNightActionButtons(player, gameState, getRoleDefinition) {
  if (!player.alive) return "";
  const phaseKey = gameState.phase.key;
  const actions = gameState.gm.nightActions;
  if (!actions) return "";
  
  if (phaseKey === "wolf") {
    const isTarget = actions.wolfTarget === player.id;
    return `<button class="btn ${isTarget ? 'btn-danger' : 'btn-secondary'}" data-action="gm-set-wolf-target" data-player-id="${player.id}">${isTarget ? 'Đã chọn cắn' : 'Cắn'}</button>`;
  }
  if (phaseKey === "guard") {
    const isTarget = actions.guardTarget === player.id;
    return `<button class="btn ${isTarget ? 'btn-success' : 'btn-secondary'}" data-action="gm-set-guard-target" data-player-id="${player.id}">${isTarget ? 'Đang bảo vệ' : 'Bảo vệ'}</button>`;
  }
  if (phaseKey === "seer") {
    const isWolf = getRoleDefinition(player.roleId).team === "wolf";
    return `<button class="btn btn-primary" onclick="alert('${escapeHtml(player.name)} là ${isWolf ? 'SÓI 🐺' : 'DÂN 👩‍🌾'}')">Soi</button>`;
  }
  if (phaseKey === "witch") {
    let buttons = [];
    const witchState = gameState.gm.roleStates?.witch;
    if (!witchState) return "";
    
    if (actions.wolfTarget === player.id) {
      if (witchState.hasHealPotion) {
         const isHealed = actions.witchHeal;
         buttons.push(`<button class="btn ${isHealed ? 'btn-success' : 'btn-secondary'}" data-action="gm-witch-heal">${isHealed ? 'Đã cứu' : 'Cứu'}</button>`);
      } else {
         buttons.push(`<span class="badge dead">Hết thuốc cứu</span>`);
      }
    }
    
    if (witchState.hasPoisonPotion && actions.wolfTarget !== player.id) {
      const isTarget = actions.witchPoisonTarget === player.id;
      buttons.push(`<button class="btn ${isTarget ? 'btn-danger' : 'btn-secondary'}" data-action="gm-witch-poison" data-player-id="${player.id}">${isTarget ? 'Đang đầu độc' : 'Đầu độc'}</button>`);
    } else if (actions.witchPoisonTarget === player.id) {
      buttons.push(`<span class="badge dead">Đang bị độc</span>`);
    }
    return buttons.join(" ");
  }
  
  return "";
}

export function renderPlayerCard(player, gameState, getRoleDefinition, interactive = true, networkStatus = undefined) {
  const role = getRoleDefinition(player.roleId);
  const isFinished = gameState.status === "finished";
  const showRole = isFinished || (gameState.gm.showRoles && shouldShowByFilter(player, role, gameState.gm.filter));
  const isCupidLinked = gameState.gm.effects?.cupidLinks?.includes(player.id);
  const isFoxLost = gameState.gm.effects?.foxLostPower?.includes(player.id);

  let networkBadge = "";
  if (networkStatus !== undefined) {
    if (networkStatus) {
      networkBadge = '<span class="badge" style="background: rgba(34, 197, 94, 0.2); color: #bef7cb;">🟢 Online</span>';
    } else {
      networkBadge = '<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5;">🔴 Offline</span>';
    }
  }

  return `
    <article class="player-card ${player.alive ? "" : "dead"}">
      <div class="player-top">
        <div class="player-meta">
          <strong>${escapeHtml(player.name)}</strong>
          <span class="player-order">Vị trí ${player.order}</span>
        </div>
        <div>
          ${networkBadge}
          ${isCupidLinked ? '<span class="badge" style="background: rgba(255, 0, 100, 0.2); color: #ff80b3;">❤️ Ghép đôi</span>' : ''}
          ${isFoxLost ? '<span class="badge" style="background: rgba(100, 100, 100, 0.4); color: #aaa;">❌ Mất năng lực</span>' : ''}
          <span class="badge ${player.alive ? "alive" : "dead"}">${player.alive ? "Sống" : "Chết"}</span>
        </div>
      </div>
      <div class="player-bottom">
        <span class="player-role">${showRole ? `<span style="font-weight: bold; color: #ddd1ff;">${role.icon} ${role.name}</span>` : "🔒 Đang ẩn vai trò"}</span>
        ${
          interactive
            ? `
              <div class="player-actions">
                ${renderNightActionButtons(player, gameState, getRoleDefinition)}
                ${
                  player.alive
                    ? `<button class="btn btn-danger" data-action="gm-toggle-life" data-player-id="${player.id}">Đánh dấu chết</button>`
                    : `<button class="btn btn-success" data-action="gm-toggle-life" data-player-id="${player.id}">Sống lại</button>`
                }
              </div>
            `
            : ""
        }
      </div>
    </article>
  `;
}

export function shouldShowByFilter(player, role, filter) {
  if (filter === "alive") return player.alive;
  if (filter === "dead") return !player.alive;
  if (filter === "wolf") return role.team === "wolf";
  if (filter === "village") return role.team === "village";
  return true;
}
