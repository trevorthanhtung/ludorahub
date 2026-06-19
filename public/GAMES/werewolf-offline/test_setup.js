import { renderSetup } from "./src/ui/setup-view.js";

const gameState = {
  setup: {
    playerCount: 5,
    roleConfig: { wolf: 1, villager: 4 },
    players: [{order: 1, name: "A"}],
    validation: { isValid: true }
  }
};
const roleOrder = ["wolf", "villager"];
const getRoleDefinition = (id) => ({ name: id === "wolf" ? "Ma sói" : "Dân làng" });

try {
  const html = renderSetup(gameState, roleOrder, getRoleDefinition);
  console.log("Success! HTML length:", html.length);
} catch (e) {
  console.error("Runtime Error in renderSetup:", e);
}
