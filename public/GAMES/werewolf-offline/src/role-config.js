export const ROLE_ORDER = [
  "villager",
  "werewolf",
  "seer",
  "guard",
  "witch",
  "hunter",
];

export const ROLE_DEFINITIONS = {
  villager: {
    id: "villager",
    name: "Dân làng",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🧑",
    summary: "Ẩn mình, thảo luận và tìm ra Ma Sói.",
  },
  werewolf: {
    id: "werewolf",
    name: "Ma sói",
    team: "wolf",
    teamLabel: "Phe sói",
    icon: "🐺",
    summary: "Phối hợp bí mật và loại dần phe dân.",
  },
  seer: {
    id: "seer",
    name: "Tiên tri",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🔮",
    summary: "Mỗi đêm có thể soi một người để biết phe của họ.",
  },
  guard: {
    id: "guard",
    name: "Bảo vệ",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🛡️",
    summary: "Mỗi đêm chọn một người để bảo vệ khỏi nguy hiểm.",
  },
  witch: {
    id: "witch",
    name: "Phù thủy",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🧪",
    summary: "Điều phối cứu hoặc hạ độc theo luật nhóm đang dùng.",
  },
  hunter: {
    id: "hunter",
    name: "Thợ săn",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🏹",
    summary: "Khi bị loại có thể để lại pha phản đòn nếu nhóm áp dụng.",
  },
};

export function createEmptyRoleConfig() {
  return ROLE_ORDER.reduce((config, roleId) => {
    config[roleId] = 0;
    return config;
  }, {});
}

export function getRoleDefinition(roleId) {
  return ROLE_DEFINITIONS[roleId] ?? ROLE_DEFINITIONS.villager;
}

export function normalizeRoleConfig(roleConfig = {}) {
  return ROLE_ORDER.reduce((config, roleId) => {
    const rawValue = Number(roleConfig[roleId] ?? 0);
    config[roleId] = Number.isFinite(rawValue) ? Math.max(0, Math.floor(rawValue)) : 0;
    return config;
  }, createEmptyRoleConfig());
}

export function countRoles(roleConfig = {}) {
  return ROLE_ORDER.reduce((total, roleId) => total + Number(roleConfig[roleId] ?? 0), 0);
}

export function expandRolePool(roleConfig = {}) {
  return ROLE_ORDER.flatMap((roleId) =>
    Array.from({ length: Number(roleConfig[roleId] ?? 0) }, () => roleId),
  );
}
