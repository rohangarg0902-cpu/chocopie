import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Heart, Plus, Check } from 'lucide-react';
import { searchChocopieCatalog } from '../services/musicApi';
import { useMusic } from '../context/MusicContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingTrack, setAddingTrack] = useState(null);
  const [addedFeedback, setAddedFeedback] = useState('');

  const {
    playTrack, likedSongs, toggleLike,
    playlists, addSongToPlaylist, registerTracksInCatalog
  } = useMusic();

  const categories = [
    'Bollywood Hits', 'Arijit Singh', 'Punjabi Music', 'Diljit Dosanjh',
    'English Pop', 'The Weeknd', 'Hip-Hop', 'Lo-Fi Chill', 'Rock'
  ];

  useEffect(() => {
    handleSearch('Bollywood Hits');
  }, []);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    const tracks = await searchChocopieCatalog(searchQuery);
    registerTracksInCatalog(tracks);
    setResults(tracks);
    setLoading(false);
  };

  const handleSelectPlaylist = (playlistId, track) => {
    addSongToPlaylist(playlistId, track);
    setAddedFeedback(track.id);
    setAddingTrack(null);
    setTimeout(() => setAddedFeedback(''), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-choco-text mb-2">Chocopie Search</h1>
        <p className="text-choco-muted text-sm mb-6">
          Search any song, artist, or album, stream audio instantly, or add tracks to your collaborative playlists.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex items-center gap-3 bg-choco-surface px-4 py-3 rounded-2xl border border-choco-hover shadow-lg"
        >
          <SearchIcon size={20} className="text-choco-accent" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any song, artist, or album (e.g. Kesariya, Blinding Lights, Diljit)..."
            className="bg-transparent border-none outline-none text-sm text-choco-text w-full placeholder-choco-muted"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs hover:bg-choco-accentHover transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div>
        <h3 className="text-xs font-bold text-choco-muted uppercase tracking-wider mb-3">Quick Genres & Artists</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setQuery(cat);
                handleSearch(cat);
              }}
              className="px-4 py-2 rounded-xl bg-choco-surface hover:bg-choco-hover text-choco-text text-xs font-semibold border border-choco-hover transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div>
        <h3 className="text-xl font-bold text-choco-text mb-4">
          {loading ? 'Searching catalog...' : `Tracks Found (${results.length})`}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(track => {
            const isLiked = likedSongs.includes(track.id);
            return (
              <div key={track.id} className="bg-choco-surface border border-choco-hover rounded-3xl p-4 flex flex-col justify-between hover:border-choco-accent/50 transition group relative">
                <div>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-md">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <button
                      onClick={() => playTrack(track, results)}
                      className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-choco-accent text-choco-bg flex items-center justify-center shadow-lg hover:scale-105 transition"
                      title="Play Track"
                    >
                      <Play size={18} fill="currentColor" />
                    </button>
                  </div>
                  <h4 className="font-bold text-choco-text text-sm truncate">{track.title}</h4>
                  <p className="text-xs text-choco-muted truncate">{track.artist}</p>
                  <p className="text-[10px] text-choco-muted/80 truncate mt-0.5">{track.album}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-choco-hover">
                  <span className="text-[10px] text-choco-gold font-medium">{track.duration}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAddingTrack(track)}
                      className="p-2 rounded-xl text-choco-muted hover:text-choco-accent hover:bg-choco-card transition"
                      title="Add to Playlist"
                    >
                      {addedFeedback === track.id ? <Check size={17} className="text-emerald-400" /> : <Plus size={17} />}
                    </button>
                    <button
                      onClick={() => toggleLike(track)}
                      className={`p-2 rounded-xl transition ${isLiked ? 'text-choco-accent' : 'text-choco-muted hover:text-choco-text'}`}
                      title="Like"
                    >
                      <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add to Playlist Modal */}
      {addingTrack && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-choco-text mb-1">Add to Playlist</h3>
            <p className="text-xs text-choco-muted mb-4 truncate">"{addingTrack.title}" by {addingTrack.artist}</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => handleSelectPlaylist(pl.id, addingTrack)}
                  className="w-full p-3 rounded-2xl bg-choco-card hover:bg-choco-hover border border-choco-hover flex items-center gap-3 text-left transition"
                >
                  <img src={pl.coverUrl} alt={pl.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-choco-text">{pl.name}</h4>
                    <p className="text-[10px] text-choco-muted">{pl.songs.length} songs</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setAddingTrack(null)}
              className="w-full mt-4 py-2.5 rounded-xl bg-choco-card text-choco-muted hover:text-choco-text text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
