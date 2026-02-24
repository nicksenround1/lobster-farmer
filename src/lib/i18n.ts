export type Locale = "zh" | "en";

export const translations = {
  zh: {
    // Nav
    nav: {
      about: "关于",
      services: "服务",
      tools: "工具",
      community: "社区",
      contact: "联系",
    },
    // Hero
    hero: {
      title: "养虾户",
      subtitle: "Lobster Farmer",
      tagline: "养一池 AI 虾兵蟹将，替你 7×24 冲浪",
      description: "OpenClaw 资深玩家 · AI Agent 构建者 · Web3 投机专家",
      cta: "加入社区",
      learnMore: "了解更多",
    },
    // About
    about: {
      title: "关于我",
      p1: "我是一个 Web3 投机者、OpenClaw 深度用户、AI Agent 构建者。",
      p2: "我相信 AI Agent 是下一个生产力革命。通过 OpenClaw 平台，我构建了一套完整的 AI 自动化体系——从市场监控、Alpha 狙击到自动执行。",
      p3: "现在，我把这些能力开放给你。",
      highlight1: "6+",
      highlight1Label: "月 OpenClaw 深耕",
      highlight2: "20+",
      highlight2Label: "个 AI Agent 配置",
      highlight3: "24/7",
      highlight3Label: "全天候监控",
    },
    // Services
    services: {
      title: "服务",
      subtitle: "从零开始，帮你搭建 AI Agent 帝国",
      openclaw: {
        title: "OpenClaw 部署配置",
        desc: "从零到一帮你搭建 OpenClaw 环境，配置 Gateway、TG/Discord 机器人接入，让你的 AI Agent 真正跑起来。",
        tag: "热门",
      },
      persona: {
        title: "定制 AI 人格 & Skills",
        desc: "预构建的 Agent 人格模板、自定义 Skill 包。让你的 AI 像你一样思考、决策、执行。",
        tag: "定制",
      },
      api: {
        title: "GPTNB API 接入",
        desc: "Claude / GPT 等顶级模型的 API Token 代购服务。稳定、低价、即开即用。",
        tag: "API",
      },
      alpha: {
        title: "Alpha 情报服务",
        desc: "Crypto KOL 监控、链上数据分析、叙事追踪。信息差就是利润差。",
        tag: "Alpha",
      },
      comingSoon: "即将上线",
      joinWaitlist: "加入候补",
    },
    // Tools
    tools: {
      title: "技术栈",
      subtitle: "我的工具箱",
    },
    // Community
    community: {
      title: "加入社区",
      desc: "加入我们的 Telegram 群组，和一群 AI Agent 爱好者交流心得、分享 Alpha、共同成长。",
      join: "加入 Telegram 群",
      members: "成长中的社区",
    },
    // Contact
    contact: {
      title: "联系我",
      subtitle: "有想法？来聊聊。",
      twitter: "Twitter / X",
      telegram: "Telegram 群",
      email: "邮箱",
    },
    // Footer
    footer: {
      rights: "养虾户 · Lobster Farmer",
      tagline: "用 AI 养虾，用虾养 Alpha",
    },
  },
  en: {
    nav: {
      about: "About",
      services: "Services",
      tools: "Tools",
      community: "Community",
      contact: "Contact",
    },
    hero: {
      title: "养虾户",
      subtitle: "Lobster Farmer",
      tagline: "Raising a pond of AI lobsters to surf 24/7 for you",
      description: "OpenClaw Power User · AI Agent Builder · Web3 Speculator",
      cta: "Join Community",
      learnMore: "Learn More",
    },
    about: {
      title: "About Me",
      p1: "I'm a Web3 speculator, OpenClaw power user, and AI agent builder.",
      p2: "I believe AI agents are the next productivity revolution. Through OpenClaw, I've built a complete AI automation system — from market monitoring and alpha sniping to automated execution.",
      p3: "Now, I'm making these capabilities available to you.",
      highlight1: "6+",
      highlight1Label: "Months on OpenClaw",
      highlight2: "20+",
      highlight2Label: "AI Agent Configs",
      highlight3: "24/7",
      highlight3Label: "Always-On Monitoring",
    },
    services: {
      title: "Services",
      subtitle: "From zero to hero — build your AI Agent empire",
      openclaw: {
        title: "OpenClaw Setup & Config",
        desc: "End-to-end OpenClaw deployment — Gateway setup, TG/Discord bot integration. Get your AI agents actually running.",
        tag: "Popular",
      },
      persona: {
        title: "Custom AI Personas & Skills",
        desc: "Pre-built agent personality templates and custom skill packages. Make your AI think, decide, and execute like you.",
        tag: "Custom",
      },
      api: {
        title: "GPTNB API Access",
        desc: "API tokens for top models like Claude & GPT. Stable, affordable, plug-and-play.",
        tag: "API",
      },
      alpha: {
        title: "Alpha Intelligence Reports",
        desc: "Crypto KOL monitoring, on-chain analytics, narrative tracking. Information asymmetry = profit.",
        tag: "Alpha",
      },
      comingSoon: "Coming Soon",
      joinWaitlist: "Join Waitlist",
    },
    tools: {
      title: "Tech Stack",
      subtitle: "My Toolbox",
    },
    community: {
      title: "Join the Community",
      desc: "Join our Telegram group to exchange ideas, share alpha, and grow together with fellow AI agent enthusiasts.",
      join: "Join Telegram Group",
      members: "Growing Community",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Got ideas? Let's talk.",
      twitter: "Twitter / X",
      telegram: "Telegram Group",
      email: "Email",
    },
    footer: {
      rights: "养虾户 · Lobster Farmer",
      tagline: "Raising AI lobsters, farming alpha",
    },
  },
} as const;

// Deep mapped type to get string values instead of literal types
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<typeof translations.zh>;
