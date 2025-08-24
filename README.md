# Clean Ghana App 🇬🇭

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A comprehensive waste management platform that connects citizens, cleaning agencies, and government authorities to improve sanitation across Ghana.

## 📖 Overview

Clean Ghana is a role-based application that enables citizens to report waste issues, agencies to manage cleanup requests, and administrators to oversee city-wide operations through intuitive dashboards. The platform promotes community engagement in maintaining clean, healthy environments across Ghana.

## 🎥 Demo

The application provides three distinct user experiences:

- **Citizen Dashboard**: Report waste, request pickups, track submissions
- **Agency Dashboard**: Manage assignments, update statuses, view metrics  
- **Admin Dashboard**: Oversee operations, analytics, manage agencies

> **Development Note**: The app currently uses mock authentication for development purposes, making it easy to test different user roles.

## ✨ Features

### For Citizens
- 🗺️ Report waste issues with location and photos
- 📱 Request pickup services for bulk waste
- 📊 Track status of submitted reports
- 🏆 Participate in community cleanup campaigns

### For Cleaning Agencies
- 📋 Manage assigned waste reports and pickup requests
- 👥 Coordinate team members and assignments
- 📈 Track performance metrics and completion rates
- 🎯 Update job statuses in real-time

### For Administrators
- 🏛️ Oversee city-wide waste management operations
- 📊 View comprehensive analytics and reports
- 🏢 Manage agency registrations and assignments
- 🚀 Launch and monitor cleanup campaigns

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript for type-safe component development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom Ghana-themed styling
- **Radix UI** for accessible, headless components
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight routing

### Backend
- **Node.js** with TypeScript
- **Express.js** with comprehensive middleware
- **PostgreSQL** with Neon serverless hosting
- **Drizzle ORM** for type-safe database operations
- **Multer** for file upload handling
- **Express Session** for authentication management

### Development Tools
- **TypeScript** for full-stack type safety
- **ESBuild** for server-side bundling
- **Drizzle Kit** for database migrations
- **PostgreSQL** session storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/McAnnison/clean-ghana-app.git
   cd clean-ghana-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/clean_ghana
   SESSION_SECRET=your_secure_session_secret_here
   NODE_ENV=development
   PORT=5000
   ```
   
   > **Note**: For production, use a secure PostgreSQL database like [Neon](https://neon.tech/) and generate a strong session secret.

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000` (or the port specified in your environment).

## 📁 Project Structure

```
clean-ghana-app/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configs
│   │   └── pages/          # Page components
│   ├── index.html
│   └── index.css
├── server/                 # Express.js backend
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and validation
├── drizzle.config.ts      # Database configuration
├── vite.config.ts         # Frontend build configuration
└── package.json
```

## 🗄️ Database Schema

The application uses a relational database with the following main entities:

- **Users**: Citizens, agency members, and administrators
- **Agencies**: Cleaning service providers
- **Reports**: Waste issue reports submitted by citizens
- **Pickup Requests**: Bulk waste pickup requests
- **Campaigns**: Community cleanup initiatives
- **Agency Members**: Relationship between users and agencies

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type-check TypeScript code
- `npm run db:push` - Push database schema changes

## 🏗️ Development

### Role-Based Access

The application implements three distinct user roles:

1. **Citizen**: Can report issues and request pickups
2. **Agency**: Can manage assignments and update job statuses  
3. **Admin**: Can oversee operations and manage agencies

### Authentication

Currently uses a mock authentication system for development. The architecture is designed for easy integration with production authentication providers.

### File Uploads

Images are handled through Multer with local storage. The system supports:
- Image validation and size limits
- Secure file storage
- CORS-enabled file serving

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Write TypeScript for all new code
- Follow existing component patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Add appropriate validation schemas

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure your `DATABASE_URL` is correctly formatted
- Check that your PostgreSQL server is running
- Verify database credentials and network connectivity

**Port Already in Use**
- The app defaults to port 5000. Set `PORT` environment variable to use a different port
- Kill any existing processes using the port: `lsof -ti:5000 | xargs kill`

**TypeScript Compilation Errors**
- Run `npm run check` to see specific TypeScript errors
- Ensure all dependencies are installed: `npm install`

**File Upload Issues**
- Check that the uploads directory has proper permissions
- Verify file size limits in Multer configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Contributing to Ghana's Cleanliness

Clean Ghana App is more than just a platform—it's a movement toward a cleaner, healthier Ghana. By connecting communities with cleaning services and government oversight, we're building a sustainable solution for waste management across the country.

Join us in making Ghana cleaner, one report at a time! 🌱

---

Built with ❤️ for Ghana