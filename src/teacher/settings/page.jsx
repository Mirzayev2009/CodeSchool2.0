

import { useState, useEffect } from 'react';
import TeacherSidebar from '../../../components/TeacherSidebar';

export default function TeacherSettings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@codeschool.com',
    department: 'Computer Science',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleProfileUpdate = () => {
    // Handle profile update logic
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (profileData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Handle password change logic
    alert('Password changed successfully!');
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <TeacherSidebar />
        
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Settings</h1>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
              {/* Theme Settings */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Appearance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Toggle between light and dark themes
                        </p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                          isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isDarkMode ? 'translate-x-6' : 'translate-x-1'
                          } mt-1`}
                        />
                      </button>
                    </div>

                    {/* Theme Preview */}
                    <div className="mt-6">
                      <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Preview
                      </h4>
                      <div className={`p-4 rounded-lg border transition-all ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Sample Dashboard Card
                          </h5>
                          <div className="w-6 h-6 rounded bg-blue-600"></div>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          This is how your interface looks with the current theme.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Settings */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Profile Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Department
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <button 
                      onClick={handleProfileUpdate}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border`}>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Change Password
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handlePasswordChange}
                    className="mt-4 py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
