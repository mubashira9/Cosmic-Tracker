import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import SpaceTracker from './components/SpaceTracker';

const AppContent = () => {
  const { user, loading, isNewUser, setIsNewUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;