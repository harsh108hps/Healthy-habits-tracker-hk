# MindTracker Frontend

Modern React application for wellness and habit tracking with beautiful UI built using Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   - Open http://localhost:3000 in your browser
   - The app will automatically reload when you make changes

## 📁 Project Structure

```
FrontEnd/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar.js   # Navigation bar
│   │   │   └── Sidebar.js  # Side navigation
│   │   └── ui/             # UI components
│   │       └── LoadingSpinner.js
│   ├── contexts/           # React contexts
│   │   └── AuthContext.js  # Authentication context
│   ├── pages/              # Page components
│   │   ├── Login.js        # Login page
│   │   ├── Register.js     # Registration page
│   │   ├── Dashboard.js    # Main dashboard
│   │   ├── Habits.js       # Habit tracking
│   │   ├── Moods.js        # Mood tracking
│   │   ├── Goals.js        # Goal management
│   │   ├── Social.js       # Social features
│   │   └── Profile.js      # User profile
│   ├── App.js              # Main app component
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
```css
Primary: #3B82F6 (Blue)
Secondary: #22C55E (Green)
Accent: #D946EF (Purple)
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components

#### Buttons
```jsx
// Primary button
<button className="btn btn-primary">Click me</button>

// Secondary button
<button className="btn btn-secondary">Click me</button>

// Outline button
<button className="btn btn-outline">Click me</button>
```

#### Cards
```jsx
<div className="card p-6">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

#### Inputs
```jsx
<input className="input w-full" placeholder="Enter text" />
<textarea className="input w-full h-20 resize-none" />
```

## 🧩 Component Architecture

### Authentication Context
```jsx
const { user, login, register, logout, loading } = useAuth();
```

### Protected Routes
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Page Components
Each page is a self-contained component with:
- State management
- API integration
- Form handling
- Error handling
- Loading states

## 🎭 Animations

### Framer Motion
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  Content
</motion.div>
```

### Custom Animations
```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile-First Approach
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Hot Reloading
The development server supports hot reloading:
- Component changes update instantly
- State is preserved during updates
- CSS changes apply immediately

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```jsx
// Layout
<div className="flex items-center justify-between">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// Spacing
<div className="p-6 m-4 space-y-4">

// Colors
<div className="bg-primary-500 text-white">
<div className="text-gray-600 bg-gray-100">

// Typography
<h1 className="text-2xl font-bold text-gray-900">
<p className="text-sm text-gray-500">
```

### Custom CSS Classes
```css
.gradient-bg {
  @apply bg-gradient-to-br from-primary-50 via-white to-secondary-50;
}

.glass-effect {
  @apply bg-white/80 backdrop-blur-sm border border-white/20;
}
```

## 📊 State Management

### Local State
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: ''
});
```

### Global State (Context)
```jsx
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // ...
};
```

### API Integration
```jsx
const fetchData = async () => {
  try {
    const response = await axios.get('/api/endpoint');
    setData(response.data);
  } catch (error) {
    toast.error('Failed to load data');
  }
};
```

## 🎯 Features Implementation

### Dashboard
- Welcome message with user greeting
- Statistics cards with key metrics
- Today's habits with completion status
- Today's mood summary
- Quick action buttons

### Habit Tracking
- Create/edit/delete habits
- Mark habits as complete
- Streak tracking
- Progress visualization
- Category management

### Mood Tracking
- 5-point mood scale
- Energy and stress sliders
- Optional notes
- Mood history
- Visual mood calendar

### Goal Management
- SMART goal creation
- Progress tracking
- Milestone system
- Deadline management
- Priority levels

### Social Features
- Friend search and management
- Leaderboard
- Progress sharing
- Social motivation

## 🔒 Security

### Authentication
- JWT token storage in localStorage
- Automatic token refresh
- Protected routes
- Logout functionality

### Input Validation
- Client-side validation
- Server-side validation
- Error handling
- User feedback

## 📱 PWA Features

### Manifest
```json
{
  "name": "MindTracker",
  "short_name": "MindTracker",
  "description": "Wellness and habit tracking app",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#ffffff"
}
```

### Service Worker
- Offline functionality
- Caching strategies
- Background sync
- Push notifications

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build files
- **Heroku**: Use buildpacks

### Environment Configuration
```env
# Production
REACT_APP_API_URL=https://api.mindtracker.com
REACT_APP_ENV=production

# Staging
REACT_APP_API_URL=https://staging-api.mindtracker.com
REACT_APP_ENV=staging
```

## 🧪 Testing

### Component Testing
```jsx
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders dashboard title', () => {
  render(<Dashboard />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### Integration Testing
```jsx
test('user can login', async () => {
  render(<App />);
  // Test login flow
});
```

## 📈 Performance Optimization

### Code Splitting
```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Habits = lazy(() => import('./pages/Habits'));
```

### Image Optimization
```jsx
<img 
  src={imageUrl} 
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### Bundle Analysis
```bash
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🐛 Debugging

### React Developer Tools
- Component tree inspection
- Props and state debugging
- Performance profiling

### Console Logging
```jsx
console.log('Component rendered');
console.table(data);
console.group('API Response');
```

### Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
}
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use functional components
- Implement proper error handling
- Follow naming conventions
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License.
