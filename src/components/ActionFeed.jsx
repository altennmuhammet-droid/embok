import { useStore } from '../store/data';
import './ActionFeed.css';

export default function ActionFeed() {
  const { actions, users } = useStore();
  const approvedActions = actions.filter(a => a.status === 'approved');

  const getUserName = (userId) => {
    return users.find(u => u.id === userId)?.name || userId;
  };

  return (
    <div className="win95-inset" style={{ height: '250px', overflowY: 'auto' }}>
      {approvedActions.length === 0 ? (
        <div style={{ padding: '10px', fontStyle: 'italic', color: 'var(--w95-dark-gray)' }}>
          Sistemde kesinleşmiş karar bulunamadı.
        </div>
      ) : (
        <ul className="win95-list">
          {approvedActions.map((action) => {
            const isPositive = action.points >= 0;
            return (
              <li key={action.id} className="win95-list-item">
                <div className="icon">
                  {isPositive ? 'ℹ️' : '⚠️'}
                </div>
                <div className="details">
                  <strong>{getUserName(action.userId)}</strong>: {action.reason}
                </div>
                <div className={`points ${isPositive ? 'text-green' : 'text-red'}`}>
                  {isPositive ? '+' : ''}{action.points}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
