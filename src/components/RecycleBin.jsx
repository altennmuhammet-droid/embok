import { useStore } from '../store/data';

export default function RecycleBin() {
  const { actions, users } = useStore();
  const rejectedActions = actions.filter(a => a.status === 'rejected');

  const getUserName = (userId) => {
    return users.find(u => u.id === userId)?.name || userId;
  };

  return (
    <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ padding: '10px', background: 'var(--w95-white)', borderBottom: '1px solid var(--w95-border-mid)' }}>
        <h3 style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src="https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png" width="24" alt="Bin" />
          Reddedilmiş Şikayetlerin Çöplüğü
        </h3>
      </div>
      <div className="win95-inset" style={{ height: '250px', overflowY: 'auto', background: 'var(--w95-white)' }}>
        {rejectedActions.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--w95-dark-gray)' }}>
            Geri dönüşüm kutusu boş. Herkesin tutanağı onaylanmış!
          </div>
        ) : (
          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--w95-gray)', borderBottom: '1px solid var(--w95-border-mid)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '5px' }}>Sanık</th>
                <th style={{ textAlign: 'left', padding: '5px' }}>Neden</th>
              </tr>
            </thead>
            <tbody>
              {rejectedActions.map(action => (
                <tr key={action.id} style={{ borderBottom: '1px dashed var(--w95-gray)' }}>
                  <td style={{ padding: '5px', color: 'var(--w95-dark-gray)', fontStyle: 'italic' }}>
                    <strike>{getUserName(action.userId)}</strike>
                  </td>
                  <td style={{ padding: '5px', color: 'var(--w95-dark-gray)' }}>
                    <strike>{action.reason}</strike>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
