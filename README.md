# CraftAgent Pro - AI Super Agent Platform

A modern, professional website for CraftAgent Pro - an AI super agent platform that allows users to create any type of AI agents using the CRAFT framework and beyond.

## Technology Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)** - Core web technologies
- **React** - Component-based UI framework for scalable development
- **Material Design Components (MDC)** - Google's Material Design system
- **Material Design 3 (Material You)** - Latest design principles

### Styling & Design
- **Material Icons** - Icon system
- **Google Fonts** - Typography (Roboto, Inter)
- **CSS Grid & Flexbox** - Layout systems
- **Mobile-first responsive design**

## Features

### CRAFT Framework
The platform implements 5 core specialized agent types:
- **Communication Agents** - Customer support, email management, social media
- **Research Agents** - Market research, competitive analysis, data gathering  
- **Analytics Agents** - Pattern recognition, predictive modeling, insights
- **Functional Agents** - Workflow automation, approvals, transactions
- **Technical Agents** - Software development, infrastructure, debugging

### Unlimited Custom Agents
Beyond the CRAFT framework, users can create any type of agents:
- Marketing Agents
- Sales Agents  
- HR Agents
- Finance Agents
- Legal Agents
- Healthcare Agents
- Education Agents
- Gaming Agents
- Creative Agents
- Any custom agent type

## Color Palette (Material Design 3)
- **Primary**: #6750A4 (Deep Purple)
- **Secondary**: #625B71 (Neutral Variant)  
- **Tertiary**: #7D5260 (Error complement)
- **Surface**: #FEF7FF (Light surface)
- **On-Surface**: #1D1B20 (Dark text)
- **Outline**: #79747E (Borders)

## Architecture

### Hybrid AI Approach
- **Enterprise AI Core**: Anthropic Claude & OpenAI GPT-4 for complex reasoning
- **Open-Source Flexibility**: Cost-optimized infrastructure with custom integrations

### Key Benefits
- 171% Average ROI
- 25% Productivity Increase  
- 30% Cost Reduction
- 96% Plan to Expand Usage

## Quick Start

### Automated Setup (Recommended)
```bash
# Start everything with one command (handles port cleanup automatically)
./start.sh

# Start with production build
./start.sh --build
```

### Manual Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment: `cp .env.example .env` and add your API keys
4. Start development server: `npm start`
5. Open browser to `http://localhost:3000`

## Development Scripts

### Service Management
- `./start.sh` - Complete development environment startup with automatic port cleanup
- `./start.sh --build` - Start with production build
- `Ctrl+C` - Stop all services when running start.sh

### Development Commands
- `npm start` - Start React development server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

### Environment Configuration
- Copy `.env.example` to `.env`
- Add your Anthropic API key: `REACT_APP_ANTHROPIC_API_KEY=your_key_here`
- Restart development server after changing environment variables


## File Structure
```
├── public/
│   ├── index.html      # React HTML template
│   └── manifest.json   # PWA manifest
├── src/
│   ├── components/     # React components
│   │   ├── common/     # Reusable components
│   │   ├── Header/     # Navigation component
│   │   ├── Hero/       # Hero section with CRAFT diagram
│   │   ├── Problem/    # Problem statement section
│   │   ├── CraftAgents/# CRAFT + custom agents showcase
│   │   ├── Hybrid/     # Technology architecture
│   │   ├── ROI/        # Statistics and results
│   │   ├── Pricing/    # Pricing tiers
│   │   ├── Integration/# Tool integrations
│   │   ├── Demo/       # Interactive demo tabs
│   │   ├── Trust/      # Trust indicators
│   │   └── CTA/        # Final call-to-action
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Theme and global styles
│   ├── App.js          # Main App component
│   └── index.js        # React entry point
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features
- React optimization with lazy loading
- CSS Grid and Flexbox for efficient layouts
- Material Design motion principles
- Mobile-first responsive design
- Optimized for Core Web Vitals

## Pricing Tiers
- **Starter**: $99/month - Pre-configured CRAFT agents
- **Professional**: $499/month - Custom agent creation + advanced integrations
- **Enterprise**: Custom pricing - Unlimited agents + white-label solutions

## React Implementation Features
The React version includes:
- **Component-based Architecture**: Modular, reusable components
- **Material-UI Integration**: Advanced Material Design 3 components
- **Framer Motion Animations**: Smooth, performant animations
- **Custom Hooks**: Scroll animations, counters, and interactions
- **Responsive Design**: Mobile-first, optimized for all devices
- **State Management**: React hooks for interactive features
- **Performance Optimized**: Lazy loading and intersection observers
- **SEO Ready**: Server-side rendering compatible structure

## License
Proprietary - CraftAgent Pro Platform
