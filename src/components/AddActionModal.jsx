import { useState } from 'react';
import { useStore } from '../store/data';

export default function AddActionModal({ isOpen, onClose }) {
  const { users, addAction } = useStore();
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !points || !reason) {
      alert("Hata: Tüm alanları doldurmanız gerekmektedir.");
      return;
    }
    
    addAction(userId, Number(points), reason);
    
    // Reset form
    setUserId('');
    setPoints('');
    setReason('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="win95-window modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="win95-title-bar">
          <div className="win95-title-bar-text">
            <span>⚠️ Tutanak Formu</span>
          </div>
          <div className="win95-title-bar-controls">
            <button className="win95-btn win95-btn-close" onClick={onClose}>X</button>
          </div>
        </div>

        <div className="win95-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="win95-label">İlgili Vatandaş:</label>
              <select 
                className="win95-input" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
              >
                <option value="" disabled>-- Seçim Yapınız --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="win95-label">Kredi Değişimi (Örn: -50 veya 20):</label>
              <input 
                type="number" 
                className="win95-input" 
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="win95-label">Olay Özeti / İhbar Nedeni:</label>
              <input 
                type="text" 
                className="win95-input" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="divider"></div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="win95-btn">Tamam</button>
              <button type="button" className="win95-btn" onClick={onClose}>İptal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
