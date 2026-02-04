# Edgelligence

**Unveiling the Intelligent Edge: AI for and on the Network Periphery**

A modern, responsive research group website built with React, Vite, and Tailwind CSS.

## About Edgelligence

At the forefront of edge intelligence, our research group relentlessly pursues breakthroughs. By fostering a culture of diverse perspectives, we cultivate an environment that unlocks the power of AI at the network edge, pioneering the future of intelligent, distributed computing.

### Research Areas

- **AI for the Edge**: We develop AI techniques to optimize edge computing performance, enabling faster processing and smarter decision-making at the network edge.
- **AI at the Edge**: We unlock the potential of distributed and federated learning, allowing AI models to run efficiently on edge devices, unlocking new possibilities for secure and localized intelligence.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Edgelligence/website.git
cd website

# Install dependencies
npm install
```

### Development

For full-stack development (with API functionality):
```bash
# First time setup: apply database migrations
npm run db:migrate

# Start the development server
npm run dev:full
```

This runs the full Cloudflare Pages stack locally with a D1 database. Access the site at the URL shown (typically `http://localhost:8788`).

For frontend-only development (API calls will fail):
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Project Structure

```
├── public/
│   ├── config/
│   │   └── config.json      # Social media and organization configuration
│   └── favicon.png          # Site favicon
├── src/
│   ├── components/
│   │   ├── Footer.jsx       # Footer with social media icons
│   │   ├── Hero.jsx         # Hero section with heading and subtext
│   │   └── Newsletter.jsx   # Email signup form
│   ├── App.jsx              # Main app component
│   ├── index.css            # Tailwind CSS imports
│   └── main.jsx             # React entry point
├── docs/
│   └── NOTIFY_ME.md         # Newsletter feature documentation
└── README.md
```

## Configuration

Social media links are configured in `public/config/config.json`. The website loads this configuration at runtime.

### Supported Platforms

- GitHub
- Twitter/X
- LinkedIn
- Instagram
- Facebook
- YouTube
- Email

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Edgelligence
