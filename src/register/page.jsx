import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const darkTheme = savedTheme === 'true';
      setIsDarkMode(darkTheme);
      if (darkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    const formData = {
      email,
      password,
      password_confirm: confirmPassword,
      user_type: role,
      // Add other required fields here (username, first_name, last_name, phone_number, etc.)
    };
    const success = await register(formData);
    setIsLoading(false);
    if (success) {
      navigate(`/login?role=${role}`);
    } else {
      setError('Registration failed.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-md w-full">
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-colors cursor-pointer ${isDarkMode ? 'text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50'} shadow-lg`}
            title="Toggle theme"
          >
            <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} w-5 h-5 flex items-center justify-center`}></i>
          </button>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl p-8 border`}>
          <div className="text-center mb-8">
            <button 
              onClick={() => navigate('/')}
              className="inline-block mb-6 cursor-pointer"
            >
              <span className="text-3xl font-bold text-blue-600 font-pacifico">CodeSchool</span>
            </button>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Register</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Create your account to get started</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="mb-2 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-300">{error}</div>
            )}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Role</label>
              <div className="flex space-x-4">
                <button type="button" onClick={() => setRole('student')} className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${role === 'student' ? 'bg-blue-600 text-white border-blue-600' : isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>Student</button>
                <button type="button" onClick={() => setRole('teacher')} className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${role === 'teacher' ? 'bg-green-600 text-white border-green-600' : isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>Teacher</button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${role === 'teacher' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registering...
                </div>
              ) : (
                `Register as ${role === 'teacher' ? 'Teacher' : 'Student'}`
              )}
            </button>
          </form>
          <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-center">
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Already have an account?</p>
              <button
                onClick={() => navigate(`/login?role=${role}`)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Go to Login
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
