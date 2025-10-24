import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ChartBarIcon, 
  FireIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily',
    target: 1,
    unit: 'times',
    color: '#3B82F6',
    icon: '💪'
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/habits');
      setHabits(res.data.habits || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await axios.put(`/api/habits/${editingHabit._id}`, formData);
        toast.success('Habit updated successfully');
      } else {
        await axios.post('/api/habits', formData);
        toast.success('Habit created successfully');
      }
      
      setShowAddForm(false);
      setEditingHabit(null);
      setFormData({
        name: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        target: 1,
        unit: 'times',
        color: '#3B82F6',
        icon: '💪'
      });
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
      toast.error('Failed to save habit');
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await axios.delete(`/api/habits/${habitId}`);
        toast.success('Habit deleted successfully');
        fetchHabits();
      } catch (error) {
        console.error('Error deleting habit:', error);
        toast.error('Failed to delete habit');
      }
    }
  };

  const handleToggleHabit = async (habitId, completed) => {
    try {
      await axios.post(`/api/habits/${habitId}/entries`, {
        completed: !completed,
        value: completed ? 0 : 1
      });
      toast.success(completed ? 'Habit unchecked' : 'Habit completed!');
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const openEditForm = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency,
      target: habit.target,
      unit: habit.unit,
      color: habit.color,
      icon: habit.icon
    });
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingHabit(null);
    setFormData({
      name: '',
      description: '',
      category: 'health',
      frequency: 'daily',
      target: 1,
      unit: 'times',
      color: '#3B82F6',
      icon: '💪'
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
          <p className="text-gray-600">Track your daily habits and build consistency</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Habit
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Drink 8 glasses of water"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full h-20 resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input w-full"
                  >
                    <option value="health">Health</option>
                    <option value="fitness">Fitness</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="learning">Learning</option>
                    <option value="social">Social</option>
                    <option value="productivity">Productivity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="input w-full"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input w-full"
                    placeholder="times, glasses, minutes"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingHabit ? 'Update' : 'Create'} Habit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first habit.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add your first habit
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <motion.div
              key={habit._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{habit.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditForm(habit)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit._id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {habit.description && (
                <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FireIcon className="w-4 h-4 mr-1" />
                  <span>{habit.stats.currentStreak} day streak</span>
                </div>
                <div className="text-sm text-gray-500">
                  {habit.stats.totalCompletions} total
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => handleToggleHabit(habit._id, habit.todayEntry?.completed)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      habit.todayEntry?.completed
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {habit.todayEntry?.completed ? (
                      <CheckIcon className="w-4 h-4 mr-2" />
                    ) : (
                      <XMarkIcon className="w-4 h-4 mr-2" />
                    )}
                    {habit.todayEntry?.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {habit.target} {habit.unit}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Habits;
