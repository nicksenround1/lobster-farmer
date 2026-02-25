export interface Product {
  slug: string;
  icon: string;
  price: number;
  originalPrice: number;
  upsellPrice?: number;
  tag: { zh: string; en: string };
  category: "starter" | "core" | "premium" | "bundle";
  stripeLink?: string;
  features: { zh: string[]; en: string[] };
  includes: { zh: string[]; en: string[] };
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  longDesc: { zh: string; en: string };
}

export const products: Product[] = [
  {
    slug: "starter-pack",
    icon: "🎣",
    price: 1,
    originalPrice: 10,
    category: "starter",
    tag: { zh: "限时", en: "Limited" },
    features: {
      zh: [
        "OpenClaw 配置模板 (SOUL/IDENTITY/USER/HEARTBEAT/AGENTS)",
        "Alpha Matrix 基础版 Skill",
        "每日简报 Skill",
        "6 个 Cron Job 模板",
        "完整安装指南",
      ],
      en: [
        "OpenClaw config templates (SOUL/IDENTITY/USER/HEARTBEAT/AGENTS)",
        "Alpha Matrix Basic Skill",
        "Daily Briefing Skill",
        "6 Cron Job templates",
        "Complete installation guide",
      ],
    },
    includes: {
      zh: ["10 个配置文件", "2 个 Skills", "Cron 模板"],
      en: ["10 config files", "2 Skills", "Cron templates"],
    },
    stripeLink: "https://buy.stripe.com/28EaEY1LI7jM28w1lE2VG03",
    name: { zh: "入门包", en: "Starter Pack" },
    desc: {
      zh: "OpenClaw 零基础入门套餐，$1 起步，快速搭建你的第一个 AI Agent。",
      en: "OpenClaw starter kit — get your first AI Agent up and running for just $1.",
    },
    longDesc: {
      zh: "专为 OpenClaw 新手设计的入门套餐。包含完整的配置模板、基础 Skill 和 Cron Job 模板，让你从零开始快速搭建自己的 AI Agent 自动化体系。附带详细安装指南，即使你是纯小白也能在 30 分钟内上手。",
      en: "Designed for OpenClaw beginners. Includes complete config templates, basic Skills, and Cron Job templates to quickly build your AI Agent automation system from scratch. Comes with a detailed installation guide — even complete newbies can get started in 30 minutes.",
    },
  },
  {
    slug: "alpha-hunter-pro",
    icon: "💰",
    price: 29,
    originalPrice: 49,
    upsellPrice: 24,
    category: "core",
    tag: { zh: "Crypto", en: "Crypto" },
    stripeLink: "",
    features: {
      zh: [
        "Alpha Matrix 高级版 (KOL 监控 / Whale Alert / 新币发现)",
        "Bankr 交易集成",
        "Token 安全扫描",
        "情绪分析雷达",
        "多链持仓追踪",
        "交易日志模板",
        "风控指南",
      ],
      en: [
        "Alpha Matrix Pro (KOL Monitoring / Whale Alert / New Token Discovery)",
        "Bankr trading integration",
        "Token security scanner",
        "Sentiment analysis radar",
        "Multi-chain portfolio tracking",
        "Trade journal templates",
        "Risk management guide",
      ],
    },
    includes: {
      zh: ["SOUL.md (华尔街之狼人格)", "5 个 Skills", "3 个 Cron 模板", "交易模板"],
      en: ["SOUL.md (Wolf of Wall Street persona)", "5 Skills", "3 Cron templates", "Trade templates"],
    },
    name: { zh: "Alpha 猎手 Pro", en: "Alpha Hunter Pro" },
    desc: {
      zh: "Crypto 全方位狙击工具包。KOL 监控、Whale Alert、情绪分析，抢先一步发现 Alpha。",
      en: "Complete crypto alpha toolkit. KOL monitoring, whale alerts, sentiment analysis — stay one step ahead.",
    },
    longDesc: {
      zh: "专为 Crypto 投机者打造的高级工具包。集成 Alpha Matrix 高级版，实时监控 KOL 动态、Whale 地址和新币发布。配合 Bankr 交易集成和 Token 安全扫描，让你从发现 Alpha 到执行交易全链路自动化。附带华尔街之狼人格 SOUL.md，让你的 AI Agent 成为最狠的交易搭档。",
      en: "Premium toolkit built for crypto speculators. Integrates Alpha Matrix Pro for real-time KOL monitoring, whale address tracking, and new token discovery. Combined with Bankr trading integration and token security scanning, automate your entire flow from alpha discovery to trade execution. Includes Wolf of Wall Street SOUL.md persona for the most ruthless AI trading partner.",
    },
  },
  {
    slug: "entrepreneur-pro",
    icon: "💼",
    price: 66,
    originalPrice: 99,
    upsellPrice: 55,
    category: "premium",
    tag: { zh: "企业家", en: "Business" },
    features: {
      zh: [
        "创业合伙人人格",
        "邮件自动管理",
        "日历智能调度",
        "项目管理集成",
        "内容营销引擎",
        "财务追踪",
        "会议纪要",
        "多 Agent 团队架构",
        "周报自动生成",
      ],
      en: [
        "Startup co-founder persona",
        "Auto email management",
        "Smart calendar scheduling",
        "Project management integration",
        "Content marketing engine",
        "Financial tracking",
        "Meeting minutes",
        "Multi-Agent team architecture",
        "Auto weekly report generation",
      ],
    },
    includes: {
      zh: ["SOUL.md (创业合伙人人格)", "6 个 Skills", "3 个 Cron 模板", "4 个商业模板"],
      en: ["SOUL.md (Startup co-founder persona)", "6 Skills", "3 Cron templates", "4 business templates"],
    },
    name: { zh: "创业家 Pro", en: "Entrepreneur Pro" },
    desc: {
      zh: "AI 创业合伙人。邮件、日历、项目管理、内容营销全自动化，让你专注于最重要的事。",
      en: "Your AI co-founder. Automate email, calendar, project management & content marketing. Focus on what matters.",
    },
    longDesc: {
      zh: "将你的 AI Agent 打造成一个全能创业合伙人。从邮件自动管理、日历智能调度到项目管理集成，覆盖创业者日常工作的每个环节。内容营销引擎帮你持续产出高质量内容，财务追踪和周报自动生成让你随时掌握全局。多 Agent 团队架构支持多个 AI 协同工作，真正实现一个人的军队。",
      en: "Transform your AI Agent into an all-in-one startup co-founder. From auto email management and smart calendar scheduling to project management integration, covering every aspect of a founder's daily work. Content marketing engine keeps high-quality content flowing, while financial tracking and auto weekly reports keep you in control. Multi-Agent team architecture enables multiple AIs working in concert — a true one-person army.",
    },
  },
  {
    slug: "content-creator",
    icon: "✍️",
    price: 29,
    originalPrice: 49,
    upsellPrice: 24,
    category: "core",
    tag: { zh: "创作者", en: "Creator" },
    features: {
      zh: [
        "病毒式写作引擎",
        "Twitter/X 全自动运营",
        "Thread 构建器",
        "内容日历管理",
        "趋势发现",
        "一文多用 (推文→LinkedIn→Newsletter)",
        "10 种爆款推文公式",
        "X 算法解读",
      ],
      en: [
        "Viral writing engine",
        "Twitter/X full automation",
        "Thread builder",
        "Content calendar management",
        "Trend discovery",
        "Content repurposing (Tweet→LinkedIn→Newsletter)",
        "10 viral tweet formulas",
        "X algorithm breakdown",
      ],
    },
    includes: {
      zh: ["SOUL.md (创意总监人格)", "6 个 Skills", "3 个 Cron 模板", "增长指南"],
      en: ["SOUL.md (Creative Director persona)", "6 Skills", "3 Cron templates", "Growth guide"],
    },
    name: { zh: "内容创作套件", en: "Content Creator Suite" },
    desc: {
      zh: "病毒式写作 + X 全自动运营。10 种爆款公式、Thread 构建器，一文多用。",
      en: "Viral writing + full X automation. 10 viral formulas, thread builder, content repurposing.",
    },
    longDesc: {
      zh: "专为内容创作者和 KOL 打造的全方位工具包。病毒式写作引擎基于 10 种经过验证的爆款公式，帮你持续产出高互动内容。Twitter/X 全自动运营覆盖发推、Thread 构建、趋势发现和内容日历管理。一文多用功能自动将推文转化为 LinkedIn 帖子和 Newsletter，最大化每篇内容的价值。",
      en: "Comprehensive toolkit for content creators and KOLs. The viral writing engine uses 10 proven formulas to consistently produce high-engagement content. Full Twitter/X automation covers tweeting, thread building, trend discovery, and content calendar management. Content repurposing automatically transforms tweets into LinkedIn posts and newsletters, maximizing every piece of content.",
    },
  },
  {
    slug: "developer-toolkit",
    icon: "🛠️",
    price: 22,
    originalPrice: 39,
    upsellPrice: 18,
    category: "core",
    tag: { zh: "开发者", en: "Dev" },
    features: {
      zh: [
        "AI 代码审查",
        "Git 工作流自动化",
        "智能调试助手",
        "文档自动生成",
        "CI/CD 监控",
        "安全审计",
        "PR 模板",
      ],
      en: [
        "AI code review",
        "Git workflow automation",
        "Smart debugging assistant",
        "Auto documentation generation",
        "CI/CD monitoring",
        "Security audit",
        "PR templates",
      ],
    },
    includes: {
      zh: ["SOUL.md (10x 工程师人格)", "6 个 Skills", "3 个 Cron 模板", "开发模板"],
      en: ["SOUL.md (10x Engineer persona)", "6 Skills", "3 Cron templates", "Dev templates"],
    },
    name: { zh: "开发者工具箱", en: "Developer Toolkit" },
    desc: {
      zh: "AI 代码审查、Git 自动化、智能调试。把你的 Agent 变成 10x 工程师搭档。",
      en: "AI code review, Git automation, smart debugging. Turn your Agent into a 10x engineer partner.",
    },
    longDesc: {
      zh: "将你的 AI Agent 打造成一个 10x 工程师搭档。AI 代码审查自动发现潜在问题和优化机会，Git 工作流自动化减少重复操作，智能调试助手加速 bug 定位。文档自动生成和 PR 模板让你的代码库始终保持高标准。CI/CD 监控和安全审计全天候运行，确保代码质量和安全性。",
      en: "Transform your AI Agent into a 10x engineer partner. AI code review automatically spots potential issues and optimization opportunities. Git workflow automation reduces repetitive tasks. Smart debugging assistant accelerates bug resolution. Auto documentation and PR templates keep your codebase at high standards. CI/CD monitoring and security audits run 24/7.",
    },
  },
  {
    slug: "privacy-security",
    icon: "🔒",
    price: 25,
    originalPrice: 39,
    upsellPrice: 20,
    category: "core",
    tag: { zh: "安全", en: "Security" },
    features: {
      zh: [
        "Veil 隐私交易 (ZK)",
        "OpSec 审计",
        "主机安全加固",
        "密码管理",
        "安全检查清单",
        "事件响应模板",
      ],
      en: [
        "Veil private transactions (ZK)",
        "OpSec audit",
        "Host security hardening",
        "Password management",
        "Security checklist",
        "Incident response templates",
      ],
    },
    includes: {
      zh: ["SOUL.md (安全顾问人格)", "4 个 Skills", "安全模板"],
      en: ["SOUL.md (Security Advisor persona)", "4 Skills", "Security templates"],
    },
    name: { zh: "隐私安全包", en: "Privacy & Security Pack" },
    desc: {
      zh: "ZK 隐私交易、OpSec 审计、主机加固。你的数字堡垒，滴水不漏。",
      en: "ZK private transactions, OpSec audit, host hardening. Your digital fortress, watertight.",
    },
    longDesc: {
      zh: "在 Web3 世界，安全就是一切。这个套餐将你的 AI Agent 变成一个专业安全顾问。Veil 隐私交易基于零知识证明，保护你的链上隐私。OpSec 审计和主机安全加固全面检查你的数字足迹。密码管理、安全检查清单和事件响应模板，让你在面对威胁时从容应对。",
      en: "In Web3, security is everything. This pack transforms your AI Agent into a professional security advisor. Veil private transactions use zero-knowledge proofs to protect your on-chain privacy. OpSec audit and host security hardening comprehensively review your digital footprint. Password management, security checklists, and incident response templates keep you prepared for any threat.",
    },
  },
  {
    slug: "ultimate-bundle",
    icon: "🎯",
    price: 99,
    originalPrice: 265,
    category: "bundle",
    tag: { zh: "全家桶", en: "All-in-One" },
    features: {
      zh: [
        "包含以上所有产品",
        "独家 Multi-Agent 团队架构",
        "优先获得更新",
        "一键全部安装",
      ],
      en: [
        "Includes all products above",
        "Exclusive Multi-Agent team architecture",
        "Priority updates",
        "One-click install all",
      ],
    },
    includes: {
      zh: ["全部 6 个产品包", "独家 Bonus 内容"],
      en: ["All 6 product packs", "Exclusive bonus content"],
    },
    name: { zh: "全家桶", en: "Ultimate Bundle" },
    desc: {
      zh: "全部 6 个产品包 + 独家 Bonus。省 $166，一步到位拥有完整 AI Agent 帝国。",
      en: "All 6 packs + exclusive bonus. Save $166, build your complete AI Agent empire in one step.",
    },
    longDesc: {
      zh: "终极套餐，包含养虾户所有产品。从入门配置到 Crypto 狙击、创业管理、内容营销、开发工具和安全防护，一步到位。独家 Multi-Agent 团队架构让多个 AI Agent 协同工作，打造真正的 AI 军团。享受优先更新和一键安装，省去一个个单独配置的麻烦。相比单独购买省 $166。",
      en: "The ultimate package — everything Lobster Farmer offers. From starter configs to crypto sniping, business management, content marketing, dev tools, and security — all in one. Exclusive Multi-Agent team architecture enables multiple AI Agents working together as a true AI army. Priority updates and one-click install. Save $166 compared to buying individually.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return products.filter((p) => p.category === category);
}
