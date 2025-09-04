# replit.md

## Overview

This is a complete Brazilian tax and benefits calculator web application providing online tools for calculating INSS (social security), FGTS (employment fund), and IRRF (income tax withholding). The application is built as a modern React SPA with TypeScript and Tailwind CSS, optimized for Google AdSense monetization, mobile-first responsive design, and SEO. It's specifically designed for deployment on shared hosting platforms like cPanel/HostGator without requiring Node.js on the server.

## Project Status

✅ **COMPLETED** - Expanded calculator platform with CalculoExato.com.br features:

### **Core Calculators (Original)**
- ✅ INSS Calculator - Social security contributions
- ✅ FGTS Calculator - Employment fund deposits
- ✅ IRRF Calculator - Income tax withholding

### **New Advanced Calculators (CalculoExato-style)**
- ✅ **Rescisão Trabalhista CLT** - Complete severance calculation with all benefits
- ✅ **Correção Monetária** - Monetary correction using IPCA, IGP-M, CDI, SELIC indices
- ✅ **Reajuste de Aluguel** - Rent adjustment calculator per Tenancy Law
- ✅ **Seguro-Desemprego** - Unemployment insurance value and installments

### **Platform Features**
- ✅ Categorized navigation (Labor vs Financial calculators)
- ✅ Dropdown menus in header for better organization
- ✅ Popular calculators section highlighting most-used tools
- ✅ Enhanced home page with category sections
- ✅ Complete PHP backend APIs for dynamic calculations
- ✅ Google AdSense integration with strategic placement
- ✅ SEO optimization with structured data for all pages
- ✅ Mobile-first responsive design
- ✅ Core Web Vitals optimized build
- ✅ cPanel/HostGator deployment ready

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript for type safety and modern development practices
- **Routing**: React Router DOM for client-side navigation between calculator pages
- **Styling**: Tailwind CSS 4.x for utility-first styling with custom design system
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: Local React state (useState) for calculator inputs and results

### Component Structure
- **Layout Components**: Reusable Header and Footer components with responsive navigation
- **Calculator Pages**: Dedicated pages for each calculator type (INSS, FGTS, IRRF) with form inputs and result displays
- **SEO Components**: SEOHead component for dynamic meta tag management and StructuredData component for schema markup
- **Ad Components**: AdSenseUnit component for Google AdSense integration with configurable slots

### SEO Strategy
- Dynamic meta tag updates using useEffect hooks in calculator components
- Structured data implementation with JSON-LD for better search engine understanding
- Canonical URL management for proper indexing
- Page-specific SEO configurations stored in centralized seo.ts utility

### Monetization
- Google AdSense integration with multiple ad placements (header, calculator sections, footer)
- Placeholder Publisher ID that needs to be replaced with actual AdSense account
- Responsive ad units configured for different screen sizes

### Deployment Configuration
- Static site generation targeting shared hosting environments
- Relative path configuration for assets (base: './')
- Manual chunk splitting for optimized loading (vendor chunks for React libraries)
- Production build outputs to 'dist' directory for easy cPanel deployment

## External Dependencies

### Core Frontend Stack
- **React & React DOM 19**: UI library and DOM rendering
- **React Router DOM 7**: Client-side routing
- **TypeScript 5**: Type safety and enhanced development experience
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite 7**: Build tool and development server

### Development Tools
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing
- **@vitejs/plugin-react**: Vite plugin for React support
- **TypeScript Node types**: Type definitions for Node.js APIs

### Third-Party Services
- **Google AdSense**: Advertisement monetization platform (requires publisher ID configuration)
- **Google Fonts**: Inter font family for typography
- **Schema.org**: Structured data markup for SEO

### Backend Services (Planned)
- **PHP API endpoints**: Server-side calculation endpoints for INSS, FGTS, and IRRF calculations
- **cPanel/HostGator hosting**: Shared hosting environment for deployment
- **.htaccess configuration**: URL rewriting and server configuration for SPA routing

### Browser APIs
- **Web APIs**: Document manipulation for dynamic SEO tag updates
- **Fetch API**: HTTP requests to backend calculation endpoints
- **Local Storage**: Potential for storing user preferences (not currently implemented)