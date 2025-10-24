# MindTracker - Wellness & Habit Tracker

A comprehensive full-stack wellness tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Tailwind CSS. Track your habits, moods, and goals while building a healthier lifestyle.

## 🌟 Features

### Core Functionality
- **Habit Tracking**: Create, manage, and track daily habits with streak counters
- **Mood Logging**: Record your emotional well-being with energy and stress levels
- **Goal Setting**: Set and track personal and professional goals with progress monitoring
- **Dashboard**: Beautiful overview of your wellness journey with statistics
- **Calendar View**: Visual representation of your progress over time

### Social Features
- **Friend System**: Add friends and share your wellness journey
- **Leaderboard**: Compete with friends on streaks and achievements
- **Progress Sharing**: Share your achievements and motivate others

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful UI**: Modern, clean interface with smooth animations
- **Dark/Light Theme**: Customizable theme preferences
- **Real-time Updates**: Instant feedback on your progress

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindTracker
   ```

2. **Install Backend Dependencies**
   ```bash
   cd BackEnd
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../FrontEnd
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the BackEnd directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mindtracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

5. **Start the Application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd BackEnd
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd FrontEnd
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
MindTracker/
├── BackEnd/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Express server
│   └── package.json
├── FrontEnd/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library

## 📱 Features Overview

### Dashboard
- Welcome message with personalized greeting
- Quick stats overview (habits, moods, goals, streaks)
- Today's habits with completion status
- Today's mood summary
- Quick action buttons

### Habit Tracking
- Create custom habits with categories
- Set frequency (daily, weekly, custom)
- Track completion with streak counters
- Visual progress indicators
- Habit statistics and analytics

### Mood Tracking
- 5-point mood scale (terrible to excellent)
- Energy and stress level tracking
- Optional notes and tags
- Mood history and trends
- Visual mood calendar

### Goal Management
- Set SMART goals with deadlines
- Track progress with milestones
- Priority levels and categories
- Progress visualization
- Achievement system

### Social Features
- Add friends by email or name
- Share progress and achievements
- Leaderboard with streaks
- Social motivation and accountability

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/entries` - Log habit entry

### Moods
- `GET /api/moods` - Get mood entries
- `POST /api/moods` - Log mood
- `PUT /api/moods/:id` - Update mood
- `DELETE /api/moods/:id` - Delete mood

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/progress` - Add progress

### Social
- `GET /api/users/search` - Search users
- `POST /api/users/friends` - Add friend
- `DELETE /api/users/friends/:id` - Remove friend
- `GET /api/users/leaderboard` - Get leaderboard

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blues, secondary greens, accent purples
- **Typography**: Inter font family for modern readability
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable button, input, and card components

### Animations
- **Page Transitions**: Smooth fade and slide animations
- **Micro-interactions**: Hover effects and button states
- **Loading States**: Elegant loading spinners
- **Toast Notifications**: Non-intrusive feedback messages

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: Grid and flexbox for adaptive layouts
- **Touch Friendly**: Large touch targets for mobile

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production security
- **Environment Variables**: Sensitive data in environment files

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Connect to MongoDB Atlas
4. Deploy with Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app
2. Deploy to hosting platform
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
- Framer Motion for smooth animations
- MongoDB for the flexible database solution

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better wellness and habit formation**
