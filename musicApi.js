// CHOCOPIE Music Service & Catalog Search (Independent)
export async function searchChocopieCatalog(query = 'Bollywood hits') {
  const searchTerm = query.trim() || 'Top Hits';

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=24&country=IN`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((item, index) => ({
          id: String(item.trackId),
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName || 'CHOCOPIE Single',
          duration: formatMs(item.trackTimeMillis || 180000),
          coverUrl: item.artworkUrl100
            ? item.artworkUrl100.replace('100x100bb', '600x600bb')
            : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
          audioUrl: item.previewUrl || getAudioFallback(index),
          source: 'CHOCOPIE Catalog'
        }));
      }
    }
  } catch (e) {
    console.warn('Catalog search fallback used:', e);
  }

  return getCuratedTracks(searchTerm);
}

function formatMs(ms) {
  const totalSec = Math.floor((ms || 180000) / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function getAudioFallback(index) {
  const streams = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  ];
  return streams[index % streams.length];
}

export function getCuratedTracks(query = '') {
  const tracks = [
    {
      id: 'cp-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
      source: 'Featured'
    },
    {
      id: 'cp-2',
      title: 'Kesariya',
      artist: 'Arijit Singh, Pritam',
      album: 'Brahmastra',
      duration: '4:28',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
      source: 'Featured'
    },
    {
      id: 'cp-3',
      title: 'Lover',
      artist: 'Diljit Dosanjh',
      album: 'MoonChild Era',
      duration: '3:10',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=400&q=80',
      source: 'Featured'
    },
    {
      id: 'cp-4',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: '3:23',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
      source: 'Featured'
    },
    {
      id: 'cp-5',
      title: 'Apna Bana Le',
      artist: 'Arijit Singh, Sachin-Jigar',
      album: 'Bhediya',
      duration: '4:21',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      source: 'Featured'
    },
    {
      id: 'cp-6',
      title: 'Starboy',
      artist: 'The Weeknd, Daft Punk',
      album: 'Starboy',
      duration: '3:50',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
      source: 'Featured'
    }
  ];

  if (!query) return tracks;
  const filtered = tracks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.artist.toLowerCase().includes(query.toLowerCase()) ||
    t.album.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.length > 0 ? filtered : tracks;
}
