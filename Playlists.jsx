import React, { useState } from 'react';
import {
  Plus, Play, Users, Trash2, ArrowLeft, UserPlus,
  Music2, ArrowUp, ArrowDown, Search, X
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { searchChocopieCatalog } from '../services/musicApi';

export default function Playlists() {
  const { user, registeredUsers } = useAuth();
  const {
    playlists, createPlaylist, deletePlaylist,
    activePlaylist, setActivePlaylistId,
    trackCatalog, registerTracksInCatalog,
    addSongToPlaylist, removeSongFromPlaylist, moveSongInPlaylist,
    addCollaborator, removeCollaborator, playTrack
  } = useMusic();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [collabInput, setCollabInput] = useState('');
  const [songQuery, setSongQuery] = useState('');
  const [searchPool, setSearchPool] = useState([]);
  const [searchingSongs, setSearchingSongs] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = createPlaylist(name, description, null, user?.name || 'Rohan Garg');
    setName('');
    setDescription('');
    setShowCreateModal(false);
    setActivePlaylistId(created.id);
  };

  const handleAddCollab = (friendLabel) => {
    if (!friendLabel.trim() || !activePlaylist) return;
    addCollaborator(activePlaylist.id, friendLabel.trim());
    setCollabInput('');
    setShowCollabModal(false);
  };

  const handleSearchSongsForPlaylist = async (q) => {
    setSearchingSongs(true);
    const res = await searchChocopieCatalog(q || 'Top Hits');
    registerTracksInCatalog(res);
    setSearchPool(res);
    setSearchingSongs(false);
  };

  if (activePlaylist) {
    const playlistTracks = activePlaylist.songs
      .map(songId => trackCatalog.find(t => t.id === songId))
      .filter(Boolean);

    const communityFriends = registeredUsers.filter(u => u.id !== user?.id);

    return (
      <div className="p-6 md:p-8 space-y-8 pb-36">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePlaylistId(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-choco-surface border border-choco-hover text-choco-text text-xs font-semibold hover:bg-choco-hover transition"
          >
            <ArrowLeft size={16} /> Back to All Playlists
          </button>

          <button
            onClick={() => deletePlaylist(activePlaylist.id)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition"
          >
            <Trash2 size={14} /> Delete Playlist
          </button>
        </div>

        {/* Playlist Header Banner */}
        <div className="bg-gradient-to-r from-choco-surface via-choco-card to-choco-surface border border-choco-hover rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <img
            src={activePlaylist.coverUrl}
            alt={activePlaylist.name}
            className="w-36 h-36 rounded-2xl object-cover shadow-lg border border-choco-hover flex-shrink-0"
          />
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs bg-choco-accent/20 text-choco-accent px-3 py-1 rounded-full font-semibold border border-choco-accent/30 inline-block mb-2">
              Live Collaborative Playlist
            </span>
            <h1 className="text-3xl font-extrabold text-choco-text mb-1">{activePlaylist.name}</h1>
            <p className="text-choco-muted text-sm mb-2">{activePlaylist.description}</p>
            <p className="text-xs text-choco-gold font-medium">
              Owner: {activePlaylist.owner} • {playlistTracks.length} songs
            </p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {activePlaylist.collaborators?.map((c, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-choco-card px-3 py-1.5 rounded-xl border border-choco-hover text-choco-text flex items-center gap-1.5"
                >
                  <Users size={13} className="text-choco-accent" />
                  {c} (Editor)
                  <button
                    onClick={() => removeCollaborator(activePlaylist.id, c)}
                    className="text-choco-muted hover:text-red-400 ml-1"
                    title="Remove Collaborator"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setShowCollabModal(true)}
                className="text-[11px] bg-choco-accent/15 hover:bg-choco-accent/25 text-choco-accent px-3 py-1.5 rounded-xl border border-choco-accent/30 font-semibold flex items-center gap-1.5 transition"
              >
                <UserPlus size={14} /> Invite Friend to Collaborate
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <button
              onClick={() => playlistTracks.length > 0 && playTrack(playlistTracks[0], playlistTracks)}
              className="px-6 py-3 rounded-2xl bg-choco-card hover:bg-choco-hover text-choco-text font-bold flex items-center justify-center gap-2 border border-choco-hover transition"
            >
              <Play size={18} fill="currentColor" /> Play All
            </button>
            <button
              onClick={() => {
                setShowAddSongModal(true);
                handleSearchSongsForPlaylist('Bollywood');
              }}
              className="px-6 py-3 rounded-2xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Plus size={18} /> Add Songs
            </button>
          </div>
        </div>

        {/* Tracks Inside Playlist */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-choco-text mb-4">Playlist Queue ({playlistTracks.length})</h3>
          {playlistTracks.length === 0 ? (
            <div className="bg-choco-surface border border-choco-hover rounded-3xl p-10 text-center text-choco-muted">
              <Music2 size={40} className="mx-auto mb-3 text-choco-accent opacity-60" />
              <p className="text-sm font-semibold text-choco-text mb-1">This playlist is currently empty</p>
              <p className="text-xs mb-4">Click "Add Songs" to search and add tracks collaboratively.</p>
              <button
                onClick={() => {
                  setShowAddSongModal(true);
                  handleSearchSongsForPlaylist('Bollywood');
                }}
                className="px-5 py-2.5 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs"
              >
                + Add First Song
              </button>
            </div>
          ) : (
            playlistTracks.map((track, idx) => (
              <div
                key={`${track.id}-${idx}`}
                className="bg-choco-surface border border-choco-hover rounded-2xl p-4 flex items-center justify-between hover:border-choco-accent/50 transition"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-bold text-choco-muted w-5">{idx + 1}</span>
                  <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-choco-text truncate">{track.title}</h4>
                    <p className="text-xs text-choco-muted truncate">{track.artist} • {track.album}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-choco-gold mr-2 hidden sm:block">{track.duration}</span>
                  <button
                    onClick={() => moveSongInPlaylist(activePlaylist.id, idx, -1)}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-choco-card text-choco-muted hover:text-choco-text disabled:opacity-30 transition"
                    title="Move Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    onClick={() => moveSongInPlaylist(activePlaylist.id, idx, 1)}
                    disabled={idx === playlistTracks.length - 1}
                    className="p-2 rounded-xl bg-choco-card text-choco-muted hover:text-choco-text disabled:opacity-30 transition"
                    title="Move Down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    onClick={() => playTrack(track, playlistTracks)}
                    className="p-2.5 rounded-xl bg-choco-accent text-choco-bg hover:scale-105 transition shadow-md"
                    title="Play"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => removeSongFromPlaylist(activePlaylist.id, track.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition border border-red-500/20"
                    title="Remove Song"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Invite Collaborator Modal */}
        {showCollabModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-xl font-bold text-choco-text">Invite Friend to Co-Edit</h3>
              <p className="text-xs text-choco-muted">Select a friend below or type their username to grant live editing access:</p>

              <div className="space-y-2">
                {communityFriends.map(f => {
                  const label = `${f.name} (@${f.username})`;
                  const alreadyAdded = activePlaylist.collaborators?.includes(label);
                  return (
                    <div key={f.id} className="bg-choco-card p-3 rounded-2xl flex items-center justify-between border border-choco-hover">
                      <div className="flex items-center gap-3">
                        <img src={f.avatar} alt={f.name} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-choco-text">{f.name}</h4>
                          <p className="text-[10px] text-choco-muted">@{f.username}</p>
                        </div>
                      </div>
                      {alreadyAdded ? (
                        <span className="text-[11px] text-emerald-400 font-semibold">Editor</span>
                      ) : (
                        <button
                          onClick={() => handleAddCollab(label)}
                          className="px-3 py-1.5 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs"
                        >
                          Add Editor
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-choco-hover">
                <label className="text-xs font-semibold text-choco-muted block mb-1">Or enter any username</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={collabInput}
                    onChange={(e) => setCollabInput(e.target.value)}
                    placeholder="@username"
                    className="flex-1 bg-choco-card border border-choco-hover rounded-xl px-3 py-2 text-choco-text text-xs outline-none focus:border-choco-accent"
                  />
                  <button
                    onClick={() => handleAddCollab(collabInput)}
                    className="px-4 py-2 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs"
                  >
                    Invite
                  </button>
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  onClick={() => setShowCollabModal(false)}
                  className="px-4 py-2 rounded-xl bg-choco-card text-choco-muted hover:text-choco-text text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Songs Modal */}
        {showAddSongModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-choco-text">Add Songs to Playlist</h3>
                <button onClick={() => setShowAddSongModal(false)} className="text-choco-muted hover:text-choco-text">
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSongsForPlaylist(songQuery);
                }}
                className="flex items-center gap-2 bg-choco-card px-3 py-2.5 rounded-2xl border border-choco-hover mb-4"
              >
                <Search size={16} className="text-choco-accent" />
                <input
                  type="text"
                  value={songQuery}
                  onChange={(e) => setSongQuery(e.target.value)}
                  placeholder="Search any song..."
                  className="bg-transparent border-none outline-none text-xs text-choco-text w-full"
                />
                <button type="submit" className="px-3 py-1 rounded-lg bg-choco-accent text-choco-bg font-bold text-xs">
                  Search
                </button>
              </form>

              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {searchingSongs ? (
                  <p className="text-xs text-choco-muted text-center py-6">Searching catalog...</p>
                ) : (
                  (searchPool.length > 0 ? searchPool : trackCatalog).map(track => {
                    const alreadyAdded = activePlaylist.songs.includes(track.id);
                    return (
                      <div key={track.id} className="bg-choco-card p-3 rounded-2xl flex items-center justify-between border border-choco-hover">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-choco-text truncate">{track.title}</h4>
                            <p className="text-[10px] text-choco-muted truncate">{track.artist}</p>
                          </div>
                        </div>
                        {alreadyAdded ? (
                          <span className="text-[11px] text-emerald-400 font-semibold px-3 py-1">Added</span>
                        ) : (
                          <button
                            onClick={() => addSongToPlaylist(activePlaylist.id, track)}
                            className="px-3.5 py-1.5 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs shadow-md flex-shrink-0"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-choco-hover text-right">
                <button
                  onClick={() => setShowAddSongModal(false)}
                  className="px-5 py-2 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-choco-text mb-2">Playlists & Collaboration</h1>
          <p className="text-choco-muted text-sm">Click any playlist below to open it, add tracks, and invite friends to co-edit.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-2xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold flex items-center gap-2 shadow-lg transition self-start"
        >
          <Plus size={18} /> Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            onClick={() => setActivePlaylistId(playlist.id)}
            className="bg-choco-surface border border-choco-hover rounded-3xl p-5 flex flex-col justify-between hover:border-choco-accent transition shadow-xl cursor-pointer group"
          >
            <div>
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full aspect-video object-cover shadow-md group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-choco-accent text-choco-bg font-bold text-xs shadow-lg">
                    Open Playlist
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-choco-text text-lg mb-1 group-hover:text-choco-accent transition">{playlist.name}</h3>
              <p className="text-xs text-choco-muted mb-3 line-clamp-2">{playlist.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-choco-hover">
              <span className="text-xs text-choco-gold font-medium">{playlist.songs.length} songs</span>
              <span className="text-[10px] bg-choco-card px-2.5 py-1 rounded-full text-choco-accent border border-choco-hover flex items-center gap-1">
                <Users size={12} /> {playlist.collaborators?.length || 0} Editors
              </span>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-choco-text mb-4">Create New Collaborative Playlist</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-choco-muted block mb-1">Playlist Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Delhi Roadtrip Mix"
                  className="w-full bg-choco-card border border-choco-hover rounded-xl px-4 py-2.5 text-choco-text text-sm outline-none focus:border-choco-accent"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-choco-muted block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a short description..."
                  className="w-full bg-choco-card border border-choco-hover rounded-xl px-4 py-2.5 text-choco-text text-sm outline-none focus:border-choco-accent resize-none h-24"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-choco-card text-choco-muted hover:text-choco-text text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs shadow-lg">Create & Open</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
