# Time Tracking Application

## Overview

This is a full-stack time tracking application built with React and Express. The app allows users to track their daily time allocations with a timer interface, view usage statistics, configure settings for daily time limits and active days, and manage their time balance across multiple days. The application features a modern UI with dark mode support and uses localStorage for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: 
  - React Query for server state management
  - Local React state with custom hooks for client-side state
  - Custom hooks pattern for business logic encapsulation
- **Build Tool**: Vite with ESM modules

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server Structure**: Minimal REST API setup with route registration pattern
- **Development Server**: Vite integration for HMR in development
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Error Handling**: Centralized error middleware

### Data Storage Solutions
- **Primary Storage**: localStorage for client-side persistence
- **Database Configuration**: Drizzle ORM configured for PostgreSQL (not currently used)
- **Schema Management**: Zod schemas for runtime validation and TypeScript types
- **Data Models**: Time entries, settings, and timer state with full CRUD operations

### Authentication and Authorization
- No authentication system currently implemented
- Application runs as single-user client-side app
- Session management configured but not utilized

### Client-Side State Management
- **Time Tracking Logic**: Custom hooks managing time entries, balance calculations, and timer operations
- **Settings Management**: Persistent user preferences for daily time limits, active days, and dark mode
- **Timer State**: Real-time timer with pause/resume functionality and automatic time usage tracking
- **UI State**: Modal management, toast notifications, and theme switching

### Component Architecture
- **Atomic Design**: Reusable UI components in `/components/ui/`
- **Feature Components**: Business logic components for timer display, statistics, and modals
- **Custom Hooks**: Encapsulated business logic for time tracking, timer management, and dark mode
- **Type Safety**: Full TypeScript coverage with shared schemas between client and server

### Development Workflow
- **Hot Module Replacement**: Vite development server with React Fast Refresh
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Build Process**: Separate client and server builds with ESM output
- **Path Aliases**: Organized imports with `@/` for client code and `@shared/` for shared schemas

## External Dependencies

### UI and Styling
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

### Development Tools
- **Vite**: Build tool with development server and HMR
- **TypeScript**: Static type checking and enhanced developer experience
- **React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Data Management
- **Zod**: Schema validation and TypeScript type generation
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation for client-side entities

### Backend Infrastructure
- **Express**: Web application framework
- **Drizzle**: SQL query builder and ORM (configured but not actively used)
- **Neon Database**: Serverless PostgreSQL (configured but not actively used)

### Optional Integrations
- **Replit Integration**: Development environment optimizations and banner injection
- **Connect PG Simple**: PostgreSQL session store (configured but not used)