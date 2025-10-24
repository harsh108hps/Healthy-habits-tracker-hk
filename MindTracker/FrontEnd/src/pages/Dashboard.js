import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  HeartIcon, 
  TargetIcon, 
  FireIcon,
  TrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    habits: { total: 0, completed: 0 },
    moods: { average: 0, entries: 0 },
    goals: { total: 0, completed: 0 },
    streak: 0
  });
  const [recentHabits, setRecentHabits] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch habits
      const habitsRes = await axios.get('/api/habits');
      const habits = habitsRes.data.habits || [];
      
      // Fetch mood stats
      const moodRes = await axios.get('/api/moods/stats?period=week');
      const moodStats = moodRes.data.stats || {};
      
      // Fetch goal stats
      const goalsRes = await axios.get('/api/goals/stats');
      const goalStats = goalsRes.data.stats || {};
      
      // Fetch today's mood
      const todayMoodRes = await axios.get('/api/moods/today');
      const todayMoodData = todayMoodRes.data.mood;

      setStats({
        habits: {
          total: habits.length,
          completed: habits.filter(h => h.todayEntry?.completed).length
        },
        moods: {
          average: moodStats.averageEnergy || 0,
          entries: moodStats.totalEntries || 0
        },
        goals: {
          total: goalStats.total || 0,
          completed: goalStats.completed || 0
        },
        streak: 0 // This would come from user data
      });

      setRecentHabits(habits.slice(0, 5));
      setTodayMood(todayMoodData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      excellent: '😄',
      good: '😊',
      okay: '😐',
      poor: '😔',
      terrible: '😢'
    };
    return moodEmojis[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      okay: 'text-yellow-600 bg-yellow-100',
      poor: 'text-orange-600 bg-orange-100',
      terrible: 'text-red-600 bg-red-100'
    };
    return moodColors[mood] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100">
          Ready to continue your wellness journey? Let's check in on your progress today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Habits Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.habits.completed}/{stats.habits.total}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HeartIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Mood Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.moods.average}/10
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TargetIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Goals</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.goals.completed}/{stats.goals.total}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.streak} days
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Habits</h3>
            <Link
              to="/habits"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>
          
          {recentHabits.length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No habits yet</p>
              <Link
                to="/habits"
                className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
              >
                Create your first habit
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentHabits.map((habit) => (
                <div key={habit._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{habit.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{habit.name}</p>
                      <p className="text-sm text-gray-500">{habit.category}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    habit.todayEntry?.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {habit.todayEntry?.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Today's Mood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Mood</h3>
            <Link
              to="/moods"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Log mood
            </Link>
          </div>
          
          {todayMood ? (
            <div className="text-center py-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getMoodColor(todayMood.mood)}`}>
                <span className="mr-2">{getMoodEmoji(todayMood.mood)}</span>
                {todayMood.mood.charAt(0).toUpperCase() + todayMood.mood.slice(1)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Energy Level</p>
                  <p className="font-semibold">{todayMood.energy || 'N/A'}/10</p>
                </div>
                <div>
                  <p className="text-gray-500">Stress Level</p>
                  <p className="font-semibold">{todayMood.stress || 'N/A'}/10</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No mood logged today</p>
              <Link
                to="/moods"
                className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
              >
                Log your mood
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/habits"
            className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <ChartBarIcon className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-primary-700">Add Habit</span>
          </Link>
          
          <Link
            to="/moods"
            className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <HeartIcon className="h-8 w-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-red-700">Log Mood</span>
          </Link>
          
          <Link
            to="/goals"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <TargetIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Set Goal</span>
          </Link>
          
          <Link
            to="/social"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <TrendingUpIcon className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Share Progress</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
