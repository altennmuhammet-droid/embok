import { useState, useEffect } from 'react';
import DraggableWindow from './DraggableWindow';

export default function AlertModal() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handleAlert = (e) => {
      setAlerts(prev => [...prev, e.detail]);
    };
    window.addEventListener('win95-alert', handleAlert);
    return () => window.removeEventListener('win95-alert', handleAlert);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 100000, pointerEvents: 'none' }}>
      {alerts.map((msg, idx) => (
        <div key={idx} style={{ pointerEvents: 'auto', position: 'absolute', top: `${40 + idx*10}%`, left: `${40 + idx*10}%` }}>
          <DraggableWindow 
            title="Sistem Mesajı" 
            icon="⚠️" 
            onClose={() => setAlerts(prev => prev.filter((_, i) => i !== idx))}
            zIndex={100001 + idx}
          >
            <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '300px' }}>
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{msg}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              <button className="win95-btn" onClick={() => setAlerts(prev => prev.filter((_, i) => i !== idx))} style={{ minWidth: '80px' }}>
                Tamam
              </button>
            </div>
          </DraggableWindow>
        </div>
      ))}
    </div>
  );
}
