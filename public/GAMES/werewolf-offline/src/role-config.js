export const ROLE_ORDER = [
  "villager",
  "werewolf",
  "alpha_wolf",
  "seer",
  "guard",
  "witch",
  "hunter",
  "cupid",
  "fox",
  "jester"
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
  alpha_wolf: {
    id: "alpha_wolf",
    name: "Sói đầu đàn",
    team: "wolf",
    teamLabel: "Phe sói",
    icon: "🐺👑",
    summary: "Sói quyền lực nhất, dùng như sói thường.",
  },
  seer: {
    id: "seer",
    name: "Tiên tri",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🔮",
    summary: "Mỗi đêm soi một người để biết phe của họ.",
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
    summary: "Khi bị loại có thể phản đòn (bắn 1 người).",
  },
  cupid: {
    id: "cupid",
    name: "Thần tình yêu",
    team: "village",
    teamLabel: "Phe dân",
    icon: "👼",
    summary: "Ghép đôi 2 người yêu nhau. Một người chết, người kia chết theo.",
  },
  fox: {
    id: "fox",
    name: "Cáo",
    team: "village",
    teamLabel: "Phe dân",
    icon: "🦊",
    summary: "Mỗi đêm soi 3 người liên tiếp. Mất năng lực nếu không có sói.",
  },
  jester: {
    id: "jester",
    name: "Kẻ ngốc",
    team: "jester",
    teamLabel: "Phe riêng",
    icon: "🤡",
    summary: "Thắng ngay lập tức nếu bị dân làng treo cổ vào ban ngày.",
  }
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
