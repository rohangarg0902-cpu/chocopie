import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlists from './pages/Playlists';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [authView, setAuthView] = useState('login');

  if (!isAuthenticated) {
    if (authView === 'login') {
      return <Register switchToLogin={() => setAuthView('login')} />;
    }
    return <Register switchToLogin={() => set`View`('login')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home setActiveTab={setActiveTab} />;
      case 'search': return <Search />;
      case 'library': return <Library />;
      case 'playlists': return <Playlists />;
      case 'friends': return <Friends />;
      case 'profile': return <Profile />;
      case 'settings': return <Settings />;
      default: return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-choco-bg text-choco-text flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <MainApp />
      </MusicProvider>
    </AuthProvider>
  );
}
