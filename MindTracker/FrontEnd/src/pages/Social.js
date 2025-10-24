import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  TrophyIcon,
  FireIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Social = () => {
  const [friends, setFriends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchLeaderboard();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users/friends');
      setFriends(res.data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('/api/users/leaderboard');
      setLeaderboard(res.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const addFriend = async (userId) => {
    try {
      await axios.post('/api/users/friends', { userId });
      toast.success('Friend request sent');
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error('Failed to add friend');
    }
  };

  const removeFriend = async (userId) => {
    try {
      await axios.delete(`/api/users/friends/${userId}`);
      toast.success('Friend removed');
      fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  const shareProgress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wellness Progress',
        text: 'Check out my wellness journey on MindTracker!',
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copied to clipboard');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Social</h1>
          <p className="text-gray-600">Connect with friends and share your wellness journey</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSearch(true)}
            className="btn btn-outline flex items-center"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Find Friends
          </button>
          <button
            onClick={shareProgress}
            className="btn btn-primary flex items-center"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Share Progress
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-semibold mb-4">Find Friends</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="input w-full"
                  placeholder="Search by name or email"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-primary-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addFriend(user._id)}
                        className="btn btn-primary btn-sm"
                      >
                        <UserPlusIcon className="w-4 h-4 mr-1" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friends List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Friends</h3>
          
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No friends yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start by finding and adding friends.</p>
              <button
                onClick={() => setShowSearch(true)}
                className="mt-4 btn btn-primary"
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-primary-600">
                        {friend.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{friend.name}</p>
                      <p className="text-sm text-gray-500">
                        {friend.streak?.current || 0} day streak
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(friend._id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
          
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No leaderboard data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full mr-3">
                      {index === 0 ? (
                        <TrophyIcon className="w-5 h-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <TrophyIcon className="w-5 h-5 text-gray-400" />
                      ) : index === 2 ? (
                        <TrophyIcon className="w-5 h-5 text-orange-500" />
                      ) : (
                        <span className="text-sm font-bold text-primary-600">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{entry.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {entry.streak} day streak • {entry.achievements} achievements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FireIcon className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{entry.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Share Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Progress</h3>
        <p className="text-gray-600 mb-4">
          Share your wellness journey with friends and family to stay motivated and accountable.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={shareProgress}
            className="btn btn-primary flex items-center"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Share Progress
          </button>
          <button
            onClick={() => setShowSearch(true)}
            className="btn btn-outline flex items-center"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Invite Friends
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Social;
