import React from 'react';
import { Play, Sparkles, Heart, Users } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import FriendActivity from '../components/FriendActivity';

export default function Home({ setActiveTab }) {
  const { user } = useAuth();
  const {
    trackCatalog, playTrack, likedSongs, toggleLike,
    playlists, setActivePlaylistId
  } = useMusic();

  const openPlaylist = (playlistId) => {
    setActivePlaylistId(playlistId);
    setActiveTab('playlists');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-choco-surface via-choco-card to-choco-surface border border-choco-hover rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-choco-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-choco-accent/20 text-choco-accent text-xs font-semibold mb-4 border border-choco-accent/30">
            <Sparkles size={14} /> Welcome back, {user?.name || 'Rohan'}!
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-choco-text via-choco-gold to-choco-accent bg-clip-text text-transparent">
            Your Sound, Your Social Vibe
          </h1>
          <p className="text-choco-muted text-sm md:text-base mb-6">
            Stream music, add friends, and co-edit collaborative playlists in real time.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => trackCatalog.length > 0 && playTrack(trackCatalog[0], trackCatalog)}
              className="px-6 py-3 rounded-2xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold flex items-center gap-2 shadow-lg transition"
            >
              <Play size={18} fill="currentColor" /> Play Top Mix
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className="px-6 py-3 rounded-2xl bg-choco-card hover:bg-choco-hover text-choco-text font-bold border border-choco-hover transition"
            >
              Open Chocopie Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Songs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-choco-text">Trending & Recommended</h2>
              <button onClick={() => setActiveTab('search')} className="text-xs text-choco-accent hover:underline font-semibold">Search More</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trackCatalog.slice(0, 6).map(track => {
                const isLiked = likedSongs.includes(track.id);
                return (
                  <div key={track.id} className="bg-choco-surface border border-choco-hover rounded-2xl p-4 flex items-center gap-4 hover:border-choco-accent/50 transition group">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => playTrack(track, trackCatalog)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-choco-bg bg-choco-accent/90"
                      >
                        <Play size={20} fill="currentColor" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-choco-text truncate">{track.title}</h4>
                      <p className="text-xs text-choco-muted truncate">{track.artist}</p>
                      <span className="text-[10px] text-choco-gold mt-1 block">{track.duration}</span>
                    </div>
                    <button
                      onClick={() => toggleLike(track)}
                      className={`p-2 rounded-xl transition ${isLiked ? 'text-choco-accent' : 'text-choco-muted hover:text-choco-text'}`}
                    >
                      <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collaborative Playlists Quick Open */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-choco-text">Your Collaborative Playlists</h2>
              <button onClick={() => setActiveTab('playlists')} className="text-xs text-choco-accent hover:underline font-semibold">Open All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  onClick={() => openPlaylist(playlist.id)}
                  className="bg-choco-surface border border-choco-hover rounded-2xl p-4 flex items-center gap-4 hover:border-choco-accent cursor-pointer transition group"
                >
                  <img src={playlist.coverUrl} alt={playlist.name} className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-choco-text truncate group-hover:text-choco-accent transition">{playlist.name}</h4>
                    <p className="text-xs text-choco-muted truncate">{playlist.description}</p>
                    <span className="text-[10px] text-choco-gold mt-1 flex items-center gap-1">
                      <Users size={11} /> {playlist.songs.length} songs • Click to open
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <FriendActivity />
        </div>
      </div>
    </div>
  );
}
