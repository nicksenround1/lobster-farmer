# 🦞 养虾户 | Lobster Farmer

> 养一池 AI 虾兵蟹将，替你 7×24 冲浪  
> Raising a pond of AI lobsters to surf 24/7 for you

Personal brand landing page for OpenClaw/AI agent services, community, and API reselling.

## Features

- 🌐 **Bilingual** — Chinese/English seamless toggle
- 🌙 **Dark/Light mode** with system preference support
- 📐 **Bento grid layout** — Tobias Leitner inspired design
- 📱 **Fully responsive** — Mobile + Desktop
- ⚡ **Next.js 16 + Tailwind CSS v4** — Modern stack
- 🚀 **Static export** — Deploy anywhere

## Sections

- **Hero** — Name, tagline, social links
- **About** — Background & stats
- **Services** — Bento grid of offerings (Coming Soon)
- **Tech Stack** — Tools showcase
- **Community** — Telegram group invite
- **Contact** — Social links & CTA

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nicksenround1/lobster-farmer)

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Geist Font](https://vercel.com/font) — Clean typography

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles + dark mode
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page composition
│   └── providers.tsx    # Theme + Locale providers
├── components/
│   ├── Navbar.tsx       # Navigation + toggles
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About + stats
│   ├── Services.tsx     # Bento grid services
│   ├── Tools.tsx        # Tech stack showcase
│   ├── Community.tsx    # Telegram community CTA
│   ├── Contact.tsx      # Contact cards
│   └── Footer.tsx       # Footer
├── context/
│   ├── LocaleContext.tsx # i18n context (zh/en)
│   └── ThemeContext.tsx  # Dark/light theme context
└── lib/
    └── i18n.ts          # Translation strings
```

## License

MIT

---

Built with 🦞 by [养虾户](https://x.com/ckn_acee)
