export default function ImageViewerModal({ src, title, uploader, onClose }) {
  if (!src) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 100000
    }} onClick={onClose}>
      <img src={src} alt={title} style={{ maxWidth: '90%', maxHeight: '80%', border: '2px solid white', borderRadius: '4px' }} onClick={e => e.stopPropagation()} />
      <div style={{ color: 'white', marginTop: '15px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: 0, fontSize: '24px' }}>{title}</h2>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Yükleyen: {uploader}</p>
        <button className="win95-btn" style={{ marginTop: '15px', padding: '5px 20px', color: 'black' }} onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
}
