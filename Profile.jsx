import React, { useState } from 'react';
import { Edit2, Camera, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { playlists, likedSongs } = useMusic();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, bio, avatar });
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36">
      <div className="bg-gradient-to-r from-choco-surface via-choco-card to-choco-surface border border-choco-hover rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
        <div className="relative">
          <img
            src={user?.avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-choco-accent shadow-xl"
          />
          <button
            onClick={() => {
              setName(user?.name || '');
              setBio(user?.bio || '');
              setAvatar(user?.avatar || '');
              setIsEditing(true);
            }}
            className="absolute bottom-0 right-0 p-2.5 rounded-full bg-choco-accent text-choco-bg shadow-lg hover:scale-105 transition"
            title="Edit Profile Picture"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-choco-text">{user?.name}</h1>
            <button
              onClick={() => {
                setName(user?.name || '');
                setBio(user?.bio || '');
                setAvatar(user?.avatar || '');
                setIsEditing(true);
              }}
              className="px-4 py-1.5 rounded-xl bg-choco-card hover:bg-choco-hover text-choco-accent text-xs font-semibold border border-choco-hover transition inline-flex items-center gap-1.5 mx-auto md:mx-0"
            >
              <Edit2 size={14} /> Edit Profile & Picture
            </button>
          </div>
          <p className="text-choco-gold text-sm font-semibold mb-2">@{user?.username}</p>
          <p className="text-choco-muted text-sm mb-4">{user?.bio}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-4 py-2 rounded-xl bg-choco-card border border-choco-hover text-xs font-semibold text-choco-text">
              {playlists.length} Playlists
            </span>
            <span className="px-4 py-2 rounded-xl bg-choco-card border border-choco-hover text-xs font-semibold text-choco-text">
              {likedSongs.length} Liked Songs
            </span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-choco-text mb-4">Edit Profile & Picture</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-choco-muted block mb-2">Upload Photo or Choose Avatar</label>
                <div className="flex items-center gap-3 mb-3">
                  <img src={avatar} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-choco-accent" />
                  <label className="px-4 py-2 rounded-xl bg-choco-card hover:bg-choco-hover border border-choco-hover text-xs font-semibold text-choco-text cursor-pointer flex items-center gap-2 transition">
                    <Upload size={14} className="text-choco-accent" /> Upload from Computer
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-3 mb-3">
                  {avatarOptions.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Avatar option"
                      onClick={() => setAvatar(url)}
                      className={`w-11 h-11 rounded-full object-cover cursor-pointer border-2 transition ${avatar === url ? 'border-choco-accent scale-110' : 'border-transparent opacity-60'}`}
                    />
                  ))}
                </div>

                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full bg-choco-card border border-choco-hover rounded-xl px-4 py-2 text-choco-text text-xs outline-none focus:border-choco-accent"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-choco-muted block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-choco-card border border-choco-hover rounded-xl px-4 py-2.5 text-choco-text text-sm outline-none focus:border-choco-accent"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-choco-muted block mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-choco-card border border-choco-hover rounded-xl px-4 py-2.5 text-choco-text text-sm outline-none focus:border-choco-accent resize-none h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-choco-card text-choco-muted hover:text-choco-text text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-choco-accent text-choco-bg font-bold text-xs shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
