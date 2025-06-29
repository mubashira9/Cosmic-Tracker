import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Auth } from './components/Auth';
import SpaceTracker from './components/SpaceTracker';

const AppContent = () => {
  const { user, loading, isNewUser, setIsNewUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Initializing cosmic systems...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <SpaceTracker showAboutFirst={isNewUser} onAboutClose={() => setIsNewUser(false)} />;
  }

  return <Auth />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;