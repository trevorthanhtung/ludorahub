import { renderHome, renderHowTo } from "./ui/home-view.js";
import { renderSetup } from "./ui/setup-view.js";
import { renderReveal } from "./ui/reveal-view.js";
import { renderGm } from "./ui/gm-view.js";
import { renderSummary } from "./ui/summary-view.js";
import { renderHostLobby } from "./ui/host-lobby-view.js";
import { renderClientJoin } from "./ui/client-join-view.js";
import { renderClientWait } from "./ui/client-wait-view.js";
import { renderClientPlay } from "./ui/client-play-view.js";

export function render(root, context) {
  const { gameState, roleOrder, getRoleDefinition, phases, currentPhase } = context;

  try {
    let htmlContent = "";
    switch (gameState.screen) {
      case "home":
      case "hub":
        htmlContent = renderHome();
        break;
      case "howto":
        htmlContent = renderHowTo();
        break;
      case "setup":
        htmlContent = renderSetup(gameState, roleOrder, getRoleDefinition);
        break;
      case "reveal":
        htmlContent = renderReveal(gameState, getRoleDefinition);
        break;
      case "gm":
        htmlContent = renderGm(gameState, phases, currentPhase, getRoleDefinition, context.networkAdapter);
        break;
      case "summary":
        htmlContent = renderSummary(gameState, getRoleDefinition);
        break;
      case "host-lobby":
        htmlContent = renderHostLobby(gameState.hostLobby?.roomCode, gameState.hostLobby?.players || []);
        break;
      case "client-join":
        htmlContent = renderClientJoin(gameState.clientStatus?.error);
        break;
      case "client-wait":
        htmlContent = renderClientWait(gameState.clientStatus);
        break;
      case "client-play":
        htmlContent = renderClientPlay(gameState.clientStatus);
        break;
      case "home":
      default:
        htmlContent = renderHome(gameState);
    }
    root.innerHTML = htmlContent;
  } catch (err) {
    console.error("Lỗi Render UI:", err);
    root.innerHTML = `
      <div style="color: #ff6b6b; padding: 32px; background: #2d1010; height: 100vh; overflow: auto; font-family: monospace;">
        <h2 style="margin-top: 0;">App Crashed (Blank Screen Prevented)</h2>
        <p><strong>Screen:</strong> ${gameState.screen}</p>
        <p><strong>Error:</strong> ${err.message}</p>
        <pre style="white-space: pre-wrap; font-size: 14px; background: rgba(0,0,0,0.3); padding: 16px;">${err.stack}</pre>
        <button onclick="localStorage.removeItem('ludora:werewolf:state'); window.location.reload();" style="padding: 8px 16px; margin-top: 16px; cursor: pointer;">
          Xóa Save Game & Tải Lại
        </button>
      </div>
    `;
  }
}
