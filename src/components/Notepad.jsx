import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/data';

export default function Notepad({ currentUser }) {
  const { notepad, addNotepadEntry } = useStore();
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notepad]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addNotepadEntry(text.trim(), currentUser.name);
    setText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px', background: '#fff', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, border: '2px inset #dfdfdf', background: '#fff', padding: '5px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '14px', marginBottom: '10px' }}>
        {notepad.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic' }}>Henüz not eklenmedi...</div>
        ) : (
          notepad.map(n => (
            <div key={n.id} style={{ marginBottom: '8px', borderBottom: '1px dashed #eee', paddingBottom: '4px', wordBreak: 'break-word' }}>
              {n.text}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '5px' }}>
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          style={{ flex: 1, padding: '5px', border: '2px inset #dfdfdf' }}
          placeholder="Buraya yazın..."
        />
        <button type="submit" className="win95-btn" style={{ padding: '0 15px' }}>Ekle</button>
      </form>
    </div>
  );
}
