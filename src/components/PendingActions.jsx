import { useState } from 'react';
import { useStore } from '../store/data';

export default function PendingActions({ currentUser }) {
  const { actions, users, voteAction } = useStore();
  const pendingActions = actions.filter(a => a.status === 'pending');
  // selectedVoter is now always currentUser.id
  const selectedVoter = currentUser?.id;

  const getUserName = (userId) => {
    return users.find(u => u.id === userId)?.name || userId;
  };

  const handleVote = (actionId, vote) => {
    if (!selectedVoter) return;
    voteAction(actionId, selectedVoter, vote);
  };

  return (
    <>
      <div style={{ marginBottom: '10px', background: 'var(--w95-gray)', padding: '5px', border: '1px solid var(--w95-border-dark)', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '32px', height: '32px', background: 'white', border: '1px solid #999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '10px' }}>
          {currentUser?.avatar ? <img src={`/assets/embok/${currentUser.avatar}`} alt={currentUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable="false" /> : null}
        </div>
        <div style={{ fontWeight: 'bold' }}>
          Aktif Oturum: {currentUser?.name}
        </div>
      </div>

      <div className="win95-inset" style={{ height: '250px', overflowY: 'auto', padding: '5px' }}>
        {pendingActions.length === 0 ? (
          <div style={{ fontStyle: 'italic', padding: '10px' }}>Oylanacak tutanak bulunmuyor. Her şey yolunda.</div>
        ) : (
          pendingActions.map(action => {
            const votes = action.votes || {};
            const yesVotes = Object.values(votes).filter(v => v === 'yes').length;
            const noVotes = Object.values(votes).filter(v => v === 'no').length;
            const hasVoted = selectedVoter && votes[selectedVoter];
            const isPositive = action.points >= 0;

            return (
              <div key={action.id} style={{ 
                border: '1px solid var(--w95-border-mid)', 
                marginBottom: '10px', 
                padding: '8px',
                background: 'var(--w95-white)'
              }}>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Sanık/Aday:</strong> {getUserName(action.userId)} <br/>
                  <strong>Suç/Gerekçe:</strong> {action.reason} <br/>
                  <strong>İstenen Ceza/Ödül:</strong> <span className={isPositive ? 'text-green' : 'text-red'}>{isPositive ? '+' : ''}{action.points}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--w95-dark-gray)' }}>
                    Durum: {yesVotes}/4 Evet | {noVotes}/2 Hayır
                  </div>
                  <div>
                    {hasVoted ? (
                      <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Oy kullandınız ({action.votes[selectedVoter] === 'yes' ? 'Kabul' : 'Ret'})</span>
                    ) : (
                      <>
                        <button className="win95-btn" style={{ display: 'inline-block', marginRight: '5px' }} onClick={() => handleVote(action.id, 'yes')}>
                          Kabul (Evet)
                        </button>
                        <button className="win95-btn" style={{ display: 'inline-block' }} onClick={() => handleVote(action.id, 'no')}>
                          Ret (Hayır)
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
