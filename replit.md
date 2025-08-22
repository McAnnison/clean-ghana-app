# Overview

Clean Ghana is a comprehensive waste management platform that connects citizens, cleaning agencies, and government authorities to improve sanitation across Ghana. The application enables citizens to report waste issues, agencies to manage cleanup requests, and administrators to oversee city-wide operations through role-based dashboards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript, utilizing a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety and component reusability
- **Routing**: Wouter for lightweight client-side routing with role-based navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui for consistent, accessible design system
- **Styling**: Tailwind CSS with custom Ghana-themed color palette and CSS variables
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

The application implements role-based dashboards (citizen, agency, admin) with distinct interfaces and functionality for each user type.

## Backend Architecture

The backend follows a REST API pattern built with Express.js:

- **Runtime**: Node.js with TypeScript for type safety across the stack
- **Framework**: Express.js with middleware for logging, error handling, and file uploads
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **File Handling**: Multer for image upload processing with validation and storage
- **Session Management**: PostgreSQL-based session storage for authentication state
- **Development**: Mock authentication system for development with plans for production auth integration

The API structure separates concerns with dedicated modules for database operations, routing, and business logic.

## Data Storage Solutions

- **Primary Database**: PostgreSQL using Neon serverless for scalability
- **ORM**: Drizzle ORM providing type-safe database operations and migrations
- **Schema Design**: Relational model with tables for users, agencies, reports, pickup requests, campaigns, and agency members
- **File Storage**: Local file system for image uploads with configurable limits
- **Session Storage**: PostgreSQL-based session management using connect-pg-simple

The database schema supports hierarchical user roles, geolocation data, status tracking, and agency-user relationships.

## Authentication and Authorization

- **Development**: Mock authentication middleware for rapid development
- **Role-Based Access**: Three distinct user roles (citizen, agency, admin) with different permissions
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Future Integration**: Designed for easy integration with production authentication providers

The system implements role-based routing and dashboard access control based on user authentication state.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production scalability
- **Drizzle Kit**: Database migration and schema management tools

## UI and Styling Libraries
- **Radix UI**: Headless component primitives for accessibility and consistency
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Vite**: Fast build tool with development server and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for server-side code

## File Processing
- **Multer**: Multipart form data handling for image uploads
- **File System**: Local storage with plans for cloud storage integration

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation

## Geolocation Services
- **Future Integration**: Placeholder for Google Maps or OpenStreetMap integration for location-based features

The architecture prioritizes type safety, scalability, and maintainability while providing a foundation for future enhancements like real-time notifications, advanced mapping features, and third-party authentication integration.