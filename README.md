# Avexel Website

## Introduction

This repository contains the source code for Avexel's website. Built with modern web technologies, it serves as our digital storefront and showcases our portfolio of work in web development and digital solutions.

## Technical Stack

- **Frontend Framework**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS
- **Performance Optimizations**: 
  - Lazy loading images
  - Optimized asset delivery
  - Responsive design patterns
- **Animation Libraries**:
  - Animate.css
  - Custom CSS transitions
- **Icon System**: Font Awesome Pro

## Development Setup

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/avexel/corporate-website.git
cd corporate-website
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Project Architecture

```
corporate-website/
├── src/
│   ├── assets/
│   │   ├── images/     # Optimized images and graphics
│   │   └── styles/     # Tailwind and custom CSS
│   ├── js/            # JavaScript modules
│   └── pages/         # Static pages and templates
├── public/            # Static assets
├── tailwind.config.js # Tailwind configuration
└── package.json      
```

## Build & Deployment

### Production Build

```bash
npm run build
```

### Quality Assurance

Before deploying:
1. Run tests: `npm test`
2. Check accessibility: `npm run a11y`
3. Validate markup: `npm run validate`

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

Internal team members should follow our [contribution guidelines](CONTRIBUTING.md) and coding standards.

## Security

Please report security vulnerabilities to security@avexel.co

## Legal

© 2024 Avexel. All rights reserved.  
For licensing information, see [LICENSE](LICENSE)

## Contact

- **Business Inquiries**: contact@avexel.co
- **Website**: [avexel.co](https://www.avexel.co)
