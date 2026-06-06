import { renderHome, renderHowTo } from "./ui/home-view.js";
import { renderSetup } from "./ui/setup-view.js";
import { renderReveal } from "./ui/reveal-view.js";
import { renderGm } from "./ui/gm-view.js";
import { renderSummary } from "./ui/summary-view.js";

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
