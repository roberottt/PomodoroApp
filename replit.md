# StudyBuddy - Pomodoro Study Application

## Overview

StudyBuddy is a full-stack web application designed to help users study more effectively using the Pomodoro Technique. The app combines time management, task organization, mood tracking, and ambient sounds to create a comprehensive study environment. It features a cute, user-friendly interface with modern web technologies and real-time data synchronization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui component system
- **Styling**: Tailwind CSS with custom color palette (coral, pink, sage, mint, peach)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth with Google OAuth exclusively
- **Real-time Updates**: Firebase SDK for real-time data synchronization
- **API Design**: RESTful principles with Firebase SDK handling most operations client-side

### Database Schema
The application uses Firestore collections with the following main entities:
- **Users**: Profile information synced with Google accounts
- **Tasks**: Study tasks with priority levels and time estimates
- **StudySessions**: Pomodoro timer sessions with completion tracking
- **Moods**: Daily mood entries for wellbeing tracking
- **Settings**: User preferences for timer durations and notifications
- **CalendarEvents**: Study deadlines and important dates

## Key Components

### Authentication System
- **Google OAuth Integration**: Single sign-on through Firebase Auth
- **Session Management**: Automatic token refresh and user state persistence
- **User Profile**: Display name, email, and profile picture from Google account

### Pomodoro Timer
- **Customizable Durations**: Adjustable work sessions (default 25 min), short breaks (5 min), and long breaks (15 min)
- **Session Tracking**: Automatic logging of completed sessions to Firestore
- **Visual Feedback**: Clean, minimalist timer interface with progress indication

### Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Priority System**: Low, medium, and high priority levels with color coding
- **Time Estimation**: Optional time estimates for better planning
- **Completion Tracking**: Mark tasks as complete with timestamp logging

### Mood Tracking
- **Daily Entries**: Simple mood selection (happy, good, neutral, tired, stressed)
- **Trend Analysis**: Visual representation of mood patterns over time
- **Wellbeing Insights**: Integration with study session data for holistic view

### Ambient Sounds
- **Sound Library**: Ocean waves, rain, birds, library ambience, and white noise
- **Volume Control**: Adjustable volume slider for each sound
- **Looping Audio**: Continuous playback during study sessions

### Analytics Dashboard
- **Study Statistics**: Total study hours, completed sessions, and task completion rates
- **Visual Charts**: Bar charts and line graphs using Recharts library
- **Progress Tracking**: Daily and weekly study goal monitoring

## Data Flow

### Authentication Flow
1. User clicks "Sign in with Google"
2. Firebase Auth redirects to Google OAuth
3. User grants permissions and returns to app
4. Firebase Auth creates/updates user session
5. User data synced to Firestore users collection

### Study Session Flow
1. User starts Pomodoro timer
2. Timer creates new study session document in Firestore
3. Real-time updates track session progress
4. On completion, session marked as complete with end timestamp
5. Analytics automatically update with new session data

### Task Management Flow
1. User creates task through TaskModal component
2. Task data validated with Zod schemas
3. Document created in Firestore tasks collection
4. Real-time updates reflect changes across all user devices
5. Task completion updates both task status and analytics

## External Dependencies

### Firebase Services
- **Firebase Auth**: User authentication and session management
- **Firestore**: NoSQL database for all application data
- **Firebase SDK**: Client-side integration for real-time data sync

### UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety and better developer experience
- **ESLint/Prettier**: Code formatting and linting

### Audio Processing
- **Web Audio API**: For ambient sound playback and volume control
- **HTML5 Audio**: Fallback for basic audio functionality

## Deployment Strategy

### Environment Configuration
- **Firebase Configuration**: Environment variables for Firebase project credentials
- **Build Process**: Vite production build with code splitting and optimization
- **Static Asset Optimization**: Automatic image optimization and caching

### Production Deployment
- **Vercel Deployment**: Optimized for React applications with automatic deployments
- **Firebase Hosting**: Alternative deployment option with built-in Firebase integration
- **Environment Variables**: Secure handling of API keys and configuration

### Performance Optimizations
- **Code Splitting**: Lazy loading of non-critical components
- **Query Optimization**: Efficient Firestore queries with proper indexing
- **Caching Strategy**: TanStack Query caching for improved user experience
- **Bundle Optimization**: Tree shaking and minification through Vite

### Security Considerations
- **Firebase Security Rules**: Proper data access controls in Firestore
- **Authentication Validation**: Server-side validation of user permissions
- **Input Sanitization**: Zod schema validation for all user inputs
- **HTTPS Enforcement**: All communications over secure connections

The application is designed to be scalable, maintainable, and provide a smooth user experience across different devices while maintaining data consistency through Firebase's real-time synchronization capabilities.