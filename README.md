# Edgelligence

**Unveiling the Intelligent Edge: AI for and on the Network Periphery**

A modern, responsive research group website built with React, Vite, and Tailwind CSS, deployed on Vercel.

## About Edgelligence

At the forefront of edge intelligence, our research group relentlessly pursues breakthroughs. By fostering a culture of diverse perspectives, we cultivate an environment that unlocks the power of AI at the network edge, pioneering the future of intelligent, distributed computing.

### Research Areas

- **AI for the Edge**: We develop AI techniques to optimize edge computing performance, enabling faster processing and smarter decision-making at the network edge.
- **AI on the Edge**: We unlock the potential of distributed and federated learning, allowing AI models to run efficiently on edge devices, unlocking new possibilities for secure and localized intelligence.

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

Start the development server:
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
│   │   └── config.json       # Social media and organization configuration
│   └── favicon.png           # Site favicon
├── src/
│   ├── components/
│   │   ├── Footer.jsx        # Footer with social media icons
│   │   ├── Header.jsx        # Header with theme toggle
│   │   ├── Hero.jsx          # Hero section with heading and subtext
│   │   └── Newsletter.jsx    # Email signup form
│   ├── contexts/
│   │   ├── ThemeContext.jsx   # Theme provider component
│   │   └── ThemeContextBase.js # Theme context definition
│   ├── hooks/
│   │   └── useTheme.js       # Custom hook for theme access
│   ├── App.jsx               # Main app component
│   ├── index.css             # Tailwind CSS imports and global styles
│   └── main.jsx              # React entry point
├── api/
│   ├── health.js             # Health check endpoint
│   └── subscribe.js          # Email subscription endpoint
├── docs/
│   └── NOTIFY_ME.md          # Newsletter feature documentation
├── vercel.json               # Vercel deployment configuration
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

## Deployment

This project is configured for deployment on Vercel.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will automatically detect the Vite configuration
4. Click "Deploy"

Alternatively, use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Database Setup

This project uses Neon Postgres (serverless) for data persistence. Set up your database:

1. Create a Neon database at [neon.tech](https://neon.tech) (free tier available)
2. Copy your connection string
3. In Vercel dashboard, add environment variable:
   - `edgelligence_DATABASE_URL`: Your Neon Postgres connection string

4. Initialize the database by running the SQL script in `scripts/init-db.sql` in your Neon console

### Environment Variables

Set these environment variables in the Vercel dashboard (Settings > Environment Variables):

| Variable | Description | Required |
|----------|-------------|----------|
| `edgelligence_DATABASE_URL` | Neon Postgres connection string | **Yes** |
| `IP_SALT` | Salt for IP address hashing | Optional |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Edgelligence
