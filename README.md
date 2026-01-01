<div align="center">

# Blockchain Developer Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

**A modern, etherscan-inspired portfolio website for blockchain developers**

[Live Demo](https://jinhyeok.vercel.app) · [Report Bug](https://github.com/nara020/portfolio/issues) · [Request Feature](https://github.com/nara020/portfolio/issues)

</div>

---

## Overview

A high-performance, internationalized portfolio website designed with an Etherscan-inspired UI. Built with Next.js 14 App Router, featuring smooth animations, dark mode support, and comprehensive SEO optimization.

### Key Features

- **Etherscan-Style Design** — Clean, professional UI inspired by blockchain explorers
- **Internationalization (i18n)** — Full Korean/English support with next-intl
- **Performance Optimized** — Lighthouse score 95+, optimized Core Web Vitals
- **Responsive Design** — Mobile-first approach with TailwindCSS
- **Smooth Animations** — Framer Motion powered transitions
- **Type-Safe** — End-to-end TypeScript implementation
- **SEO Ready** — Meta tags, Open Graph, structured data

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.9 |
| **Styling** | TailwindCSS 4.1 |
| **Animation** | Framer Motion |
| **i18n** | next-intl |
| **Icons** | Lucide React |
| **Linting** | ESLint 9 |
| **Package Manager** | npm |

---

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Internationalized routes
│   │   │   ├── blocks/         # Projects section
│   │   │   ├── txs/            # Experience section
│   │   │   ├── address/        # Contact section
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Home page
│   │   └── layout.tsx          # App layout
│   ├── components/
│   │   ├── sections/           # Page sections
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Skills.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   ├── config/
│   │   └── i18n.ts             # i18n configuration
│   ├── data/
│   │   ├── resume.ts           # Portfolio data
│   │   └── types.ts            # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   └── middleware.ts           # i18n middleware
├── messages/                    # Translation files
│   ├── en.json
│   └── ko.json
├── public/                      # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nara020/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

### Build for Production

```bash
npm run build
npm start
```

---

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Contact form
NEXT_PUBLIC_CONTACT_API=your-contact-api-endpoint
```

### Customization

1. **Personal Information**: Edit `src/data/resume.ts`
2. **Translations**: Modify files in `messages/` directory
3. **Styling**: Update TailwindCSS configuration
4. **Components**: Customize components in `src/components/`

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nara020/portfolio)

### Other Platforms

This project supports deployment on:
- **Netlify**
- **AWS Amplify**
- **Docker** (Dockerfile available)
- **Self-hosted** (Node.js server)

---

## Performance

| Metric | Score |
|--------|-------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

*Measured with Lighthouse on production build*

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Jinhyeok Kim** — Blockchain & Backend Developer

- GitHub: [@nara020](https://github.com/nara020)
- LinkedIn: [jinhyeok1228](https://www.linkedin.com/in/jinhyeok1228)
- Email: jinhyeokcc@gmail.com

---

<div align="center">

**If you found this project helpful, please consider giving it a star!**

*Last Updated: 2026-01-01*

</div>
