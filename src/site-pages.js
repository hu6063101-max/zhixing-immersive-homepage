export const navigationPages = [
  { id: "home", path: "/", label: "首页", code: "00" },
  { id: "map", path: "/map", label: "认知地图", code: "01" },
  { id: "system", path: "/system", label: "知行体系", code: "02" },
  { id: "practice", path: "/practice", label: "行动训练场", code: "03" },
  { id: "journal", path: "/journal", label: "实践日志", code: "04" },
  { id: "commitment", path: "/commitment", label: "行动承诺", code: "05" },
  { id: "models", path: "/models", label: "认知模型", code: "06" },
  { id: "proof", path: "/proof", label: "结果印证", code: "07" },
  { id: "principles", path: "/principles", label: "原则与边界", code: "08" },
];

export const contentPages = {
  system: {
    eyebrow: "THE SYSTEM / 知行体系",
    title: "知道，做到，得到。",
    intro: "知识不是收藏品。每一层认知都必须经过行动，被结果印证，再回到新的认知。",
    stats: [["05", "知识层级"], ["12", "主题区域"], ["100", "行动坐标"]],
    themeIds: ["knowing", "benefits", "coherence"],
  },
  practice: {
    eyebrow: "THE PRACTICE / 行动训练场",
    title: "先出来，再谈如何走远。",
    intro: "行动不是冲动，而是用最小一步进入真实世界，让反馈开始发生。",
    stats: [["01", "现在开始"], ["07", "连续行动"], ["∞", "持续修正"]],
    themeIds: ["action", "promise", "attention"],
  },
  journal: {
    eyebrow: "THE JOURNAL / 实践日志",
    title: "记录每一次认知被现实改写。",
    intro: "日志不是证明你努力过，而是留下行动、反馈、修正与结果的证据。",
    stats: [["100", "观察"], ["12", "复盘主题"], ["01", "当下"]],
    themeIds: ["errors", "feedback", "honesty"],
  },
  models: {
    eyebrow: "THE MODELS / 认知模型",
    title: "从价值观，到具体事件。",
    intro: "有效的道理可以逐层落地：价值观、原则、模型、数据、事件，层层彼此印证。",
    stats: [["05", "认知层次"], ["03", "归因步骤"], ["01", "结果"]],
    themeIds: ["knowing", "honesty", "errors"],
  },
  proof: {
    eyebrow: "THE PROOF / 结果印证",
    title: "战绩，比声音更响亮。",
    intro: "结果不是唯一目的，但它是认知是否真实、行动是否有效的清晰反馈。",
    stats: [["00", "空谈"], ["01", "行动"], ["100", "印证"]],
    themeIds: ["benefits", "errors", "promise"],
  },
  principles: {
    eyebrow: "THE BOUNDARIES / 原则与边界",
    title: "把注意力，交还给自己。",
    intro: "有边界才有自由。知道什么值得进入心智，也知道什么应该留在门外。",
    stats: [["01", "自己的课题"], ["00", "无效噪音"], ["∞", "自由"]],
    themeIds: ["attention", "relationships", "separation", "desire"],
  },
};

export function resolvePage(pathname) {
  const cleaned = pathname.replace(/\/+$/, "") || "/";
  const match = navigationPages.find((page) => cleaned === page.path || cleaned.endsWith(page.path));
  return match ?? navigationPages[0];
}

