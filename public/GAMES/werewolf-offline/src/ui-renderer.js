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
      root.innerHTML = renderGm(gameState, phases, currentPhase, getRoleDefinition, context.networkAdapter);
      return;
    case "summary":
      root.innerHTML = renderSummary(gameState, getRoleDefinition);
      return;
    case "host-lobby":
      root.innerHTML = renderHostLobby(gameState.hostLobby?.roomCode, gameState.hostLobby?.players || []);
      return;
    case "client-join":
      root.innerHTML = renderClientJoin(gameState.clientStatus?.error);
      return;
    case "client-wait":
      root.innerHTML = renderClientWait(gameState.clientStatus);
      return;
    case "client-play":
      root.innerHTML = renderClientPlay(gameState.clientStatus);
      return;
    case "home":
    default:
      root.innerHTML = renderHome(gameState);
  }
}
