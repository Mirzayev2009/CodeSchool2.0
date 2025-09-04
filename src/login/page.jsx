
import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useNavigate, useLocation } from 'react-router-dom';



export default function LoginPage() {
  const { login, loading: userLoading, error: userError, user } = useUser();
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const role = urlParams.get('role') || 'student';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
      const success = await login(username, password);
    setIsLoading(false);
    if (success && user) {
      if (user.profile_type === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else if (!success && userError) {
      setError(userError);
    }
  };

  const isTeacher = role === 'teacher';
    const demoCredentials = { username: 'admin', password: 'admin' };

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
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isTeacher ? 'Teacher Login' : 'Student Login'}
            </h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {isTeacher ? 'Access your teaching dashboard' : 'Access your learning portal'}
            </p>
          </div>

          <div className={`mb-6 p-4 rounded-lg border ${isTeacher ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Demo Credentials:</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username: {demoCredentials.username}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password: {demoCredentials.password}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {(error || userError) && (
              <div className="mb-2 p-2 rounded bg-red-100 text-red-700 text-sm border border-red-300">
                {error || userError}
              </div>
            )}
            <div>
                <label htmlFor="username" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}> 
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your username"
                  required
                />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || userLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isTeacher 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading || userLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${isTeacher ? 'Teacher' : 'Student'}`
              )}
            </button>
          </form>

          <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-center">
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Looking for {isTeacher ? 'student' : 'teacher'} login?
              </p>
              <button
                onClick={() => navigate(`/login?role=${isTeacher ? 'student' : 'teacher'}`)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Switch to {isTeacher ? 'Student' : 'Teacher'} Login
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
