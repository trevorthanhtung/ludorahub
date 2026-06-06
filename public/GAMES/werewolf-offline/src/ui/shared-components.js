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

export function renderPlayerCard(player, gameState, getRoleDefinition, interactive = true) {
  const role = getRoleDefinition(player.roleId);
  const isFinished = gameState.status === "finished";
  const showRole = isFinished || (gameState.gm.showRoles && shouldShowByFilter(player, role, gameState.gm.filter));

  return `
    <article class="player-card ${player.alive ? "" : "dead"}">
      <div class="player-top">
        <div class="player-meta">
          <strong>${escapeHtml(player.name)}</strong>
          <span class="player-order">Vị trí ${player.order}</span>
        </div>
        <span class="badge ${player.alive ? "alive" : "dead"}">${player.alive ? "Sống" : "Chết"}</span>
      </div>
      <div class="player-bottom">
        <span class="player-role">${showRole ? `${role.icon} ${role.name}` : "Vai trò đang ẩn"}</span>
        ${
          interactive
            ? `
              <div class="player-actions">
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
