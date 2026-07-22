import { useState } from 'react';
import { useStore } from '../store/data';

export default function RulesTable() {
  const { rules, users, addRule, deleteRule } = useStore();
  const [type, setType] = useState('below');
  const [threshold, setThreshold] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!threshold || !description) return;
    addRule(type, threshold, description);
    setThreshold('');
    setDescription('');
  };

  const getViolators = (rule) => {
    if (rule.type === 'below') {
      return users.filter(u => u.score < rule.threshold);
    } else {
      return users.filter(u => u.score > rule.threshold);
    }
  };

  return (
    <>
      <div className="win95-inset" style={{ height: '200px', overflowY: 'auto', marginBottom: '10px', padding: '0' }}>
        <table className="win95-table">
          <thead>
            <tr>
              <th width="30%">Kural (Eşik)</th>
              <th width="40%">Yaptırım / Ödül</th>
              <th width="20%">Durum</th>
              <th width="10%">Sil</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr><td colSpan="4" align="center">Hiçbir kanun tanımlanmadı.</td></tr>
            ) : (
              rules.map(rule => {
                const violators = getViolators(rule);
                const isActive = violators.length > 0;
                
                return (
                  <tr key={rule.id}>
                    <td>{rule.threshold} Kredi {rule.type === 'below' ? 'Altı' : 'Üstü'}</td>
                    <td>{rule.description}</td>
                    <td>
                      {isActive ? (
                        <marquee scrollamount="3" style={{ color: 'red', fontWeight: 'bold', width: '100px' }}>
                          {violators.map(v => v.name).join(', ')} !
                        </marquee>
                      ) : (
                        <span style={{ color: 'gray' }}>Sakin</span>
                      )}
                    </td>
                    <td align="center">
                      <button className="win95-btn" style={{ padding: '0 5px' }} onClick={() => deleteRule(rule.id)}>X</button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <fieldset style={{ padding: '10px', border: '2px groove var(--w95-white)', margin: 0 }}>
        <legend style={{ padding: '0 5px' }}>Yeni Kanun Çıkar</legend>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
          <div>
            <label className="win95-label">Tip</label>
            <select className="win95-input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="below">Altında</option>
              <option value="above">Üstünde</option>
            </select>
          </div>
          <div>
            <label className="win95-label">Puan Eşiği</label>
            <input type="number" className="win95-input" style={{ width: '80px' }} value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <label className="win95-label">Ceza/Ödül Nedir?</label>
            <input type="text" className="win95-input" placeholder="Örn: Kahve ısmarlar" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit" className="win95-btn">Ekle</button>
        </form>
      </fieldset>
    </>
  );
}
