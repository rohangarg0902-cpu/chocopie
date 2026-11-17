import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCuratedTracks } from '../services/musicApi';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [trackCatalog, setTrackCatalog] = useState(() => getCuratedTracks());
  const [queue, setQueue] = useState(() => getCuratedTracks());
  const [likedSongs, setLikedSongs] = useState(['cp-1', 'cp-2']);
  const [dislikedSongs, setDislikedSongs] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState(null);

  const [playlists, setPlaylists] = useState([
    {
      id: 'p1',
      name: 'Delhi Late Night Vibes',
      description: 'Chill Bollywood & Indie tracks for coding and relaxing',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      songs: ['cp-1', 'cp-2', 'cp-5'],
      isPublic: true,
      owner: 'Rohan Garg',
      collaborators: ['Priya Sharma (@priya_sharma)']
    },
    {
      id: 'p2',
      name: 'BTech Exam Stressbusters',
      description: 'High energy Punjabi & Pop hits',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
      songs: ['cp-3', 'cp-4'],
      isPublic: true,
      owner: 'Rohan Garg',
      collaborators: ['Aman Verma (@aman_v)']
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'Priya Sharma accepted your friend request', time: '2m ago', read: false },
    { id: 'n2', text: 'Aman Verma added "Lover" to BTech Exam Stressbusters', time: '15m ago', read: false }
  ]);

  const audioRef = useRef(new Audio());

  const registerTracksInCatalog = (tracksList) => {
    if (!tracksList || tracksList.length === 0) return;
    setTrackCatalog(prev => {
      const map = new Map(prev.map(t => [t.id, t]));
      tracksList.forEach(t => map.set(t.id, t));
      return Array.from(map.values());
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue, currentTrack, isRepeat, isShuffle]);

  const playTrack = (track, customQueue = null) => {
    if (!track) return;
    registerTracksInCatalog([track]);
    if (customQueue) {
      registerTracksInCatalog(customQueue);
      setQueue(customQueue);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
    audioRef.current.src = track.audioUrl;
    audioRef.current.play().catch(e => console.log('Audio playback notice:', e));
  };

  const togglePlay = () => {
    if (!currentTrack && queue.length > 0) {
      playTrack(queue[0]);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log('Audio resume notice:', e));
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * queue.length);
      playTrack(queue[randomIdx]);
      return;
    }
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  };

  const seekAudio = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (newVol) => {
    setVolume(newVol);
    audioRef.current.volume = newVol;
  };

  const toggleLike = (track) => {
    const trackObj = typeof track === 'string' ? trackCatalog.find(t => t.id === track) : track;
    const trackId = typeof track === 'string' ? track : track.id;
    if (trackObj) registerTracksInCatalog([trackObj]);

    setLikedSongs(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
    setDislikedSongs(prev => prev.filter(id => id !== trackId));
  };

  const toggleDislike = (trackId) => {
    setDislikedSongs(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
    setLikedSongs(prev => prev.filter(id => id !== trackId));
  };

  const createPlaylist = (name, description, coverUrl, ownerName = 'Rohan Garg') => {
    const newPlaylist = {
      id: 'p-' + Date.now(),
      name,
      description: description || 'Collaborative CHOCOPIE Playlist',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
      songs: [],
      isPublic: true,
      owner: ownerName,
      collaborators: []
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (activePlaylistId === playlistId) setActivePlaylistId(null);
  };

  const addSongToPlaylist = (playlistId, track) => {
    const trackObj = typeof track === 'string' ? trackCatalog.find(t => t.id === track) : track;
    const trackId = typeof track === 'string' ? track : track.id;
    if (trackObj) registerTracksInCatalog([trackObj]);

    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.songs.includes(trackId)) {
        return { ...p, songs: [...p.songs, trackId] };
      }
      return p;
    }));
  };

  const removeSongFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(id => id !== trackId) };
      }
      return p;
    }));
  };

  const moveSongInPlaylist = (playlistId, index, direction) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id !== playlistId) return p;
      const newSongs = [...p.songs];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newSongs.length) return p;
      [newSongs[index], newSongs[targetIndex]] = [newSongs[targetIndex], newSongs[index]];
      return { ...p, songs: newSongs };
    }));
  };

  const addCollaborator = (playlistId, friendLabel) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.collaborators.includes(friendLabel)) {
        return { ...p, collaborators: [...p.collaborators, friendLabel] };
      }
      return p;
    }));
    setNotifications(prev => [
      { id: 'n-' + Date.now(), text: `Invited ${friendLabel} to collaborate on playlist`, time: 'Just now', read: false },
      ...prev
    ]);
  };

  const removeCollaborator = (playlistId, friendLabel) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, collaborators: p.collaborators.filter(c => c !== friendLabel) };
      }
      return p;
    }));
  };

  const activePlaylist = playlists.find(p => p.id === activePlaylistId) || null;

  return (
    <MusicContext.Provider value={{
      currentTrack, isPlaying, volume, progress, duration, queue,
      isShuffle, setIsShuffle, isRepeat, setIsRepeat,
      trackCatalog, registerTracksInCatalog,
      likedSongs, dislikedSongs, playlists,
      activePlaylist, setActivePlaylistId,
      notifications, setNotifications,
      playTrack, togglePlay, playNext, playPrevious, seekAudio, changeVolume,
      toggleLike, toggleDislike,
      createPlaylist, deletePlaylist,
      addSongToPlaylist, removeSongFromPlaylist, moveSongInPlaylist,
      addCollaborator, removeCollaborator, setQueue
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
