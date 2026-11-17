import React, { useState } from 'react';
import { Bell, Disc3, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const { notifications, setNotifications } = useMusic();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 bg-choco-surface/90 backdrop-blur-md border-b border-choco-hover px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-choco-accent to-choco-gold flex items-center justify-center text-choco-bg shadow-md">
          <Disc3 size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <span className="font-black text-xl md:text-2xl tracking-wider bg-gradient-to-r from-choco-text via-choco-gold to-choco-accent bg-clip-text text-transparent">
          CHOCOPIE
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4 relative">
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative p-2.5 rounded-xl bg-choco-card hover:bg-choco-hover text-choco-muted hover:text-choco-text transition border border-choco-hover"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-choco-accent text-choco-bg text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 top-14 w-80 bg-choco-surface border border-choco-hover rounded-2xl shadow-2xl p-4 z-50">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-choco-hover">
              <h4 className="text-sm font-bold text-choco-text">Notifications</h4>
              <button onClick={markAllRead} className="text-[11px] text-choco-accent hover:underline flex items-center gap-1">
                <CheckCheck size={14} /> Mark all read
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`p-2.5 rounded-xl text-xs ${n.read ? 'bg-choco-card/50 text-choco-muted' : 'bg-choco-card text-choco-text border border-choco-accent/30'}`}>
                  <p>{n.text}</p>
                  <span className="text-[10px] text-choco-gold mt-1 block">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 bg-choco-card hover:bg-choco-hover px-3 py-1.5 rounded-2xl border border-choco-hover cursor-pointer transition"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-choco-accent"
          />
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-choco-text">{user?.name}</h4>
            <p className="text-[10px] text-choco-muted">@{user?.username}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
