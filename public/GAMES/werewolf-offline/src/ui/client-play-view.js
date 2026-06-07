import { escapeHtml } from "./shared-components.js";

export function renderClientPlay(clientState) {
  if (!clientState) return '';
  const { role, alive, publicPhase, dayNightCounter, announcement, winState } = clientState;
  
  return `
    <section class="screen" style="display: flex; flex-direction: column; gap: 16px;">
      
      ${winState ? `
      <article class="panel" style="text-align: center; background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">
        <div class="panel-header" style="justify-content: center; padding-bottom: 0;">
          <h2 style="color: #bef7cb; font-size: 2rem;">🏆 ${escapeHtml(winState.winner)}</h2>
        </div>
        <p style="margin: 8px 0;">${escapeHtml(winState.reason)}</p>
      </article>
      ` : `
      <article class="panel" style="text-align: center; background: ${alive ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-color: ${alive ? 'rgba(139, 92, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'};">
        <div class="panel-header" style="justify-content: center; padding-bottom: 0;">
          <h2 style="color: ${alive ? '#ddd1ff' : '#fca5a5'};">${alive ? 'SỐNG' : 'ĐÃ CHẾT'}</h2>
        </div>
        <p class="muted" style="margin-top: 8px;">${escapeHtml(dayNightCounter)}</p>
      </article>
      `}

      <article class="role-card">
        <div class="role-content">
          <div class="role-icon">${role.icon}</div>
          <div class="role-team">${role.teamLabel}</div>
          <h3 class="role-name">${role.name}</h3>
          <p>${role.summary}</p>
        </div>
      </article>

      ${winState ? `
      <article class="panel">
        <div class="panel-header">
          <h2>Danh sách vai trò</h2>
        </div>
        <div class="player-list">
          ${winState.revealedRoles.map(r => `
            <div class="vote-row">
              <div class="player-meta">
                <strong>${escapeHtml(r.name)}</strong>
              </div>
              <span class="badge" style="background: rgba(255,255,255,0.1)">${r.icon} ${r.roleName}</span>
            </div>
          `).join('')}
        </div>
      </article>
      ` : `
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2 style="color: var(--accent-3);">📢 Thông báo Làng</h2>
          </div>
        </div>
        <div style="padding: 16px 0; font-size: 1.1rem; line-height: 1.5; text-align: center;">
          ${announcement ? `<div style="margin-bottom: 12px; font-weight: bold; color: var(--accent-1);">${escapeHtml(announcement)}</div>` : ''}
          ${escapeHtml(publicPhase)}
        </div>
      </article>
      `}
      
      <div class="footer-actions">
        <button class="btn btn-ghost" data-action="client-disconnect" style="opacity: 0.7;">Thoát ván chơi</button>
      </div>

      ${clientState.error ? `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; padding: 20px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
        <h2 style="color: #fca5a5; margin-bottom: 8px;">Mất kết nối</h2>
        <p style="color: #ddd; margin-bottom: 24px;">${escapeHtml(clientState.error)}</p>
        <button class="btn btn-primary" data-action="client-reconnect-submit" ${clientState.isReconnecting ? 'disabled' : ''}>
          ${clientState.isReconnecting ? 'Đang thử lại...' : 'Thử kết nối lại'}
        </button>
        <button class="btn btn-ghost" data-action="client-disconnect" style="margin-top: 16px;">Thoát</button>
      </div>
      ` : ''}
    </section>
  `;
}
