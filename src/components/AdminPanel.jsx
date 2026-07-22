import { useState } from 'react';
import { useStore } from '../store/data';

export default function AdminPanel({ currentUser }) {
  const { 
    users, 
    notepad, 
    gallery, 
    updateScore, 
    clearGallery, 
    clearNotepad, 
    deleteGalleryImage, 
    deleteNotepadEntry, 
    updateNotepadEntry,
    resetSystem
  } = useStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('scores');

  // Local state for editing scores
  const [editScores, setEditScores] = useState({});

  const encode = (s) => btoa(unescape(encodeURIComponent(s)));

  const handleLogin = (e) => {
    e.preventDefault();
    if (encode(password) === 'YWx0YW7EsW4ub3Jvc3B1bGFyxLE=') {
      setIsAuthenticated(true);
      setError('');
      
      // Initialize edit scores
      const initialScores = {};
      users.forEach(u => initialScores[u.id] = u.score);
      setEditScores(initialScores);
    } else {
      setError('Erişim reddedildi. Hatalı şifre.');
    }
  };

  const handleScoreChange = (userId, value) => {
    setEditScores({ ...editScores, [userId]: value });
  };

  const handleSave = (userId) => {
    updateScore(userId, editScores[userId]);
    alert('Puan güncellendi!');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: 'red' }}>⚠️ YETKİSİZ ERİŞİM DENEMESİ ⚠️</h3>
        <p>Bu alana sadece sistem yöneticisi girebilir.</p>
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <input 
            type="password" 
            className="win95-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Yönetici Şifresi"
          />
          <button type="submit" className="win95-btn" style={{ marginLeft: '10px' }}>Giriş Yap</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid #fff', marginBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('scores')} 
          style={{ padding: '5px 10px', fontWeight: activeTab === 'scores' ? 'bold' : 'normal', background: activeTab === 'scores' ? '#dfdfdf' : '#c0c0c0', border: '2px outset #fff', borderBottom: activeTab === 'scores' ? 'none' : '2px outset #fff', cursor: 'pointer' }}
        >
          Puanlar
        </button>
        <button 
          onClick={() => setActiveTab('notes')} 
          style={{ padding: '5px 10px', fontWeight: activeTab === 'notes' ? 'bold' : 'normal', background: activeTab === 'notes' ? '#dfdfdf' : '#c0c0c0', border: '2px outset #fff', borderBottom: activeTab === 'notes' ? 'none' : '2px outset #fff', cursor: 'pointer' }}
        >
          Not Defteri
        </button>
        <button 
          onClick={() => setActiveTab('gallery')} 
          style={{ padding: '5px 10px', fontWeight: activeTab === 'gallery' ? 'bold' : 'normal', background: activeTab === 'gallery' ? '#dfdfdf' : '#c0c0c0', border: '2px outset #fff', borderBottom: activeTab === 'gallery' ? 'none' : '2px outset #fff', cursor: 'pointer' }}
        >
          Galeri
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '5px' }}>
        {activeTab === 'scores' && (
          <div>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--w95-border-dark)', paddingBottom: '5px' }}>
              Kullanıcı Puanı Yönetimi
            </h3>
            <table className="win95-table" style={{ width: '100%', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>Mevcut Puan</th>
                  <th>Yeni Puan</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <img src={`/assets/embok/${u.avatar}`} alt={u.name} style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '2px' }} draggable="false" />
                      {u.name}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{u.score}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="number" 
                        className="win95-input"
                        style={{ width: '80px', textAlign: 'right' }}
                        value={editScores[u.id] !== undefined ? editScores[u.id] : u.score}
                        onChange={(e) => handleScoreChange(u.id, e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="win95-btn" onClick={() => handleSave(u.id)}>Kaydet</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
              Not: Puanı kaydettiğiniz anda tüm kullanıcılara anında yansıyacaktır.
            </div>

            <div style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '10px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'red' }}>⚠️ SİSTEMİ SIFIRLA</h4>
              <button 
                onClick={() => {
                  if (window.confirm("Bütün tutanaklar, kararnameler silinecek ve puanlar 1000'e dönecek! Yayına almak için emin misin?")) resetSystem();
                }}
                style={{ padding: '8px 15px', background: 'red', color: 'white', border: '2px outset #ffaaaa', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
              >
                Tüm Verileri Sıfırla (Yayına Al)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--w95-border-dark)', paddingBottom: '5px' }}>
              Not Defteri Yönetimi
            </h3>
            <div className="win95-inset" style={{ background: '#fff', padding: '5px', maxHeight: '300px', overflowY: 'auto' }}>
              {notepad.length === 0 ? <p style={{color: 'gray'}}>Not bulunmuyor.</p> : notepad.map(note => (
                <div key={note.id} style={{ display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>
                  <div style={{ flex: 1, fontSize: '12px', wordBreak: 'break-word' }}>{note.text}</div>
                  <button className="win95-btn" onClick={() => {
                    const newText = window.prompt("Notu düzenle:", note.text);
                    if (newText !== null && newText.trim() !== '') {
                      updateNotepadEntry(note.id, newText);
                    }
                  }}>Düzenle</button>
                  <button className="win95-btn" style={{ color: 'red' }} onClick={() => {
                    if (window.confirm("Bu notu silmek istediğine emin misin?")) deleteNotepadEntry(note.id);
                  }}>Sil</button>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                if (window.confirm("Tüm Not Defteri silinecek! Emin misin?")) clearNotepad();
              }}
              style={{ marginTop: '15px', padding: '8px 15px', background: 'darkorange', color: 'white', border: '2px outset #ffccaa', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
            >
              Tüm Notları Temizle
            </button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--w95-border-dark)', paddingBottom: '5px' }}>
              Galeri Yönetimi
            </h3>
            <div className="win95-inset" style={{ background: '#fff', padding: '5px', maxHeight: '300px', overflowY: 'auto' }}>
              {gallery.length === 0 ? <p style={{color: 'gray'}}>Fotoğraf bulunmuyor.</p> : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {gallery.map(img => (
                    <div key={img.id} style={{ border: '2px inset #dfdfdf', padding: '5px', width: '120px', textAlign: 'center', background: '#e0e0e0' }}>
                      <img src={img.url} style={{ width: '100%', height: '80px', objectFit: 'cover', border: '1px solid #999' }} />
                      <div style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '5px', fontWeight: 'bold' }}>{img.title}</div>
                      <button className="win95-btn" style={{ width: '100%', marginTop: '5px', color: 'red' }} onClick={() => {
                        if (window.confirm("Bu fotoğrafı silmek istediğine emin misin?")) deleteGalleryImage(img.id);
                      }}>Sil</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => {
                if (window.confirm("Tüm Galeri silinecek! Emin misin?")) clearGallery();
              }}
              style={{ marginTop: '15px', padding: '8px 15px', background: 'red', color: 'white', border: '2px outset #ffaaaa', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
            >
              Tüm Galeriyi Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
