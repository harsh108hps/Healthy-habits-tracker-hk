import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Moods = () => {
  const [moods, setMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [formData, setFormData] = useState({
    mood: 'good',
    energy: 5,
    stress: 5,
    notes: ''
  });

  useEffect(() => {
    fetchMoods();
    fetchTodayMood();
  }, []);

  const fetchMoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/moods?limit=30');
      setMoods(res.data.moods || []);
    } catch (error) {
      console.error('Error fetching moods:', error);
      toast.error('Failed to load moods');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayMood = async () => {
    try {
      const res = await axios.get('/api/moods/today');
      setTodayMood(res.data.mood);
    } catch (error) {
      console.error('Error fetching today mood:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/moods', formData);
      toast.success('Mood logged successfully');
      setShowLogForm(false);
      setFormData({
        mood: 'good',
        energy: 5,
        stress: 5,
        notes: ''
      });
      fetchMoods();
      fetchTodayMood();
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mood Tracking</h1>
          <p className="text-gray-600">Track your emotional well-being and mental health</p>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="btn btn-primary flex items-center"
        >
          <HeartIcon className="w-5 h-5 mr-2" />
          Log Mood
        </button>
      </div>

      {/* Today's Mood */}
      {todayMood ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Mood</h3>
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getMoodColor(todayMood.mood)}`}>
              <span className="mr-2">{getMoodEmoji(todayMood.mood)}</span>
              {todayMood.mood.charAt(0).toUpperCase() + todayMood.mood.slice(1)}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Energy: {todayMood.energy}/10</p>
              <p className="text-sm text-gray-500">Stress: {todayMood.stress}/10</p>
            </div>
          </div>
          {todayMood.notes && (
            <p className="mt-4 text-sm text-gray-600">{todayMood.notes}</p>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center"
        >
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No mood logged today</h3>
          <p className="mt-1 text-sm text-gray-500">Start tracking your emotional well-being.</p>
          <button
            onClick={() => setShowLogForm(true)}
            className="mt-4 btn btn-primary"
          >
            Log your mood
          </button>
        </motion.div>
      )}

      {/* Log Mood Form Modal */}
      {showLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold mb-4">Log Your Mood</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['terrible', 'poor', 'okay', 'good', 'excellent'].map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood })}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        formData.mood === mood
                          ? getMoodColor(mood)
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
                      <div className="text-xs capitalize">{mood}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energy}
                    onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-500">{formData.energy}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stress Level (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stress}
                    onChange={(e) => setFormData({ ...formData, stress: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-500">{formData.stress}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input w-full h-20 resize-none"
                  placeholder="How was your day? What's on your mind?"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Log Mood
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Mood History */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Moods</h3>
        {moods.length === 0 ? (
          <div className="text-center py-8">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No mood entries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moods.slice(0, 10).map((mood) => (
              <motion.div
                key={mood._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getMoodEmoji(mood.mood)}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(mood.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{mood.mood}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div>Energy: {mood.energy}/10</div>
                  <div>Stress: {mood.stress}/10</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Moods;
