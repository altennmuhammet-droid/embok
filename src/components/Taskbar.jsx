import { useState, useEffect } from 'react';

export default function Taskbar({ openWindows, toggleWindow, bringToFront }) {
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
      setDateStr(now.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const openApp = (id) => {
    toggleWindow(id, true);
    setIsStartOpen(false);
  };

  const activeApps = Object.entries(openWindows).filter(([id, isOpen]) => isOpen);

  return (
    <>
      {isStartOpen && (
        <div className="xp-start-menu">
          <div className="xp-start-header">
            <img src="/assets/xp_computer.png" alt="User" width="32" />
            <span>Yüce Divan Üyesi</span>
          </div>
          <div className="xp-start-items">
            <div className="xp-start-item" onClick={() => openApp('leaderboard')}>
              <span style={{ fontSize: '20px' }}>🏆</span> Vatandaşlık Sicili
            </div>
            <div className="xp-start-item" onClick={() => openApp('rules')}>
              <span style={{ fontSize: '20px' }}>📜</span> Kanunlar (KHK.EXE)
            </div>
            <div className="xp-start-item" onClick={() => openApp('stats')}>
              <span style={{ fontSize: '20px' }}>📊</span> Sistem Analizi
            </div>
            <div className="xp-start-item" onClick={() => openApp('pending')}>
              <span style={{ fontSize: '20px' }}>⚖️</span> Yüce Divan
            </div>
            <div className="xp-start-item" onClick={() => openApp('feed')}>
              <span style={{ fontSize: '20px' }}>📝</span> Kesinleşen Hükümler
            </div>
            <div className="divider" style={{ margin: '5px 0' }}></div>
            <div className="xp-start-item" onClick={() => openApp('minesweeper')}>
              <img src="/assets/xp_mines.png" alt="Mine" width="20" /> Mayın Tarlası
            </div>
            <div className="xp-start-item" onClick={() => openApp('paint')}>
              <img src="/assets/xp_paint.png" alt="Paint" width="20" /> MS Paint
            </div>
            <div className="xp-start-item" onClick={() => openApp('mediaPlayer')}>
              <img src="/assets/xp_media.png" alt="Radyo" width="20" /> Radyo
            </div>
          </div>
        </div>
      )}

      <div className="xp-taskbar">
        <div className={`xp-start-btn ${isStartOpen ? 'active' : ''}`} onClick={() => setIsStartOpen(!isStartOpen)}>
          <img src="/assets/xp_logo.svg" alt="WinXP Logo" className="xp-start-icon" />
          start
        </div>

        <div style={{ padding: '0 10px', display: 'flex', gap: '5px', flexGrow: 1, overflowX: 'hidden' }}>
          {activeApps.map(([id]) => (
            <div 
              key={id}
              onClick={() => bringToFront(id)}
              style={{ 
                background: '#1a4cd2', color: 'white', padding: '3px 10px', 
                fontSize: '12px', border: '1px solid #000', borderRadius: '3px',
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2)', cursor: 'pointer',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px'
              }}
            >
              {id.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="xp-system-tray">
          <div style={{ display: 'flex', gap: '8px', marginRight: '10px', position: 'relative' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowVolume(!showVolume)}>🔊</span>
            {showVolume && (
              <div style={{ position: 'absolute', bottom: '100%', right: '0', background: '#c0c0c0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', marginBottom: '5px' }}>Ses</span>
                <input type="range" orient="vertical" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ height: '80px', writingMode: 'bt-lr', appearance: 'slider-vertical' }} />
              </div>
            )}
          </div>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowCalendar(!showCalendar)} title={dateStr}>
            {time}
            {showCalendar && (
              <div style={{ position: 'absolute', bottom: '100%', right: '0', background: '#c0c0c0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff', padding: '10px', width: '200px', marginBottom: '5px', color: 'black', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #808080', paddingBottom: '5px', marginBottom: '5px' }}>
                  {dateStr}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center', fontSize: '12px' }}>
                  {['Pzt','Sal','Çar','Per','Cum','Cmt','Pzr'].map(d => <div key={d} style={{ fontWeight: 'bold' }}>{d}</div>)}
                  {Array.from({length: 31}, (_, i) => (
                    <div key={i} style={{ padding: '2px', background: i + 1 === new Date().getDate() ? '#000080' : 'transparent', color: i + 1 === new Date().getDate() ? '#fff' : '#000' }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
