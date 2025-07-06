import React, { useState } from 'react';
import { Rocket, Globe, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SpaceBackground } from './ui/SpaceBackground';
import { SpaceButton } from './ui/SpaceButton';
import { SpacePanel } from './ui/SpacePanel';
import { CrewmateIcon, FloatingCrewmate } from './ui/CrewmateIcon';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

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
    <SpaceBackground variant="spaceship">
      {/* Floating crewmates */}
      <FloatingCrewmate color="red" className="top-20 left-10" />
      <FloatingCrewmate color="blue" className="top-32 right-16" />
      <FloatingCrewmate color="green" className="bottom-40 left-20" />
      <FloatingCrewmate color="yellow" className="bottom-20 right-12" />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-10 h-10 text-cyan-400 animate-spin" style={{animationDuration: '10s'}} />
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                <span className="text-cyan-400">Cosmic</span>{' '}
                <span className="text-gray-300">Tracker</span>
              </h1>
              <CrewmateIcon color="cyan" size="md" />
            </div>
            <p className="text-gray-300 mb-2">
              {isLogin ? 'Welcome back, Crewmate!' : 'Join the Cosmic Expedition!'}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-cyan-300">
              <CrewmateIcon color="blue" size="sm" />
              <span>Secure Spaceship Access Terminal</span>
              <CrewmateIcon color="green" size="sm" />
            </div>
          </div>

          <SpacePanel variant="control" className="p-8">
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-800/50 rounded-lg p-1 border border-cyan-400/30">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                    isLogin
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CrewmateIcon color="blue" size="sm" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                    !isLogin
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CrewmateIcon color="green" size="sm" />
                  Sign Up
                </button>
              </div>
            </div>

            {error && (
              <SpacePanel variant="warning" className="mb-4 p-3">
                <div className="flex items-center gap-2 text-orange-200">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </SpacePanel>
            )}

            {success && (
              <SpacePanel variant="success" className="mb-4 p-3">
                <div className="flex items-center gap-2 text-green-200">
                  <Rocket className="w-4 h-4" />
                  <span className="text-sm">{success}</span>
                </div>
              </SpacePanel>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@spaceship.galaxy"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <SpaceButton
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isLogin ? (
                  <>
                    <Rocket className="w-5 h-5" />
                    Launch Mission
                    <CrewmateIcon color="cyan" size="sm" />
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Join the Fleet
                    <CrewmateIcon color="green" size="sm" />
                  </>
                )}
              </SpaceButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              {isLogin ? (
                <p className="flex items-center justify-center gap-2">
                  <CrewmateIcon color="yellow" size="sm" />
                  New to the galaxy?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="flex items-center justify-center gap-2">
                  <CrewmateIcon color="purple" size="sm" />
                  Already exploring space?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Sign in to your mission
                  </button>
                </p>
              )}
            </div>
          </SpacePanel>
        </div>
      </div>
    </SpaceBackground>
  );
};