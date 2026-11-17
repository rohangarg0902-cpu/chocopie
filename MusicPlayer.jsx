import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function MusicPlayer() {
  const {
    currentTrack, isPlaying, togglePlay, playNext, playPrevious,
    progress, duration, seekAudio, volume, changeVolume,
    likedSongs, toggleLike, isShuffle, setIsShuffle, isRepeat, setIsRepeat
  } = useMusic();

  if (!currentTrack) {
    return (
      <div className="h-24 bg-choco-surface border-t border-choco-hover px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-40 text-choco-muted">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-choco-card rounded-2xl flex items-center justify-center border border-choco-hover text-xl">
            🎧
          </div>
          <div>
            <h4 className="text-sm font-semibold text-choco-text">Ready to Stream</h4>
            <p className="text-xs text-choco-muted">Pick any song from Chocopie Search or Playlists</p>
          </div>
        </div>
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-choco-accent text-choco-bg flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          <Play size={22} fill="currentColor" />
        </button>
        <div className="w-32 hidden md:block"></div>
      </div>
    );
  }

  const isLiked = likedSongs.includes(currentTrack.id);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="h-24 bg-choco-surface border-t border-choco-hover px-4 md:px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-40 shadow-2xl">
      {/* Track Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/3 md:w-1/4 min-w-0">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-choco-hover shadow-md flex-shrink-0"
        />
        <div className="truncate">
          <h4 className="text-xs md:text-sm font-bold text-choco-text truncate">{currentTrack.title}</h4>
          <p className="text-[11px] text-choco-muted truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(currentTrack)}
          className={`p-2 rounded-xl transition flex-shrink-0 ${isLiked ? 'text-choco-accent' : 'text-choco-muted hover:text-choco-text'}`}
          title="Like Song"
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1.5 w-2/3 md:w-2/4 max-w-xl">
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition hidden sm:block ${isShuffle ? 'text-choco-accent' : 'text-choco-muted hover:text-choco-text'}`}
            title="Shuffle"
          >
            <Shuffle size={17} />
          </button>
          <button onClick={playPrevious} className="text-choco-text hover:text-choco-accent transition">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-choco-accent text-choco-bg flex items-center justify-center shadow-lg hover:scale-105 transition"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button onClick={playNext} className="text-choco-text hover:text-choco-accent transition">
            <SkipForward size={20} />
          </button>
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition hidden sm:block ${isRepeat ? 'text-choco-accent' : 'text-choco-muted hover:text-choco-text'}`}
            title="Repeat"
          >
            <Repeat size={17} />
          </button>
        </div>

        <div className="w-full flex items-center gap-2.5 text-[11px] text-choco-muted">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={(e) => seekAudio(Number(e.target.value))}
            className="w-full h-1.5 bg-choco-card rounded-lg appearance-none cursor-pointer accent-choco-accent"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center gap-3 w-1/4 justify-end">
        <Volume2 size={18} className="text-choco-muted" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="w-24 h-1.5 bg-choco-card rounded-lg appearance-none cursor-pointer accent-choco-accent"
        />
      </div>
    </div>
  );
}
