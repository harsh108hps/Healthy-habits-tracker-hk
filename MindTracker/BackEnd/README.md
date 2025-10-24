# MindTracker Backend API

RESTful API for the MindTracker wellness application built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Create a `config.env` file in the BackEnd directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mindtracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Start the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
BackEnd/
├── models/              # MongoDB models
│   ├── User.js          # User model with authentication
│   ├── Habit.js         # Habit model with tracking
│   ├── HabitEntry.js    # Daily habit entries
│   ├── Mood.js          # Mood tracking model
│   └── Goal.js          # Goal management model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── habits.js        # Habit management routes
│   ├── moods.js         # Mood tracking routes
│   ├── goals.js         # Goal management routes
│   └── users.js         # User and social features
├── middleware/          # Custom middleware
│   └── auth.js          # JWT authentication middleware
├── server.js            # Express server setup
├── package.json         # Dependencies and scripts
└── config.env           # Environment variables
```

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Habit Endpoints

#### Get All Habits
```http
GET /api/habits
Authorization: Bearer <token>
```

#### Create Habit
```http
POST /api/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Drink Water",
  "description": "Drink 8 glasses of water daily",
  "category": "health",
  "frequency": "daily",
  "target": 8,
  "unit": "glasses"
}
```

#### Log Habit Entry
```http
POST /api/habits/:id/entries
Authorization: Bearer <token>
Content-Type: application/json

{
  "completed": true,
  "value": 8,
  "notes": "Completed successfully"
}
```

### Mood Endpoints

#### Log Mood
```http
POST /api/moods
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": "good",
  "energy": 7,
  "stress": 3,
  "notes": "Feeling great today!"
}
```

#### Get Mood History
```http
GET /api/moods?startDate=2023-01-01&endDate=2023-12-31
Authorization: Bearer <token>
```

### Goal Endpoints

#### Create Goal
```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Read 12 Books",
  "description": "Read one book per month",
  "category": "learning",
  "targetValue": 12,
  "deadline": "2023-12-31",
  "priority": "high"
}
```

#### Add Goal Progress
```http
POST /api/goals/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 1,
  "notes": "Finished 'Atomic Habits'"
}
```

### Social Endpoints

#### Search Users
```http
GET /api/users/search?q=john
Authorization: Bearer <token>
```

#### Add Friend
```http
POST /api/users/friends
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "64a1b2c3d4e5f6789abcdef0"
}
```

#### Get Leaderboard
```http
GET /api/users/leaderboard
Authorization: Bearer <token>
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  friends: [ObjectId],
  preferences: {
    theme: String,
    notifications: {
      email: Boolean,
      push: Boolean
    }
  },
  streak: {
    current: Number,
    longest: Number,
    lastActivity: Date
  },
  achievements: [{
    type: String,
    title: String,
    description: String,
    earnedAt: Date
  }]
}
```

### Habit Model
```javascript
{
  user: ObjectId,
  name: String,
  description: String,
  category: String,
  frequency: String,
  target: Number,
  unit: String,
  color: String,
  icon: String,
  isActive: Boolean,
  stats: {
    totalCompletions: Number,
    currentStreak: Number,
    longestStreak: Number,
    completionRate: Number
  }
}
```

### Mood Model
```javascript
{
  user: ObjectId,
  date: Date,
  mood: String,
  energy: Number (1-10),
  stress: Number (1-10),
  sleep: {
    hours: Number,
    quality: String
  },
  activities: [String],
  notes: String,
  tags: [String]
}
```

### Goal Model
```javascript
{
  user: ObjectId,
  title: String,
  description: String,
  category: String,
  type: String,
  targetValue: Number,
  currentValue: Number,
  deadline: Date,
  priority: String,
  status: String,
  progress: [{
    date: Date,
    value: Number,
    notes: String
  }]
}
```

## 🔒 Security Features

### Authentication
- JWT tokens for stateless authentication
- Password hashing with bcryptjs
- Token expiration handling
- Protected routes with middleware

### Validation
- Input validation with express-validator
- Sanitization of user inputs
- Type checking for all endpoints
- Rate limiting (can be added)

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindtracker
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
```

### Production Checklist
- [ ] Set secure JWT secret
- [ ] Configure MongoDB Atlas
- [ ] Set up CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy

## 🧪 Testing

### Manual Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test habit creation
curl -X POST http://localhost:5000/api/habits \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Exercise","category":"fitness","frequency":"daily","target":1}'
```

### Automated Testing
```bash
# Run tests (when implemented)
npm test
```

## 📊 Performance Optimization

### Database Indexing
```javascript
// User model indexes
userSchema.index({ email: 1 });
userSchema.index({ 'streak.current': -1 });

// Habit model indexes
habitSchema.index({ user: 1, isActive: 1 });
habitSchema.index({ user: 1, createdAt: -1 });

// HabitEntry model indexes
habitEntrySchema.index({ user: 1, date: -1 });
habitEntrySchema.index({ habit: 1, date: -1 });
```

### Caching Strategy
- Redis for session storage (optional)
- MongoDB query optimization
- Response compression
- Static file serving

## 🔧 Development Tools

### Scripts
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

### Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **express-validator**: Input validation
- **moment**: Date manipulation
- **nodemailer**: Email functionality

## 📈 Monitoring & Logging

### Error Handling
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```

### Logging Strategy
- Console logging for development
- File logging for production
- Error tracking with services like Sentry
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
