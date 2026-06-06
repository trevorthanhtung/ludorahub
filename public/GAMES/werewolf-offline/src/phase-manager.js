export const PHASES = [
  {
    key: "night",
    label: "Đêm",
    shortLabel: "Đêm",
    description: "Mọi người nhắm mắt, quản trò bắt đầu chu kỳ đêm.",
  },
  {
    key: "wolf",
    label: "Sói thức",
    shortLabel: "Sói",
    description: "Mời Ma Sói thức dậy và thống nhất mục tiêu.",
  },
  {
    key: "seer",
    label: "Tiên tri thức",
    shortLabel: "Tiên tri",
    description: "Mời Tiên tri soi một người chơi.",
  },
  {
    key: "guard",
    label: "Bảo vệ thức",
    shortLabel: "Bảo vệ",
    description: "Mời Bảo vệ chọn người được bảo vệ.",
  },
  {
    key: "witch",
    label: "Phù thủy thức",
    shortLabel: "Phù thủy",
    description: "Mời Phù thủy dùng cứu / độc theo luật nhóm.",
  },
  {
    key: "morning",
    label: "Sáng",
    shortLabel: "Sáng",
    description: "Thông báo kết quả đêm và mở mắt toàn bộ.",
  },
  {
    key: "discussion",
    label: "Thảo luận",
    shortLabel: "Thảo luận",
    description: "Người chơi tranh luận, suy luận và bảo vệ mình.",
  },
  {
    key: "voting",
    label: "Treo cổ",
    shortLabel: "Bỏ phiếu",
    description: "Chốt người bị treo và xử lý hậu quả.",
  },
];

export function createInitialPhase() {
  return {
    index: 0,
    key: PHASES[0].key,
    label: PHASES[0].label,
    cycle: 1,
    changedAt: Date.now(),
  };
}

export function getCurrentPhase(phaseState) {
  return PHASES[phaseState?.index ?? 0] ?? PHASES[0];
}

export function getNextPhaseTransition(phaseState) {
  const currentIndex = phaseState?.index ?? 0;
  const nextIndex = (currentIndex + 1) % PHASES.length;
  const wrapped = nextIndex === 0;
  const nextPhase = PHASES[nextIndex];

  return {
    phase: {
      index: nextIndex,
      key: nextPhase.key,
      label: nextPhase.label,
      cycle: wrapped ? (phaseState?.cycle ?? 1) + 1 : (phaseState?.cycle ?? 1),
      changedAt: Date.now(),
    },
    wrapped,
  };
}
