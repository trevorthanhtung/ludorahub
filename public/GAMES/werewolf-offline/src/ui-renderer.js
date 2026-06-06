import { countRoles } from "./role-config.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

function renderHome(gameState) {
  return `
    <section class="screen">
      <div class="hero">
        <div class="eyebrow">🌙 Offline GM Companion</div>
        <h1>Ma Sói Offline</h1>
        <p>1 quản trò cầm 1 máy để chia vai, điều phối phase và lưu tiến độ cho nhóm 5-15 người.</p>

        <div class="button-grid">
          <button class="btn btn-primary" data-action="home-new">Tạo ván mới</button>
          ${
            gameState.storage.hasSavedGame
              ? '<button class="btn btn-secondary" data-action="home-continue">Tiếp tục ván cũ</button>'
              : ""
          }
          <button class="btn btn-ghost" data-action="home-howto">Cách chơi</button>
          <button class="btn btn-ghost" data-action="hub-back">Quay lại Ludora Hub</button>
        </div>
      </div>
    </section>
  `;
}

function renderHowTo() {
  return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Cách chơi nhanh</h2>
            <p>Bản này dành cho 1 quản trò dùng chung 1 điện thoại hoặc laptop.</p>
          </div>
        </div>
        <div class="info-list">
          <div class="highlight">1. Tạo ván mới, nhập 5-15 người chơi và chỉnh preset nếu cần.</div>
          <div class="highlight">2. Chia vai, lần lượt đưa máy cho từng người xem vai riêng của mình.</div>
          <div class="highlight">3. Sau khi chia xong, quản trò dùng màn hình GM để đi phase, đánh dấu chết/sống và ghi chú.</div>
          <div class="highlight">4. Game tự kiểm tra thắng thua khi số người sống thay đổi.</div>
        </div>
      </article>
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Lưu ý Phase 1</h2>
            <p>Chưa có multiplayer, không có Wi-Fi, không có backend.</p>
          </div>
        </div>
        <div class="info-list">
          <div class="chip">Lưu ván bằng localStorage</div>
          <div class="chip">Không dùng máy riêng cho từng người chơi</div>
          <div class="chip">Quản trò tự điều phối kỹ năng đêm</div>
          <div class="chip">Có replay với setup cũ</div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-primary" data-action="nav-home">Về trang chủ</button>
          <button class="btn btn-secondary" data-action="nav-setup">Đi tới setup</button>
        </div>
      </article>
    </section>
  `;
}

function renderSetup(gameState, roleOrder, getRoleDefinition) {
  const { setup } = gameState;
  const totalRoles = countRoles(setup.roleConfig);

  return `
    <section class="screen two-col">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Thiết lập ván</h2>
            <p>Chỉnh số người, tên và số lượng role trước khi chia vai.</p>
          </div>
          <span class="tag">5-15 người</span>
        </div>

        <div class="field stepper">
          <label for="playerCount">Số người chơi</label>
          <div class="stepper-row">
            <button type="button" data-action="setup-decrease" aria-label="Giảm số người chơi">−</button>
            <input id="playerCount" data-player-count type="number" min="5" max="15" value="${setup.playerCount}" />
            <button type="button" data-action="setup-increase" aria-label="Tăng số người chơi">+</button>
          </div>
        </div>

        <div class="panel" style="margin-top: 16px;">
          <div class="panel-header">
            <div>
              <h3>Preset đề xuất</h3>
              <p>Tự cập nhật theo số người và có thể chỉnh tay ở phần dưới.</p>
            </div>
          </div>
          <div class="chip-row">
            ${roleOrder
              .filter((roleId) => setup.roleConfig[roleId] > 0)
              .map((roleId) => {
                const role = getRoleDefinition(roleId);
                return `<span class="chip">${role.icon} ${role.name}: ${setup.roleConfig[roleId]}</span>`;
              })
              .join("")}
          </div>
          <div class="footer-actions">
            <button class="btn btn-secondary" data-action="setup-apply-preset">Áp dụng lại preset</button>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Danh sách người chơi</h2>
            <p>Có thể sửa tên từng người trước khi chia vai.</p>
          </div>
        </div>
        <div class="player-list">
          ${setup.players
            .map(
              (player, index) => `
                <label class="field">
                  <span>${player.order}. Người chơi</span>
                  <input data-player-name="${index}" value="${escapeHtml(player.name)}" maxlength="32" />
                </label>
              `,
            )
            .join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Tùy chỉnh role</h2>
            <p>Chỉnh tay nếu muốn. Tổng role phải bằng đúng số người chơi.</p>
          </div>
        </div>
        <div class="role-grid">
          ${roleOrder
            .map((roleId) => {
              const role = getRoleDefinition(roleId);
              return `
                <label class="field role-counter">
                  <span>${role.icon} ${role.name}</span>
                  <input data-role-count="${roleId}" type="number" min="0" max="15" value="${setup.roleConfig[roleId]}" />
                </label>
              `;
            })
            .join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Kiểm tra trước khi chia vai</h2>
            <p>Hệ thống chỉ cho chia vai khi cấu hình hợp lệ.</p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="summary-card">
            <p class="muted">Số người chơi</p>
            <h3>${setup.playerCount}</h3>
          </div>
          <div class="summary-card">
            <p class="muted">Tổng role</p>
            <h3>${totalRoles}</h3>
          </div>
        </div>
        <p class="${setup.validation.isValid ? "validation-ok" : "validation-error"}" style="margin-top: 14px;">
          ${setup.validation.message}
        </p>
        <div class="footer-actions">
          <button class="btn btn-primary" data-action="setup-assign" ${setup.validation.isValid ? "" : "disabled"}>
            Chia vai
          </button>
          <button class="btn btn-ghost" data-action="nav-home">Về trang chủ</button>
        </div>
      </article>
    </section>
  `;
}

function renderReveal(gameState, getRoleDefinition) {
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

function renderPlayerCard(player, gameState, getRoleDefinition, interactive = true) {
  const role = getRoleDefinition(player.roleId);
  const showRole = gameState.gm.showRoles || gameState.status === "finished";

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
                <button class="btn ${player.alive ? "btn-danger" : "btn-success"}" data-action="gm-toggle-life" data-player-id="${player.id}">
                  ${player.alive ? "Đánh dấu chết" : "Sống lại"}
                </button>
              </div>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function renderGm(gameState, phases, currentPhase, getRoleDefinition) {
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

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Người chơi</h2>
            <p>Quản trò có thể bật role thật hoặc chỉ nhìn trạng thái sống/chết.</p>
          </div>
        </div>
        <div class="player-list">
          ${gameState.players
            .map((player) => renderPlayerCard(player, gameState, getRoleDefinition, true))
            .join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Ghi chú sự kiện đêm</h2>
            <p>Draft này tự lưu. Khi cần, bấm thêm vào lịch sử để chốt ghi chú.</p>
          </div>
        </div>
        <label class="field">
          <span>Nội dung ghi chú</span>
          <textarea data-note-draft placeholder="Ví dụ: Sói chọn Người chơi 4, Bảo vệ giữ Người chơi 4...">${escapeHtml(gameState.gm.noteDraft)}</textarea>
        </label>
        <div class="footer-actions">
          <button class="btn btn-secondary" data-action="gm-add-note">Thêm vào lịch sử</button>
        </div>
      </article>

      <article class="panel" style="grid-column: 1 / -1;">
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
                ${gameState.gm.history
                  .map(
                    (item) => `
                      <article class="history-card">
                        <div class="history-top">
                          <strong>${escapeHtml(item.phaseLabel || "Ván chơi")}</strong>
                          <span class="history-time">${formatTime(item.timestamp)}</span>
                        </div>
                        <p>${escapeHtml(item.message)}</p>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
            `
            : '<div class="empty-state">Chưa có lịch sử nào. Hãy dùng phase và ghi chú để theo dõi ván.</div>'
        }
      </article>
    </section>
  `;
}

function renderSummary(gameState, getRoleDefinition) {
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

export function render(root, context) {
  const { gameState, roleOrder, getRoleDefinition, phases, currentPhase } = context;

  switch (gameState.screen) {
    case "howto":
      root.innerHTML = renderHowTo();
      return;
    case "setup":
      root.innerHTML = renderSetup(gameState, roleOrder, getRoleDefinition);
      return;
    case "reveal":
      root.innerHTML = renderReveal(gameState, getRoleDefinition);
      return;
    case "gm":
      root.innerHTML = renderGm(gameState, phases, currentPhase, getRoleDefinition);
      return;
    case "summary":
      root.innerHTML = renderSummary(gameState, getRoleDefinition);
      return;
    case "home":
    default:
      root.innerHTML = renderHome(gameState);
  }
}
