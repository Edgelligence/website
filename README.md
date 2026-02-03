# Edgelligence

**Unveiling the Intelligent Edge: AI for and on the Network Periphery**

A modern, responsive research group website built with React, Vite, and Tailwind CSS. Features a dark-themed UI, newsletter signup, and mobile-optimized design.

## 🌟 About Edgelligence

At the forefront of edge intelligence, our research group relentlessly pursues breakthroughs. By fostering a culture of diverse perspectives, we cultivate an environment that unlocks the power of AI at the network edge, pioneering the future of intelligent, distributed computing.

### Research Areas

- **AI for the Edge**: We develop AI techniques to optimize edge computing performance, enabling faster processing and smarter decision-making at the network edge.
- **AI at the Edge**: We unlock the potential of distributed and federated learning, allowing AI models to run efficiently on edge devices, unlocking new possibilities for secure and localized intelligence.

Shape the future of next-level computing, one intelligent edge at a time: join our team!

![Desktop View](https://github.com/user-attachments/assets/9c5c8055-3ca4-4716-bfd9-f2791bb9f9ab)

## 🚀 Features

- **Modern React Stack**: Built with React 19.2.0 and Vite 7.3.1
- **Tailwind CSS v4**: Latest version with Vite plugin integration
- **Dark Theme**: Elegant gradient background with gray-900 to gray-800
- **Responsive Design**: Mobile-first approach, fully responsive across all devices
- **Newsletter Signup**: Functional email input with success state feedback
- **Social Media Icons**: Footer with placeholder icons for Twitter/X, LinkedIn, GitHub, and Instagram
- **Clean Architecture**: Organized component structure in separate files

## 📦 Project Structure

```
src/
├── App.jsx              # Main app component
├── components/
│   ├── Hero.jsx         # Hero section with heading and subtext
│   ├── Newsletter.jsx   # Email signup form with state management
│   └── Footer.jsx       # Footer with social media icons
├── index.css            # Tailwind CSS imports
└── main.jsx             # React entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Edgelligence/edgelligence.github.io.git
cd edgelligence.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. 

The deployment process:
1. GitHub Actions workflow builds the Vite application
2. The built files from the `dist/` directory are deployed to GitHub Pages
3. The site becomes available at https://edgelligence.github.io/

To manually trigger a deployment, go to the Actions tab in the repository and run the "Deploy to GitHub Pages" workflow.

## 🎨 Customization

### Update Content

- **Hero Section**: Edit `src/components/Hero.jsx` to update the research group's mission and research areas
- **Newsletter**: Modify `src/components/Newsletter.jsx` to integrate with your email service
- **Footer**: Update `src/components/Footer.jsx` to add actual social media links

### Styling

The project uses Tailwind CSS v4. You can customize the design by modifying the Tailwind classes in the components.

## 📱 Responsive Design

The landing page is fully responsive and optimized for:
- Desktop (1920px and above)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with ❤️ by Edgelligence
