import React, { useState } from 'react';
import { Rocket, Globe, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedBackground } from './ui/ThemedBackground';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();
  const { currentTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created successfully! You can now sign in.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedBackground className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className={`w-10 h-10 text-${currentTheme.colors.primary} animate-spin`} style={{animationDuration: '10s'}} />
            <h1 className={`text-3xl font-bold text-${currentTheme.colors.text} drop-shadow-lg`}>
              <span className={`text-${currentTheme.colors.primary}`}>Cosmic</span>{' '}
              <span className={`text-${currentTheme.colors.secondary}`}>Tracker</span>
            </h1>
          </div>
          <p className={`text-${currentTheme.colors.textSecondary}`}>
            {isLogin ? 'Welcome back, Space Explorer!' : 'Join the Cosmic Expedition!'}
          </p>
        </div>

        <div className={`${currentTheme.gradients.card} rounded-2xl p-8 border border-${currentTheme.colors.border}`}>
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  isLogin
                    ? `${currentTheme.gradients.button} text-white`
                    : `text-${currentTheme.colors.textSecondary} hover:text-${currentTheme.colors.text}`
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setSuccess('');
                }}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  !isLogin
                    ? `${currentTheme.gradients.button} text-white`
                    : `text-${currentTheme.colors.textSecondary} hover:text-${currentTheme.colors.text}`
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 text-green-200">
              <Rocket className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium text-${currentTheme.colors.primary} mb-2`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${currentTheme.colors.textSecondary}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commander@space.galaxy"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-${currentTheme.colors.border} rounded-lg text-${currentTheme.colors.text} placeholder-${currentTheme.colors.textSecondary} focus:border-${currentTheme.colors.primary} focus:outline-none transition-colors`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium text-${currentTheme.colors.primary} mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${currentTheme.colors.textSecondary}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-${currentTheme.colors.border} rounded-lg text-${currentTheme.colors.text} placeholder-${currentTheme.colors.textSecondary} focus:border-${currentTheme.colors.primary} focus:outline-none transition-colors`}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium text-${currentTheme.colors.primary} mb-2`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${currentTheme.colors.textSecondary}`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-${currentTheme.colors.border} rounded-lg text-${currentTheme.colors.text} placeholder-${currentTheme.colors.textSecondary} focus:border-${currentTheme.colors.primary} focus:outline-none transition-colors`}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 ${currentTheme.gradients.button} rounded-lg font-medium text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <Rocket className="w-5 h-5" />
                  Launch Mission
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Join the Fleet
                </>
              )}
            </button>
          </form>

          <div className={`mt-6 text-center text-sm text-${currentTheme.colors.textSecondary}`}>
            {isLogin ? (
              <p>
                New to the galaxy?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                  className={`text-${currentTheme.colors.primary} hover:text-${currentTheme.colors.secondary} transition-colors`}
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already exploring space?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                  className={`text-${currentTheme.colors.primary} hover:text-${currentTheme.colors.secondary} transition-colors`}
                >
                  Sign in to your mission
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
};