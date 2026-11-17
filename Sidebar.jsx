import React from 'react';
import { Home, Search, Library, Users, ListMusic, User, Settings, LogOut, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuth();
  const { setActivePlaylistId } = useMusic();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Chocopie Search', icon: Search },
    { id: 'library', label: 'My Library', icon: Library },
    { id: 'playlists', label: 'Playlists & Co-op', icon: ListMusic },
    { id: 'friends', label: 'Friends & Requests', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id) => {
    if (id === 'playlists') {
      setActivePlaylistId(null);
    }
    setActiveTab(id);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-choco-surface border-r border-choco-hover flex-col justify-between p-4 hidden lg:flex">
        <div>
          <div className="mb-4 px-3">
            <p className="text-[10px] font-bold tracking-widest text-choco-muted uppercase">Navigation</p>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-choco-accent text-choco-bg font-bold shadow-lg shadow-choco-accent/20'
                      : 'text-choco-muted hover:text-choco-text hover:bg-choco-card'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-choco-card to-choco-hover p-4 rounded-2xl border border-choco-hover">
            <div className="flex items-center gap-2 mb-1.5">
              <Radio size={16} className="text-choco-accent animate-pulse" />
              <span className="text-xs font-bold text-choco-gold">Live Activity</span>
            </div>
            <p className="text-xs text-choco-text">Priya is streaming <span className="text-choco-accent font-semibold">Blinding Lights</span></p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            Sign Out / Switch Account
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-24 left-0 right-0 bg-choco-surface/95 backdrop-blur-md border-t border-choco-hover flex justify-around py-2 px-1 z-30">
        {menuItems.slice(0, 6).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-medium ${
                isActive ? 'text-choco-accent font-bold' : 'text-choco-muted'
              }`}
            >
              <Icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
