import { useStore } from '../store/data';

export default function Statistics() {
  const { actions, users } = useStore();
  const approvedActions = actions.filter(a => a.status === 'approved');

  const getFlaker = () => {
    if (approvedActions.filter(a => a.points < 0).length === 0) return null;
    const flakers = {};
    approvedActions.filter(a => a.points < 0).forEach(a => {
      flakers[a.userId] = (flakers[a.userId] || 0) + 1;
    });
    const flakerId = Object.keys(flakers).sort((a, b) => flakers[b] - flakers[a])[0];
    return users.find(u => u.id === flakerId);
  };

  const getGenerous = () => {
    if (approvedActions.filter(a => a.points > 0).length === 0) return null;
    const generous = {};
    approvedActions.filter(a => a.points > 0).forEach(a => {
      generous[a.userId] = (generous[a.userId] || 0) + 1;
    });
    const genId = Object.keys(generous).sort((a, b) => generous[b] - generous[a])[0];
    return users.find(u => u.id === genId);
  };

  const flaker = getFlaker();
  const generous = getGenerous();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="win95-inset" style={{ padding: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Kırmızı Bülten (En Çok Eksi Onaylanan)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🚨</span>
          <span className="text-red" style={{ fontSize: '16px' }}>{flaker ? flaker.name : 'Veri Yok'}</span>
        </div>
      </div>

      <div className="win95-inset" style={{ padding: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Örnek Vatandaş (En Çok Artı Onaylanan)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⭐</span>
          <span className="text-green" style={{ fontSize: '16px' }}>{generous ? generous.name : 'Veri Yok'}</span>
        </div>
      </div>

      <div className="win95-inset" style={{ padding: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Kesinleşmiş Toplam Karar Sayısı</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>💾</span>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{approvedActions.length}</span>
        </div>
      </div>
    </div>
  );
}
