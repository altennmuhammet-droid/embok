import { useState, useRef, useEffect } from 'react';

export default function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const playlist = [
    { title: 'Lofi Chill / Çalışma Müzikleri', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
    { title: '80ler Nostalji Hitleri', url: 'https://streams.ilovemusic.de/iloveradio2.mp3' },
    { title: 'Synthwave / Retro', url: 'https://streams.ilovemusic.de/iloveradio26.mp3' },
    { title: 'Klasik Müzik', url: 'https://streams.ilovemusic.de/iloveradio22.mp3' },
    { title: 'Top 100 Hit Şarkılar', url: 'https://streams.ilovemusic.de/iloveradio16.mp3' },
    { title: 'Hip Hop & R&B', url: 'https://streams.ilovemusic.de/iloveradio14.mp3' },
    { title: 'Hardstyle & EDM', url: 'https://streams.ilovemusic.de/iloveradio21.mp3' },
    { title: 'Rock & Alternatif', url: 'https://streams.ilovemusic.de/iloveradio11.mp3' },
    { title: 'Yaz Hitleri', url: 'https://streams.ilovemusic.de/iloveradio10.mp3' },
    { title: 'Spor / Workout', url: 'https://streams.ilovemusic.de/iloveradio37.mp3' },
    { title: 'Akustik & Cover', url: 'https://streams.ilovemusic.de/iloveradio104.mp3' }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* Ekran */}
      <div className="win95-inset" style={{ background: '#000', color: '#0f0', padding: '10px', fontFamily: 'monospace', textAlign: 'center', minHeight: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <marquee scrollamount="3" style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {isPlaying ? `▶ OYNATILIYOR: ${playlist[currentTrackIndex].title}` : `⏸ DURDURULDU: ${playlist[currentTrackIndex].title}`}
        </marquee>
        <div style={{ fontSize: '10px', color: '#0a0', marginTop: '5px' }}>
          EMBOK MEDYA OYNATICISI v1.0
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={playlist[currentTrackIndex].url} 
        onEnded={nextTrack}
      />

      {/* Kontroller */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="win95-btn" onClick={prevTrack} title="Önceki">
            ⏮
          </button>
          <button className="win95-btn" onClick={togglePlay} title={isPlaying ? "Durdur" : "Oynat"} style={{ width: '40px', fontWeight: 'bold' }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="win95-btn" onClick={nextTrack} title="Sonraki">
            ⏭
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px' }}>🔈</span>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '60px' }}
          />
        </div>
      </div>

      {/* Çalma Listesi */}
      <fieldset style={{ padding: '5px', margin: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <legend style={{ fontSize: '12px' }}>Radyo İstasyonları</legend>
        <div className="win95-inset" style={{ flex: 1, overflowY: 'auto', background: '#fff', padding: '0', minHeight: '80px' }}>
          {playlist.map((track, idx) => (
            <div 
              key={idx} 
              onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
              style={{ 
                padding: '2px 5px', 
                fontSize: '12px', 
                cursor: 'pointer',
                background: currentTrackIndex === idx ? '#0000aa' : 'transparent',
                color: currentTrackIndex === idx ? '#fff' : '#000'
              }}
            >
              {idx + 1}. {track.title}
            </div>
          ))}
        </div>
      </fieldset>

    </div>
  );
}
