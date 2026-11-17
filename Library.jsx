import React from 'react';
import { Heart, Play, Trash2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Library() {
  const { likedSongs, toggleLike, playTrack, trackCatalog } = useMusic();
  const likedTrackObjects = trackCatalog.filter(t => likedSongs.includes(t.id));

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36">
      <div>
        <h1 className="text-3xl font-extrabold text-choco-text mb-2">My Library</h1>
        <p className="text-choco-muted text-sm">All your liked songs and saved tracks synced to your account.</p>
      </div>

      {/* Liked Songs Banner */}
      <div className="bg-gradient-to-r from-choco-surface via-choco-card to-choco-surface border border-choco-hover rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-choco-accent to-choco-gold flex items-center justify-center text-choco-bg shadow-xl">
            <Heart size={36} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-choco-text">Liked Songs</h3>
            <p className="text-xs text-choco-muted mt-1">{likedTrackObjects.length} saved tracks</p>
          </div>
        </div>
        <button
          onClick={() => likedTrackObjects.length > 0 && playTrack(likedTrackObjects[0], likedTrackObjects)}
          className="px-6 py-3 rounded-2xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold flex items-center gap-2 shadow-lg transition"
        >
          <Play size={18} fill="currentColor" /> Play All
        </button>
      </div>

      {/* Liked Songs List */}
      <div className="space-y-3">
        {likedTrackObjects.length === 0 ? (
          <div className="bg-choco-surface border border-choco-hover rounded-3xl p-8 text-center text-choco-muted text-sm">
            No liked songs yet. Click the heart icon on any song to save it here!
          </div>
        ) : (
          likedTrackObjects.map(track => (
            <div key={track.id} className="bg-choco-surface border border-choco-hover rounded-2xl p-4 flex items-center justify-between hover:border-choco-accent/50 transition">
              <div className="flex items-center gap-4 min-w-0">
                <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="truncate">
                  <h4 className="text-sm font-bold text-choco-text truncate">{track.title}</h4>
                  <p className="text-xs text-choco-muted truncate">{track.artist} • {track.album}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-choco-gold hidden sm:block">{track.duration}</span>
                <button
                  onClick={() => playTrack(track, likedTrackObjects)}
                  className="p-2.5 rounded-xl bg-choco-accent text-choco-bg hover:scale-105 transition shadow-md"
                >
                  <Play size={16} fill="currentColor" />
                </button>
                <button
                  onClick={() => toggleLike(track)}
                  className="p-2.5 rounded-xl bg-choco-card text-choco-muted hover:text-red-400 transition"
                  title="Remove from Liked"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
