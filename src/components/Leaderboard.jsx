import { Trophy } from 'lucide-react';
import { useStore } from '../store/data';
import './Leaderboard.css';

export default function Leaderboard() {
  const { getLeaderboard } = useStore();
  const sortedUsers = getLeaderboard();

  return (
    <div className="win95-inset" style={{ height: '300px', overflowY: 'auto', padding: '0' }}>
      <table className="win95-table">
        <thead>
          <tr>
            <th width="10%">Sıra</th>
            <th width="45%">Vatandaş</th>
            <th width="20%">Değişim</th>
            <th width="25%">Kredi</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => {
            const isTop = index === 0;
            const isBottom = index === sortedUsers.length - 1;
            const trend = user.score > 1000 ? 'up' : user.score < 1000 ? 'down' : 'neutral';
            
            return (
              <tr key={user.id} className={isTop ? 'highlight-green' : isBottom ? 'highlight-red' : ''}>
                <td align="center"><strong>{index + 1}</strong></td>
                <td>
                  <img src={`/assets/embok/${user.avatar}`} alt={user.name} style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '3px', marginRight: '5px' }} draggable="false" />
                  {user.name}
                </td>
                <td align="center">
                  {trend === 'up' && <span className="text-green">+{user.score - 1000}</span>}
                  {trend === 'down' && <span className="text-red">{user.score - 1000}</span>}
                  {trend === 'neutral' && <span>0</span>}
                </td>
                <td align="right">
                  <strong>{user.score}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
