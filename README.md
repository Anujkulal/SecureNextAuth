# SecureNextAuth - Monolithic Next.js Authentication System

A comprehensive authentication system built with Next.js 14, NextAuth.js v5, and Prisma, featuring secure user management, OAuth integration, and RBAC (role-based access control).

## Features

### 🔐 Authentication & Security
- **Multi-provider Authentication**: Credentials-based and OAuth (Google, GitHub)
- **Two-Factor Authentication (2FA)**: Enhanced security with TOTP (Time-based One-Time Password)
- **Email Verification**: Secure account activation
- **Password Reset**: Secure password recovery workflow
- **Role-based Access Control**: Admin and User roles with protected routes
- **JWT Strategy**: Secure session management

### 🎨 User Interface

- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Interactive Forms**: React Hook Form with Zod validation (Zod: TypeScript-first schema validation library for validating and parsing data)
- **Loading States**: Smooth UX with proper loading indicators

### User Experience

- **User Dashboard**: Personalized user information display
- **Settings Management**: Comprehensive account settings
- **Profile Management**: Update personal information
- **Session Management**: Real-time session updates
- **Admin Panel**: Administrative user management

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Backend
- **NextAuth.js v5** - Complete authentication solution
- **Prisma** - Type-safe database ORM
- **neon** - Serverless PostgreSQL database
- **Bcrypt** - Password hashing
- **Resend** - Email service integration


## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Database (PostgreSQL, MySQL, or SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Anujkulal/SecureNextAuth.git
   cd SecureNextAuth
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   
   NODE_ENV=development

    DATABASE_URL=

    AUTH_SECRET=

    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=

    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

    # Email service provider
    RESEND_API_KEY=
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
SecureNextAuth/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (protected)/        # Protected routes
│   │   ├── auth/              # Authentication pages
│   │   └── api/               # API routes
│   │   └── data/              # 
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── form/              # Form components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utility libraries
│   ├── hooks/                 # Custom React hooks
│   ├── actions/               # Server actions
│   ├── schemas/               # Zod validation schemas
│   └── auth.ts                # 
│   └── auth.config.ts         # 
│   └── middleware.ts          # 
│   └── routes.ts              # 
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── ...config files
```

## Key Features Explanation

### Authentication Flow
1. **Registration**: Email verification required
2. **Login**: Credentials or OAuth providers
3. **2FA Setup**: Optional two-factor authentication
4. **Password Reset**: Secure token-based reset
5. **Session Management**: JWT-based sessions

### Role-Based Access
- **User Role**: Basic access to dashboard and settings
- **Admin Role**: Full administrative privileges
- **Protected Routes**: Automatic redirection for unauthorized access
