import { useState, useRef } from 'react';
import { useStore } from '../store/data';

export default function WidgetGallery({ currentUser, onImageClick }) {
  const { gallery, addGalleryImage, users } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const finalTitle = title.trim() || 'İsimsiz Anı';
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Otomatik küçültme ve sıkıştırma (Maks 800px)
        const MAX = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h *= MAX/w; w = MAX; }
          else { w *= MAX/h; h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        
        // %60 kalite JPEG formatında veritabanı kilitlenmesini önlemek için
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6); 
        addGalleryImage(dataUrl, finalTitle, currentUser.id);
        
        setIsUploading(false);
        setTitle('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Input'u temizle
  };

  const getUploaderName = (id) => users.find(u => u.id === id)?.name || id;

  return (
    <div style={{
      position: 'absolute',
      bottom: '40px', /* Taskbar'ın hemen üstünde */
      right: '20px',
      width: '300px',
      height: '450px',
      background: '#ece9d8', /* XP Classic background */
      border: '1px solid #0055e5',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      color: '#000',
      zIndex: 9000,
      fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
      boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        background: 'linear-gradient(180deg, #0058e6 0%, #3a93ff 8%, #288eff 40%, #127dff 88%, #036bfa 100%)',
        color: 'white', padding: '5px 10px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center' 
      }}>
        <span style={{ marginRight: '8px' }}>🖼️</span> Masaüstü Galerisi
      </div>

      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px', minHeight: 0 }}>
        <div className="gallery-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '5px', background: '#fff', border: '2px inset #dfdfdf', padding: '5px' }}>
        {gallery.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.7, marginTop: '30px', fontSize: '13px' }}>Henüz anı eklenmedi.</div>
        ) : (
          gallery.map(img => (
            <div key={img.id} style={{ background: '#f5f5f5', padding: '8px', border: '1px solid #ccc' }}>
              <img 
                src={img.url} 
                alt={img.title} 
                style={{ width: '100%', cursor: 'pointer', border: '1px solid #000' }} 
                onClick={() => onImageClick && onImageClick(img)} 
                title="Büyük halini görmek için tıkla"
              />
              <div style={{ marginTop: '5px', fontSize: '12px', fontWeight: 'bold' }}>{img.title}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Yükleyen: {getUploaderName(img.uploaderId)}</div>
            </div>
          ))
        )}
      </div>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'stretch' }}>
          <input 
            type="text" 
            placeholder="Fotoğraf Başlığı..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, padding: '4px', border: '2px inset #dfdfdf', outline: 'none', fontSize: '12px' }}
          />
          <button 
            className="win95-btn"
            onClick={handleUploadClick}
            disabled={isUploading}
            style={{ padding: '0 15px', fontWeight: 'bold' }}
            title="Bilgisayardan fotoğraf seç"
          >
            {isUploading ? '...' : '+'}
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
        </div>
      </div>
      <style>{`
        .gallery-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .gallery-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-left: 1px solid #dfdfdf;
        }
        .gallery-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border: 1px solid #aaa;
        }
      `}</style>
    </div>
  );
}
