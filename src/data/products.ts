export interface SkillInfo {
  name: string;
  desc: { zh: string; en: string };
}

export interface VersionEntry {
  version: string;
  date: string;
  desc: { zh: string; en: string };
}

export interface CreatorInfo {
  name: string;
  desc: { zh: string; en: string };
  link?: string;
}

export interface Product {
  slug: string;
  icon: string;
  price: number;
  originalPrice: number;
  category: "starter" | "persona" | "bundle";
  tag: { zh: string; en: string };
  stripeLink: string;
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  oneLiner: { zh: string; en: string };
  features: { zh: string[]; en: string[] };
  includes: { zh: string[]; en: string[] };
  // Structured detail fields
  about: { zh: string[]; en: string[] };
  highlights: {
    zh: { title: string; desc: string }[];
    en: { title: string; desc: string }[];
  };
  skillsIncluded: SkillInfo[];
  antiPatterns?: { zh: string[]; en: string[] };
  provenStats: { zh: string[]; en: string[] };
  versionHistory: VersionEntry[];
  creator: CreatorInfo;
}

export const products: Product[] = [
  // ─────────────────────────────────────────────────
  // 1. Starter Pack 🎣 — $1
  // ─────────────────────────────────────────────────
  {
    slug: "starter-pack",
    icon: "🎣",
    price: 1,
    originalPrice: 20,
    category: "starter",
    tag: { zh: "限前 100 位", en: "First 100 Only" },
    stripeLink: "https://buy.stripe.com/28EaEY1LI7jM28w1lE2VG03",
    name: { zh: "入门包", en: "Starter Pack" },
    desc: {
      zh: "你的第一只 AI 龙虾 — $1 起步，30 分钟上手。经过实战验证的配置模板，不是空洞的占位符。",
      en: "Your first AI lobster — $1 to start, 30 min to set up. Battle-tested config templates, not empty placeholders.",
    },
    oneLiner: {
      zh: "你的第一只 AI 龙虾 — 30 分钟上手",
      en: "Your First AI Lobster — Up and Running in 30 Minutes",
    },
    features: {
      zh: [
        "SOUL.md — AI 人格定义模板",
        "IDENTITY.md — 身份与自我认知",
        "USER.md — 你的用户画像",
        "HEARTBEAT.md — 智能轮换心跳系统（带状态追踪）",
        "AGENTS.md — 完整工作手册（分级加载 + 记忆规范 + 安全过滤器）",
        "🆕 memoryFlush 预配置 — 防止长对话失忆",
        "🆕 Embedding 模型配置 — SiliconFlow bge-m3 一键接入",
        "🆕 高质量日志格式模板 — 提升 memorySearch 检索精度",
        "🆕 每周复盘模板 — 结构化回顾与规划",
        "Alpha Matrix 基础版 Skill（附赠🎁）",
        "Daily Briefing Skill（附赠🎁）",
        "DX Terminal 入门指南 Skill（附赠🎁）",
        "8 个 Cron Job 模板（含记忆维护、价格异动提醒）",
        "完整安装指南（中英双语）",
        "Telegram 社群入口",
      ],
      en: [
        "SOUL.md — AI personality definition template",
        "IDENTITY.md — Identity & self-awareness",
        "USER.md — Your user profile",
        "HEARTBEAT.md — Smart rotation heartbeat system (with state tracking)",
        "AGENTS.md — Complete work manual (tiered loading + memory rules + security filters)",
        "🆕 memoryFlush pre-config — prevent memory loss in long conversations",
        "🆕 Embedding model config — SiliconFlow bge-m3 one-click setup",
        "🆕 High-quality log format template — boost memorySearch accuracy",
        "🆕 Weekly review template — structured retrospective & planning",
        "Alpha Matrix Basic Skill (bonus 🎁)",
        "Daily Briefing Skill (bonus 🎁)",
        "DX Terminal Guide Skill (bonus 🎁)",
        "8 Cron Job templates (incl. memory maintenance, price alerts)",
        "Complete installation guide (bilingual)",
        "Telegram community access",
      ],
    },
    includes: {
      zh: [
        "5 个核心 .md 配置文件（全面升级版）",
        "3 个 Bonus Skills",
        "openclaw.json 配置片段（memoryFlush + Embedding）",
        "8 个 Cron Job 模板",
        "日志格式 + 周报模板",
        "安装指南",
        "TG 社群邀请链接",
      ],
      en: [
        "5 core .md config files (fully upgraded)",
        "3 Bonus Skills",
        "openclaw.json config snippets (memoryFlush + Embedding)",
        "8 Cron Job templates",
        "Log format + weekly review templates",
        "Installation guide",
        "TG community invite link",
      ],
    },
    about: {
      zh: [
        "刚装好 OpenClaw，面对空白的 SOUL.md 不知道写什么？你不是一个人。",
        "网上有免费教程教你概念和原理，但你还是得自己一行一行写配置。我们直接给你写好的——经过实战验证、在生产环境跑了数月的配置。复制、填入你的信息、启动。30 分钟，你的第一只 AI 龙虾就活了。",
        "v1.3 新增：memoryFlush 防失忆配置、Embedding 模型一键接入、高质量日志格式模板、DX Terminal 入门指南、8 个 Cron Job 模板。教程教概念，我们给配置——开箱即用，不需要从零摸索。",
        "诚实说明：这是入门包，不是完整方案。它能帮你快速上手，但如果你需要一个真正懂 Crypto、懂安全、能自主运作的 AI Agent，请看我们的 Persona 包。",
      ],
      en: [
        "Just installed OpenClaw, staring at a blank SOUL.md with no idea what to write? You're not alone.",
        "There are free tutorials teaching concepts and principles, but you still have to write configs line by line. We give you pre-built ones — battle-tested configs that have been running in production for months. Copy, fill in your details, launch. 30 minutes, your first AI lobster is alive.",
        "v1.3 NEW: memoryFlush anti-amnesia config, Embedding model one-click setup, high-quality log format templates, DX Terminal guide, 8 Cron Job templates. Tutorials teach concepts, we give configs — plug and play, no guesswork.",
        "Honest note: This is a starter pack, not a complete solution. It gets you up and running fast, but if you need an AI Agent that truly understands Crypto, security, and autonomous operation, check out our Persona pack.",
      ],
    },
    highlights: {
      zh: [
        { title: "30 分钟上手", desc: "从安装到运行，不需要读文档猜配置" },
        { title: "实战验证", desc: "不是理论模板，是真正跑了数月的生产配置" },
        { title: "即买即用", desc: "复制、填入信息、启动——三步搞定" },
        { title: "中英双语", desc: "配置文件和安装指南都支持中英文" },
        { title: "社群支持", desc: "购买即获 Telegram 社群入口，遇到问题随时问" },
      ],
      en: [
        { title: "30-min Setup", desc: "Install to running — no doc-guessing required" },
        { title: "Battle-tested", desc: "Not theoretical templates — real production configs used for months" },
        { title: "Plug & Play", desc: "Copy, fill in your info, launch — three steps" },
        { title: "Bilingual", desc: "Config files and install guide support both Chinese and English" },
        { title: "Community Support", desc: "Purchase includes Telegram community access for help" },
      ],
    },
    skillsIncluded: [
      {
        name: "Alpha Matrix Basic",
        desc: {
          zh: "Crypto KOL 动态监控基础版，追踪关键意见领袖的最新发言",
          en: "Basic Crypto KOL monitoring — track key opinion leaders' latest posts",
        },
      },
      {
        name: "Daily Briefing",
        desc: {
          zh: "每日简报：天气、日历、Crypto 价格一键速览",
          en: "Daily briefing: weather, calendar, crypto prices at a glance",
        },
      },
      {
        name: "DX Terminal Guide",
        desc: {
          zh: "DX Terminal PRO 入门指南 — Base 链上 AI Agent 自主交易市场参与指南",
          en: "DX Terminal PRO starter guide — how to participate in the Base on-chain AI Agent trading market",
        },
      },
    ],
    provenStats: {
      zh: [
        "5 个核心配置模板 + openclaw.json 配置片段，覆盖所有必要文件",
        "8 个 Cron Job 模板，开箱即用的自动化（含记忆维护）",
        "memoryFlush 配置防止长对话失忆 — 网上免费教程不会给你这个",
        "高质量日志格式模板，实测提升 memorySearch 检索命中率 2-3 倍",
        "已有 22+ 用户使用这套模板成功上手",
      ],
      en: [
        "5 core config templates + openclaw.json snippets covering all essential files",
        "8 Cron Job templates for out-of-the-box automation (incl. memory maintenance)",
        "memoryFlush config prevents memory loss in long conversations — free tutorials won't give you this",
        "High-quality log format template, proven to boost memorySearch hit rate 2-3x",
        "22+ users have successfully onboarded with these templates",
      ],
    },
    versionHistory: [
      {
        version: "1.3.0",
        date: "2026-02-27",
        desc: {
          zh: "重大更新：memoryFlush 防失忆配置、Embedding 模型片段、高质量日志模板、DX Terminal 指南 Skill、周报模板、8 个 Cron 模板、AGENTS.md 和 HEARTBEAT.md 全面升级",
          en: "Major update: memoryFlush config, Embedding model snippet, log format template, DX Terminal Guide Skill, weekly review template, 8 Cron templates, AGENTS.md & HEARTBEAT.md fully upgraded",
        },
      },
      {
        version: "1.2.0",
        date: "2026-02-20",
        desc: {
          zh: "新增 Daily Briefing Skill，更新 Cron 模板格式",
          en: "Added Daily Briefing Skill, updated Cron template format",
        },
      },
      {
        version: "1.1.0",
        date: "2025-01-15",
        desc: {
          zh: "加入 Alpha Matrix 基础版 Skill，优化安装指南",
          en: "Added Alpha Matrix Basic Skill, improved installation guide",
        },
      },
      {
        version: "1.0.0",
        date: "2024-12-01",
        desc: {
          zh: "首次发布：5 个核心配置模板 + 6 个 Cron 模板",
          en: "Initial release: 5 core config templates + 6 Cron templates",
        },
      },
    ],
    creator: {
      name: "养虾户 / Lobster Farmer",
      desc: {
        zh: "OpenClaw 资深玩家，6+ 个月深度使用经验。Web3 投机者，AI Agent 构建者。",
        en: "OpenClaw power user with 6+ months of deep experience. Web3 speculator and AI Agent builder.",
      },
      link: "https://x.com/lobster_farmer",
    },
  },

  // ─────────────────────────────────────────────────
  // 2. 养虾户 Persona 🦞 — $49
  // ─────────────────────────────────────────────────
  {
    slug: "lobster-persona",
    icon: "🦞",
    price: 49,
    originalPrice: 79,
    category: "persona",
    tag: { zh: "核心产品", en: "Core Product" },
    stripeLink: "https://buy.stripe.com/5kQbJ2aie33w28w8O62VG01",
    name: { zh: "养虾户 Persona", en: "Lobster Farmer Persona" },
    desc: {
      zh: "就是推里那只龙虾在用的完整系统——不是通用模板，是真实跑了半年、每天在用的 Crypto AI Agent 操作系统。拆解 Felix Craft 等顶级 Agent 后，结合 6 个月实战经验打磨而成。",
      en: "The exact system powering the lobster you see on Twitter — not a generic template, but a complete Crypto AI Agent OS battle-tested daily for 6+ months. Built by deconstructing top agents like Felix Craft, refined through real-world experience.",
    },
    oneLiner: {
      zh: "推里那只龙虾的完整系统，直接复制",
      en: "The Lobster's Exact System — Just Copy & Go",
    },
    features: {
      zh: [
        "完整 SOUL.md — 数月实战打磨的 Crypto 投机者人格",
        "IDENTITY.md + USER.md + HEARTBEAT.md + AGENTS.md",
        "ShadowOps Manual — 安全行动手册",
        "🎁 Alpha Matrix Pro — KOL 监控 + Whale Alert + 情绪分析",
        "🎁 Daily Briefing — 天气 + 日历 + Crypto 价格",
        "🎁 Twitter Skill — 内容创作 + 自动发帖",
        "🎁 Security Scan — 系统安全审计",
        "🎁 ReadX 集成说明",
        "🎁 DX Terminal PRO 参与指南（🆕 Agentic Trading）",
        "预配置 Cron Jobs（心跳/Alpha 报告/安全扫描）",
        "完整 README + 安装指南",
        "TG 社群 VIP 技术支持",
      ],
      en: [
        "Complete SOUL.md — Crypto speculator persona refined over months",
        "IDENTITY.md + USER.md + HEARTBEAT.md + AGENTS.md",
        "ShadowOps Manual — Security operations handbook",
        "🎁 Alpha Matrix Pro — KOL monitoring + Whale Alert + Sentiment analysis",
        "🎁 Daily Briefing — Weather + Calendar + Crypto prices",
        "🎁 Twitter Skill — Content creation + Auto posting",
        "🎁 Security Scan — System security audit",
        "🎁 ReadX integration guide",
        "🎁 DX Terminal PRO participation guide (🆕 Agentic Trading)",
        "Pre-configured Cron Jobs (heartbeat / Alpha report / security scan)",
        "Complete README + Installation guide",
        "TG community VIP technical support",
      ],
    },
    includes: {
      zh: [
        "完整 SOUL.md 人格文件",
        "4 个核心配置文件 (IDENTITY/USER/HEARTBEAT/AGENTS)",
        "ShadowOps Manual（安全手册）",
        "6 个 Skills（全部附赠，含 DX Terminal 🆕）",
        "预配置 Cron Jobs",
        "README + 安装指南",
        "TG VIP 群入口",
      ],
      en: [
        "Complete SOUL.md persona file",
        "4 core config files (IDENTITY/USER/HEARTBEAT/AGENTS)",
        "ShadowOps Manual (security handbook)",
        "6 Skills (all included free, incl. DX Terminal 🆕)",
        "Pre-configured Cron Jobs",
        "README + Installation guide",
        "TG VIP group access",
      ],
    },
    about: {
      zh: [
        "是的，这就是推上那只龙虾在用的完整配置。不是「灵感来自」，不是「参考了」——是同一套系统的直接导出。你买到的就是我每天在跑的东西。",
        "和 $1 Starter Pack 的核心区别：Starter Pack 给你空白模板（SOUL.md 要你自己填），Persona 给你一个已经写好、调好、跑了半年的完整人格。Starter Pack 的 Alpha Matrix 是概念演示，Persona 的是真正在用的 Pro 版——35+ KOL 实时监控、自动生成情报报告。Starter Pack 没有安全手册，Persona 有完整的 ShadowOps Manual（防注入、私钥保护、高危操作确认）。",
        "这个 Persona 诞生于真实的 Crypto 投机场景，拆解了 Felix Craft 等顶级 Agent 的架构，再结合 6 个月每天使用的实战经验打磨而成。它经历了牛市狂热和恐慌抛售，从数百次真实交互中学会了什么该做、什么绝对不能做。",
        "安全是内建的，不是附加的。ShadowOps Manual 定义了完整的 OpSec 准则——从防注入过滤到高危操作确认机制，从私钥保护到社交工程防御。你的 Agent 知道什么是危险的操作，会在执行前要求你确认。",
      ],
      en: [
        "Yes, this is the exact config the lobster on Twitter uses. Not \"inspired by\" or \"based on\" — it's a direct export of the same system. What you get is what runs daily.",
        "Core difference from $1 Starter Pack: Starter gives you blank templates (you fill in SOUL.md yourself). Persona gives you a complete personality already written, tuned, and battle-tested for 6+ months. Starter's Alpha Matrix is a concept demo; Persona's is the real Pro version — 35+ KOLs, real-time monitoring, auto-generated intel reports. Starter has no security manual; Persona includes the full ShadowOps Manual (anti-injection, key protection, high-risk confirmation).",
        "This Persona was born from real crypto speculation, built by deconstructing top agents like Felix Craft, then refined through 6 months of daily use. It has lived through bull euphoria and panic dumps, learning from hundreds of real interactions what works — and what absolutely doesn't.",
        "Security is built-in, not bolted on. The ShadowOps Manual defines complete OpSec guidelines — from prompt injection filtering to high-risk operation confirmation, from private key protection to social engineering defense. Your Agent knows what's dangerous and will ask before executing.",
      ],
    },
    highlights: {
      zh: [
        { title: "Crypto 原生人格", desc: "理解 DeFi、Meme 币、链上数据、KOL 生态——不是通用 AI 硬套关键词" },
        { title: "三层记忆系统", desc: "每日日志 + 长期记忆 + 工具笔记，像人类一样积累经验和认知" },
        { title: "安全优先架构", desc: "内建 OpSec 准则、防注入过滤、高危操作确认机制、社交工程防御" },
        { title: "自动化心跳", desc: "30 分钟心跳检测，自动发现崩溃进程并重启，7×24 不间断" },
        { title: "情报自动化", desc: "每日自动生成 Alpha 情报报告，追踪 35+ KOL 动态和 Whale 异动" },
        { title: "VIP 技术支持", desc: "购买即获 Telegram VIP 群入口，配置问题直接解答" },
      ],
      en: [
        { title: "Crypto-native Persona", desc: "Understands DeFi, meme coins, on-chain data, KOL ecosystem — not generic AI with crypto keywords" },
        { title: "3-Layer Memory System", desc: "Daily logs + long-term memory + tool notes — accumulates experience like a human" },
        { title: "Security-first Architecture", desc: "Built-in OpSec guidelines, injection filtering, high-risk confirmation, social engineering defense" },
        { title: "Automated Heartbeat", desc: "30-min heartbeat detection, auto-discovers crashed processes and restarts, 24/7 uptime" },
        { title: "Intel Automation", desc: "Daily auto-generated Alpha intelligence reports, tracking 35+ KOLs and whale movements" },
        { title: "VIP Tech Support", desc: "Purchase includes Telegram VIP group access with direct setup assistance" },
      ],
    },
    skillsIncluded: [
      {
        name: "Alpha Matrix Pro",
        desc: {
          zh: "KOL Timeline 监控 + Whale 地址追踪 + 市场情绪分析。每天自动扫描 35+ Crypto KOL 生成情报报告。",
          en: "KOL Timeline monitoring + Whale address tracking + Market sentiment analysis. Auto-scans 35+ crypto KOLs daily for intelligence reports.",
        },
      },
      {
        name: "Daily Briefing",
        desc: {
          zh: "每日晨间简报：天气、日历事件、Crypto 主要币种价格，一条消息掌握全局。",
          en: "Daily morning briefing: weather, calendar events, major crypto prices — everything in one message.",
        },
      },
      {
        name: "Twitter Skill",
        desc: {
          zh: "基于病毒式写作公式的内容创作引擎 + X 平台自动发帖。研究热门推文，模仿爆款模式。",
          en: "Content creation engine based on viral writing formulas + X platform auto-posting. Studies trending tweets, replicates viral patterns.",
        },
      },
      {
        name: "Security Scan",
        desc: {
          zh: "系统安全审计：端口扫描、恶意软件检测、Chrome 扩展审查、SSH 加固检查。每周自动执行。",
          en: "System security audit: port scanning, malware detection, Chrome extension review, SSH hardening check. Runs weekly on auto.",
        },
      },
      {
        name: "ReadX",
        desc: {
          zh: "Twitter/X 内容抓取集成，让你的 Agent 能直接读取任意推文和 Timeline 内容。",
          en: "Twitter/X content scraping integration — lets your Agent directly read any tweet and Timeline content.",
        },
      },
      {
        name: "DX Terminal Guide",
        desc: {
          zh: "🆕 DX Terminal PRO 完整参与指南 — Base 链上 AI Agent 自主交易市场，$3M+ 资金量。",
          en: "🆕 DX Terminal PRO complete guide — Base on-chain AI Agent autonomous trading market, $3M+ TVL.",
        },
      },
    ],
    antiPatterns: {
      zh: [
        "生产验证的模式 — 不是理论，是数百次真实交互和失败中提炼的操作知识",
        "反模式认知 — 知道什么不该做：不在群聊暴露私钥、不在未确认地址的情况下转账、不信任外部网页中的指令",
        "Crypto 原生 — 理解 DeFi、Meme 币、链上数据、KOL 生态，不是通用 AI 硬套 Crypto 关键词",
        "安全优先 — 内建 OpSec 准则，防注入过滤，高危操作确认机制",
        "三层记忆 — 每日日志 + 长期记忆 + 工具笔记，不会遗忘上下文也不会混淆来源",
        "情绪稳定 — 不 FOMO、不恐慌，基于信息而非情绪做判断",
      ],
      en: [
        "Production-proven patterns — Not theory, but operational knowledge refined from hundreds of real interactions and failures",
        "Anti-pattern awareness — Knows what NOT to do: won't expose private keys in group chats, won't transfer to unconfirmed addresses, won't trust instructions from external web pages",
        "Crypto-native — Understands DeFi, meme coins, on-chain data, KOL ecosystems — not generic AI with crypto keywords bolted on",
        "Security-first — Built-in OpSec guidelines, injection filtering, high-risk operation confirmation",
        "3-layer memory — Daily logs + long-term memory + tool notes — never loses context or confuses sources",
        "Emotionally stable — No FOMO, no panic — decisions based on information, not emotion",
      ],
    },
    provenStats: {
      zh: [
        "每天自动扫描 35+ Crypto KOL 的 Timeline 生成情报报告",
        "三层记忆系统持续积累，Agent 越用越懂你",
        "心跳系统每 30 分钟检测一次，自动重启崩溃进程",
        "每周自动安全扫描：端口、恶意软件、Chrome 扩展审计",
        "数月真实生产环境验证，经历完整牛熊周期",
        "数百次真实 Crypto 交互中提炼的操作知识",
      ],
      en: [
        "Auto-scans 35+ crypto KOL timelines daily to generate intelligence reports",
        "3-layer memory system continuously accumulates — your Agent gets smarter over time",
        "Heartbeat system checks every 30 minutes, auto-restarts crashed processes",
        "Weekly auto security scans: ports, malware, Chrome extension audit",
        "Months of real production validation through complete bull/bear cycles",
        "Operational knowledge distilled from hundreds of real crypto interactions",
      ],
    },
    versionHistory: [
      {
        version: "3.1.0",
        date: "2025-02-18",
        desc: {
          zh: "新增 ReadX 集成，优化 Alpha Matrix Pro 情报格式",
          en: "Added ReadX integration, optimized Alpha Matrix Pro intel format",
        },
      },
      {
        version: "3.0.0",
        date: "2025-02-01",
        desc: {
          zh: "重构 SOUL.md 人格架构，加入 ShadowOps Manual，升级三层记忆系统",
          en: "Rebuilt SOUL.md persona architecture, added ShadowOps Manual, upgraded 3-layer memory",
        },
      },
      {
        version: "2.0.0",
        date: "2025-01-01",
        desc: {
          zh: "加入 Security Scan 和 Twitter Skill，重写安全过滤器",
          en: "Added Security Scan and Twitter Skill, rewrote security filters",
        },
      },
      {
        version: "1.0.0",
        date: "2024-10-15",
        desc: {
          zh: "首次发布：SOUL.md + Alpha Matrix + Daily Briefing",
          en: "Initial release: SOUL.md + Alpha Matrix + Daily Briefing",
        },
      },
    ],
    creator: {
      name: "养虾户 / Lobster Farmer",
      desc: {
        zh: "OpenClaw 资深玩家，6+ 个月深度使用经验。Web3 投机者，AI Agent 构建者。这个 Persona 是他每天在用的真实配置——不是为了卖而写的产品。",
        en: "OpenClaw power user with 6+ months of deep experience. Web3 speculator and AI Agent builder. This Persona is his actual daily driver — not something written to sell.",
      },
      link: "https://x.com/lobster_farmer",
    },
  },

  // ─────────────────────────────────────────────────
  // 3. 养虾户 Bundle 📦 — $59
  // ─────────────────────────────────────────────────
  {
    slug: "lobster-bundle",
    icon: "📦",
    price: 59,
    originalPrice: 89,
    category: "bundle",
    tag: { zh: "最佳套餐", en: "Best Value" },
    stripeLink: "https://buy.stripe.com/eVq3cweyu1Zs3cAfcu2VG02",
    name: { zh: "养虾户 Bundle", en: "Lobster Farmer Bundle" },
    desc: {
      zh: "Persona + 40 页实战指南，一步到位。单买 $49 + $19 = $68，Bundle 只要 $59，省 $30。",
      en: "Persona + 40-page hands-on guide, all-in-one. Buying separately = $68, Bundle just $59. Save $30.",
    },
    oneLiner: {
      zh: "Persona + 指南，一步到位",
      en: "Persona + Guide, All-in-One",
    },
    features: {
      zh: [
        "🦞 养虾户 Persona 完整包（以上所有内容）",
        "📖 40+ 页 PDF 实战指南《养虾户指南》",
        "OpenClaw 从零到一完整教程",
        "AI Agent 配置最佳实践",
        "Crypto 自动化策略详解",
        "安全加固指南",
        "常见问题 FAQ 合集",
        "TG 社群 VIP 技术支持",
      ],
      en: [
        "🦞 Complete Lobster Farmer Persona (everything above)",
        "📖 40+ page PDF hands-on guide \"The Lobster Farmer Guide\"",
        "OpenClaw zero-to-one complete tutorial",
        "AI Agent configuration best practices",
        "Crypto automation strategy deep-dive",
        "Security hardening guide",
        "FAQ collection",
        "TG community VIP technical support",
      ],
    },
    includes: {
      zh: [
        "养虾户 Persona 完整包",
        "40+ 页《养虾户指南》PDF",
        "5 个 Skills（全部附赠）",
        "预配置 Cron Jobs",
        "ShadowOps Manual",
        "TG VIP 群入口",
      ],
      en: [
        "Complete Lobster Farmer Persona pack",
        "40+ page \"Lobster Farmer Guide\" PDF",
        "5 Skills (all included free)",
        "Pre-configured Cron Jobs",
        "ShadowOps Manual",
        "TG VIP group access",
      ],
    },
    about: {
      zh: [
        "如果你是完全零基础，想要一步到位拥有最完整的 AI Agent 方案——这就是你要找的。",
        "养虾户 Bundle = 完整的 Persona 包 + 40+ 页实战指南。Persona 给你能力，指南给你知识。两者结合，你不只是复制粘贴一个配置，而是真正理解每一行配置在做什么、为什么这样设计。",
        "《养虾户指南》覆盖从 OpenClaw 安装到高级 Crypto 自动化策略的全部内容。不是那种「请参阅官方文档」的链接合集——是作者自己踩过所有坑之后写的实战手册。每一章都有真实案例和具体操作步骤。",
        "价格对比：单买 Persona $49 + 指南单卖 $19 = $68。Bundle 价 $59，直接省 $30（相比原价 $89）。如果你本来就打算两个都买，没有理由不选 Bundle。",
        "适合人群：完全零基础、想要全套方案的用户。如果你已经是 OpenClaw 老手只需要 Persona，直接买 Persona 包就够了。",
      ],
      en: [
        "If you're starting from zero and want the most complete AI Agent package in one step — this is what you're looking for.",
        "Lobster Farmer Bundle = Complete Persona pack + 40+ page hands-on guide. The Persona gives you capability; the guide gives you understanding. Together, you don't just copy-paste a config — you truly understand what every line does and why it's designed that way.",
        "The Lobster Farmer Guide covers everything from OpenClaw installation to advanced crypto automation strategies. It's not a collection of \"see official docs\" links — it's a field manual written after the author stepped on every single landmine. Every chapter includes real cases and concrete steps.",
        "Price comparison: Persona alone $49 + Guide alone $19 = $68. Bundle price $59, saving you $30 (vs original $89). If you were planning to get both anyway, there's no reason not to choose the Bundle.",
        "Best for: Complete beginners who want the full solution. If you're an experienced OpenClaw user who just needs the Persona, the Persona pack alone is enough.",
      ],
    },
    highlights: {
      zh: [
        { title: "Persona + 指南", desc: "能力和知识，一步到位" },
        { title: "省 $30", desc: "相比原价 $89，Bundle 价 $59" },
        { title: "40+ 页实战手册", desc: "不是链接合集，是踩过所有坑后写的指南" },
        { title: "零基础友好", desc: "从安装 OpenClaw 开始，手把手带你走完全程" },
        { title: "包含完整 Persona", desc: "养虾户 Persona 的所有内容——Skills、Cron、安全手册，一个不少" },
        { title: "VIP 技术支持", desc: "配置过程中遇到任何问题，VIP 群直接问" },
      ],
      en: [
        { title: "Persona + Guide", desc: "Capability and knowledge, all in one" },
        { title: "Save $30", desc: "Bundle $59 vs original $89" },
        { title: "40+ Page Field Manual", desc: "Not a link collection — a guide written after stepping on every landmine" },
        { title: "Zero-to-Hero Friendly", desc: "Starting from OpenClaw installation, walk you through everything" },
        { title: "Complete Persona Included", desc: "Everything in the Persona pack — Skills, Crons, security manual, nothing left out" },
        { title: "VIP Tech Support", desc: "Any issues during setup? Ask directly in the VIP group" },
      ],
    },
    skillsIncluded: [
      {
        name: "Alpha Matrix Pro",
        desc: {
          zh: "KOL Timeline 监控 + Whale 地址追踪 + 市场情绪分析（Persona 内含）",
          en: "KOL Timeline monitoring + Whale address tracking + Market sentiment analysis (included in Persona)",
        },
      },
      {
        name: "Daily Briefing",
        desc: {
          zh: "每日晨间简报：天气、日历事件、Crypto 价格（Persona 内含）",
          en: "Daily morning briefing: weather, calendar events, crypto prices (included in Persona)",
        },
      },
      {
        name: "Twitter Skill",
        desc: {
          zh: "病毒式内容创作 + X 平台自动发帖（Persona 内含）",
          en: "Viral content creation + X platform auto-posting (included in Persona)",
        },
      },
      {
        name: "Security Scan",
        desc: {
          zh: "系统安全审计：端口、恶意软件、Chrome 扩展（Persona 内含）",
          en: "System security audit: ports, malware, Chrome extensions (included in Persona)",
        },
      },
      {
        name: "ReadX",
        desc: {
          zh: "Twitter/X 内容抓取集成（Persona 内含）",
          en: "Twitter/X content scraping integration (included in Persona)",
        },
      },
    ],
    provenStats: {
      zh: [
        "Persona + 40+ 页指南，覆盖从零到自动化的全部流程",
        "指南中包含 15+ 个真实案例和具体操作步骤",
        "比单独购买省 $30（$68 → $59）",
        "已有用户在 2 小时内完成从安装到全自动化部署",
      ],
      en: [
        "Persona + 40+ page guide covering the complete zero-to-automation workflow",
        "Guide includes 15+ real cases with concrete steps",
        "Save $30 vs buying separately ($68 → $59)",
        "Users have completed full automation deployment in under 2 hours",
      ],
    },
    versionHistory: [
      {
        version: "2.0.0",
        date: "2025-02-20",
        desc: {
          zh: "指南更新至第二版，Persona 同步至 v3.1.0",
          en: "Guide updated to 2nd edition, Persona synced to v3.1.0",
        },
      },
      {
        version: "1.0.0",
        date: "2025-01-10",
        desc: {
          zh: "首次发布：Persona v2.0.0 + 指南第一版",
          en: "Initial release: Persona v2.0.0 + Guide 1st edition",
        },
      },
    ],
    creator: {
      name: "养虾户 / Lobster Farmer",
      desc: {
        zh: "OpenClaw 资深玩家，6+ 个月深度使用经验。Web3 投机者，AI Agent 构建者。这个 Persona 是他每天在用的真实配置——不是为了卖而写的产品。",
        en: "OpenClaw power user with 6+ months of deep experience. Web3 speculator and AI Agent builder. This Persona is his actual daily driver — not something written to sell.",
      },
      link: "https://x.com/lobster_farmer",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(
  category: Product["category"]
): Product[] {
  return products.filter((p) => p.category === category);
}
