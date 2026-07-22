import { useStore } from '../store/data';

export default function GalleryFolder({ onImageClick }) {
  const { gallery, users } = useStore();
  
  return (
    <div style={{ height: '100%', background: '#fff', padding: '10px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '15px', alignContent: 'flex-start' }}>
      {gallery.length === 0 ? (
        <div style={{ width: '100%', textAlign: 'center', marginTop: '20px', color: '#666' }}>Klasör boş.</div>
      ) : (
        gallery.map(img => (
          <div 
            key={img.id} 
            style={{ width: '120px', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => onImageClick(img)}
          >
            <div style={{ width: '120px', height: '90px', border: '1px solid #ccc', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src={img.url} alt={img.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px', wordWrap: 'break-word', lineHeight: '1.2' }}>{img.title}</div>
          </div>
        ))
      )}
    </div>
  );
}
