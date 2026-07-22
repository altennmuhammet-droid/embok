import { useStore } from '../store/data';
import DraggableWindow from './DraggableWindow';

export default function DesktopProperties({ onClose, setZIndex, zIndex }) {
  const { wallpaper, changeWallpaper } = useStore();

  const wallpapers = [
    { name: 'Mutluluk (Bliss)', file: 'mutluluk.jpg' },
    { name: 'Kızıl Ay Çölü', file: 'kızıl-ay-colu.jpg' },
    { name: 'Laleler', file: 'laleler.jpg' },
    { name: 'Sonbahar', file: 'sonbahar.jpg' },
    { name: 'Takip Etmek', file: 'takip-etmek.jpg' },
    { name: 'Klasik 4K', file: 'wp13869429-4k-windows-xp-wallpapers.jpg' },
    { name: 'Hiçbiri', file: 'none' }
  ];

  const applyWallpaper = (file) => {
    changeWallpaper(file);
  };


  return (
    <DraggableWindow 
      title="Görüntü Özellikleri" 
      icon="📺" 
      onClose={onClose} 
      zIndex={zIndex} 
      setZIndex={setZIndex}
      resizable={true}
    >
      <div style={{ width: '350px', padding: '10px' }}>
        <div style={{ 
          width: '100%', height: '200px', 
          background: wallpaper === 'none' ? '#0055e5' : `url('/assets/${wallpaper}') center/cover`,
          border: '2px inset #fff', marginBottom: '15px', position: 'relative'
        }}>
          {/* Mini monitor frame effect */}
          <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', background: '#c0c0c0', padding: '2px 10px', fontSize: '10px', border: '1px outset #fff' }}>
            Önizleme
          </div>
        </div>

        <fieldset style={{ padding: '10px' }}>
          <legend>Arka Plan</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12px', marginBottom: '5px' }}>Masaüstü arka planınızı seçin:</span>
            <div className="win95-inset" style={{ height: '100px', overflowY: 'auto', background: '#fff', padding: '2px' }}>
              {wallpapers.map(wp => (
                <div 
                  key={wp.file} 
                  onClick={() => applyWallpaper(wp.file)}
                  style={{ 
                    padding: '2px 5px', 
                    background: wallpaper === wp.file ? '#000080' : 'transparent',
                    color: wallpaper === wp.file ? '#fff' : '#000',
                    cursor: 'pointer'
                  }}
                >
                  {wp.name}
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '15px' }}>
          <button className="win95-btn" onClick={onClose} style={{ minWidth: '70px' }}>Tamam</button>
        </div>
      </div>
    </DraggableWindow>
  );
}
