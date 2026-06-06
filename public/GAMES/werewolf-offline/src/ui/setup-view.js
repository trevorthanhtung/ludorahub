import { countRoles } from "../role-config.js";
import { escapeHtml } from "./shared-components.js";
import { StorageAdapter } from "../storage-adapter.js";

export function renderSetup(gameState, roleOrder, getRoleDefinition) {
  const { setup } = gameState;
  const totalRoles = countRoles(setup.roleConfig);
  const customPresets = StorageAdapter.getCustomPresets();

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
              <h3>Cấu hình Role hiện tại</h3>
              <p>Tổng role phải bằng đúng số người chơi.</p>
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
            <button class="btn btn-secondary" data-action="setup-apply-preset">Áp dụng preset tự động</button>
            <button class="btn btn-secondary" data-action="setup-save-preset">Lưu thành Custom Preset</button>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Custom Presets</h2>
            <p>Load cấu hình bạn đã lưu.</p>
          </div>
        </div>
        ${customPresets.length > 0 ? `
          <div class="preset-list">
            ${customPresets.map(preset => `
              <div class="preset-card">
                <div class="preset-meta">
                  <strong>Cấu hình ${preset.playerCount} người</strong>
                </div>
                <div class="preset-actions">
                  <button class="btn btn-secondary btn-sm" data-action="setup-load-preset" data-preset-id="${preset.id}">Tải</button>
                  <button class="btn btn-danger btn-sm" data-action="setup-delete-preset" data-preset-id="${preset.id}">Xóa</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `<div class="empty-state">Chưa có preset tùy chỉnh nào.</div>`}
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Tùy chỉnh role</h2>
            <p>Chỉnh tay nếu muốn.</p>
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

      <article class="panel" style="grid-column: 1 / -1;">
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
