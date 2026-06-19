import { countRoles } from "../role-config.js";
import { escapeHtml } from "./shared-components.js";
import { StorageAdapter } from "../storage-adapter.js";

export function renderSetup(gameState, roleOrder, getRoleDefinition) {
  const { setup } = gameState;
  const totalRoles = countRoles(setup.roleConfig);
  const customPresets = StorageAdapter.getCustomPresets();
  const isValid = (setup.validation || { isValid: false }).isValid;

  // Role chips — only active roles
  const activeRoleChips = roleOrder
    .filter((roleId) => setup.roleConfig[roleId] > 0)
    .map((roleId) => {
      const role = getRoleDefinition(roleId);
      const shortName = role.name
        .replace("Dân làng", "Dân")
        .replace("Ma sói", "Sói")
        .replace("Tiên tri", "Tiên tri")
        .replace("Bảo vệ", "Bảo vệ")
        .replace("Phù thủy", "Phù thủy");
      return `<span class="sv-chip"><span class="sv-chip-name">${shortName}</span><strong class="sv-chip-count">${setup.roleConfig[roleId]}</strong></span>`;
    })
    .join("");

  // Player list — 2 columns
  const players = setup.players || [];
  const playerItems = players
    .map(
      (player, index) => `
      <label class="sv-player-row">
        <span class="sv-player-num">${player.order}</span>
        <input
          class="sv-player-input"
          data-player-name="${index}"
          value="${escapeHtml(player.name)}"
          maxlength="32"
          placeholder="Người chơi ${player.order}"
        />
      </label>
    `
    )
    .join("");

  // Advanced accordion — role tweak + custom presets
  const roleTweakRows = roleOrder
    .map((roleId) => {
      const role = getRoleDefinition(roleId);
      const count = setup.roleConfig[roleId];
      const dimmed = count === 0 ? "sv-tweak-dim" : "";
      return `
        <div class="sv-tweak-row ${dimmed}">
          <span class="sv-tweak-name">${role.name}</span>
          <input
            class="sv-tweak-input"
            data-role-count="${roleId}"
            type="number"
            min="0"
            max="15"
            value="${count}"
          />
        </div>
      `;
    })
    .join("");

  const customPresetList =
    customPresets.length > 0
      ? `<div class="sv-custom-list">
          ${customPresets
            .map(
              (preset) => `
            <div class="sv-custom-item">
              <span class="sv-custom-label">${preset.playerCount} người</span>
              <div class="sv-custom-actions">
                <button class="sv-btn-xs sv-btn-xs-sec" data-action="setup-load-preset" data-preset-id="${preset.id}">Tải</button>
                <button class="sv-btn-xs sv-btn-xs-del" data-action="setup-delete-preset" data-preset-id="${preset.id}">Xóa</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>`
      : `<p class="sv-muted-sm">Chưa có preset tùy chỉnh.</p>`;

  return `
    <section class="screen setup-screen sv-screen">
      <div class="sv-wrap">

        <header class="sv-header">
          <h2 class="sv-title">Thiết lập ván</h2>
        </header>

        <div class="sv-body">

          <!-- LEFT PANEL -->
          <div class="sv-panel sv-panel-left">

            <!-- 1. Player count -->
            <div class="sv-block sv-block-count">
              <span class="sv-section-label">Số người chơi</span>
              <div class="sv-stepper">
                <button type="button" class="sv-step-btn" data-action="setup-decrease" aria-label="Giảm">−</button>
                <input
                  id="playerCount"
                  class="sv-step-val"
                  data-player-count
                  type="number"
                  min="5"
                  max="15"
                  value="${setup.playerCount}"
                  readonly
                />
                <button type="button" class="sv-step-btn" data-action="setup-increase" aria-label="Tăng">+</button>
              </div>
            </div>

            <!-- 2. Role summary chips -->
            <div class="sv-block">
              <span class="sv-section-label">Vai trò hiện tại</span>
              <div class="sv-chips">
                ${activeRoleChips || `<span class="sv-muted-sm">Chưa có vai nào.</span>`}
              </div>
            </div>

            <!-- 3. Preset tabs -->
            <div class="sv-block">
              <span class="sv-section-label">Chọn preset</span>
              <div class="sv-preset-tabs">
                <button type="button" class="sv-preset-tab" data-action="setup-apply-preset" data-preset-mode="basic">Cơ bản</button>
                <button type="button" class="sv-preset-tab" data-action="setup-apply-preset" data-preset-mode="balanced">Cân bằng</button>
                <button type="button" class="sv-preset-tab" data-action="setup-apply-preset" data-preset-mode="chaos">Hỗn loạn</button>
              </div>
              <p class="sv-preset-desc">Khuyên dùng cho nhóm ${setup.playerCount} người. Nhấn để tự động chia vai trò.</p>
            </div>

            <!-- 4. Advanced accordion -->
            <details class="sv-accordion">
              <summary class="sv-accordion-summary">Tùy chọn nâng cao</summary>
              <div class="sv-accordion-body">

                <div class="sv-adv-section">
                  <p class="sv-adv-title">Tùy chỉnh vai trò</p>
                  <div class="sv-tweak-list">
                    ${roleTweakRows}
                  </div>
                </div>

                <div class="sv-adv-section">
                  <p class="sv-adv-title">Preset của tôi</p>
                  ${customPresetList}
                  <button class="sv-btn-ghost" data-action="setup-save-preset">Lưu preset hiện tại</button>
                </div>

              </div>
            </details>

          </div><!-- /LEFT PANEL -->

          <!-- RIGHT PANEL -->
          <div class="sv-panel sv-panel-right">
            <span class="sv-section-label">Danh sách người chơi</span>
            <div class="sv-player-grid">
              ${playerItems}
            </div>
          </div><!-- /RIGHT PANEL -->

        </div><!-- /sv-body -->

        <!-- BOTTOM ACTION BAR -->
        <div class="sv-action-bar">
          <div class="sv-action-status">
            <span class="sv-status-icon ${isValid ? "sv-ok" : "sv-err"}">${isValid ? "✓" : "!"}</span>
            <div class="sv-status-text">
              <strong class="${isValid ? "sv-text-ok" : "sv-text-err"}">
                ${isValid ? "Sẵn sàng chia vai" : "Chưa hợp lệ"}
              </strong>
              <span>${isValid ? `${setup.playerCount} người • ${totalRoles} vai` : "Tổng vai trò phải bằng số người chơi."}</span>
            </div>
          </div>
          <div class="sv-action-btns">
            <button class="sv-btn-back" data-action="nav-home">Quay lại</button>
            <button class="sv-btn-cta" data-action="setup-assign" ${!isValid ? "disabled" : ""}>Chia vai</button>
          </div>
        </div>

      </div><!-- /sv-wrap -->
    </section>
  `;
}
