export type Locale = "zh" | "en";

export const translations = {
  zh: {
    // Nav
    nav: {
      about: "关于",
      services: "服务",
      products: "产品",
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
      title: "产品",
      subtitle: "三个产品，从入门到完整方案",
      buyNow: "立即购买",
      viewAll: "查看全部产品",
      first100: "前 100 位 · $1",
      viewDetails: "查看详情",
    },
    // Products page
    products: {
      title: "产品",
      subtitle: "选择适合你的 AI Agent 配置包",
      viewDetails: "查看详情",
      buyNow: "立即购买",
      features: "功能特性",
      includes: "包含内容",
      backToProducts: "← 返回产品列表",
      save: "省",
      // Detail page sections
      aboutTitle: "关于这个产品",
      highlightsTitle: "核心亮点",
      skillsTitle: "🎁 所有 Skills 内含",
      antiPatternsTitle: "和通用 Prompt 的区别",
      provenTitle: "实战验证",
      whatsIncluded: "包含什么",
      versionHistoryTitle: "版本历史",
      creatorTitle: "创作者",
      buyFor: "购买",
      limited: "限时特价",
      bestValue: "最佳套餐",
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
      products: "Products",
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
      title: "Products",
      subtitle: "Three products — from starter to complete solution",
      buyNow: "Buy Now",
      viewAll: "View All Products",
      first100: "First 100 · $1",
      viewDetails: "View Details",
    },
    products: {
      title: "Products",
      subtitle: "Choose the AI Agent config pack that fits you",
      viewDetails: "View Details",
      buyNow: "Buy Now",
      features: "Features",
      includes: "What's Included",
      backToProducts: "← Back to Products",
      save: "Save",
      aboutTitle: "About This Product",
      highlightsTitle: "Core Highlights",
      skillsTitle: "🎁 All Skills Included",
      antiPatternsTitle: "What Makes This Different",
      provenTitle: "Battle-Tested",
      whatsIncluded: "What's Included",
      versionHistoryTitle: "Version History",
      creatorTitle: "Creator",
      buyFor: "Buy for",
      limited: "Limited Offer",
      bestValue: "Best Value",
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
