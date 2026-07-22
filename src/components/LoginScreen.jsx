import { useState } from 'react';
import { useStore } from '../store/data';

export default function LoginScreen({ onLogin }) {
  const { users } = useStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUserClick = (u) => {
    if (selectedUser?.id === u.id) return; // Prevent resetting when interacting with the form
    setSelectedUser(u);
    setPassword('');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const PASSWORDS = {
      'erman': 'ermeni31',
      'altan': 'sapık.kodlamacı',
      'bugra': 'kanosiken',
      'ozan': 'baskınozan',
      'koray': 'maaşalamayan'
    };
    
    const typed = password.trim();
    const expected = PASSWORDS[selectedUser.id];
    
    // Fallback just in case encoding differences or trailing spaces exist
    if (expected === typed || expected.normalize() === typed.normalize() || expected.toLowerCase() === typed.toLowerCase()) {
      onLogin(selectedUser);
    } else {
      setError(`Hatalı şifre girdiniz. Lütfen tekrar deneyin.`);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(to bottom, #5a7edc 0%, #95b3eb 50%, #5a7edc 100%)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 99990,
      fontFamily: 'Tahoma, "Trebuchet MS", sans-serif',
      userSelect: 'none'
    }}>
      {/* Top Bar */}
      <div style={{
        height: '80px',
        background: '#003399',
        borderBottom: '2px solid transparent',
        borderImage: 'linear-gradient(to right, #e34f0f, #e3b60f, #e34f0f) 1',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px'
      }}>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Vertical Separator Line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          bottom: '10%',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4) 50%, transparent)'
        }} />

        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '900px',
          alignItems: 'center'
        }}>
          {/* Left Side: Windows Logo & Welcome */}
          <div style={{ flex: 1, paddingRight: '60px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ marginRight: '15px' }}>
                <span style={{ color: 'white', fontSize: '24px', fontStyle: 'italic', fontWeight: 'bold', display: 'block', marginBottom: '-5px', textAlign: 'left' }}>Microsoft</span>
                <span style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>Windows</span><span style={{ color: '#e34f0f', fontSize: '36px', verticalAlign: 'top', marginLeft: '5px' }}>XP</span>
              </div>
            </div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'normal', margin: 0, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Başlamak için isminize tıklayın
            </h2>
          </div>

          {/* Right Side: User List */}
          <div style={{ flex: 1, paddingLeft: '60px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {users.map(u => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <div 
                  key={u.id} 
                  onClick={() => handleUserClick(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '8px',
                    backgroundColor: isSelected ? '#316ac5' : 'transparent',
                    border: isSelected ? '1px solid white' : '1px solid transparent',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: 'fit-content',
                    minWidth: '250px',
                    transition: 'background 0.1s'
                  }}
                >
                  <div style={{
                    width: '60px', height: '60px',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: '15px',
                    border: '2px solid #fff',
                    boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                  }}>
                    <img src={`/assets/embok/${u.avatar}`} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable="false" />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isSelected ? 'flex-start' : 'center', height: '60px' }}>
                    <div style={{ color: 'white', fontSize: '22px', textShadow: isSelected ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)' }}>
                      {u.name}
                    </div>
                    
                    {isSelected && (
                      <div style={{ marginTop: '5px' }}>
                        <div style={{ color: '#fff', fontSize: '11px', marginBottom: '2px' }}>Şifrenizi yazın</div>
                        <form onSubmit={handleLogin} style={{ display: 'flex', alignItems: 'center' }}>
                          <input 
                            type="password" 
                            autoFocus
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                              padding: '2px 5px',
                              border: '1px solid #7f9db9',
                              borderRadius: '3px',
                              width: '120px',
                              marginRight: '5px',
                              outline: 'none',
                              fontSize: '14px'
                            }}
                          />
                          <button type="submit" style={{
                            background: 'linear-gradient(to bottom, #7db343, #578c20)',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '3px',
                            width: '24px',
                            height: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                          }}>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>➔</span>
                          </button>
                        </form>
                        {error && (
                          <div style={{ color: '#ffaaaa', fontSize: '11px', marginTop: '2px', textShadow: '1px 1px 1px rgba(0,0,0,0.8)' }}>
                            {error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        height: '80px',
        background: '#003399',
        borderTop: '2px solid transparent',
        borderImage: 'linear-gradient(to right, #e34f0f, #e3b60f, #e34f0f) 1',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ 
            background: 'linear-gradient(to bottom, #e55b45, #b83321)', 
            width: '36px', height: '36px', 
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: '10px', border: '2px solid white',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.5)'
          }}>
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>⏻</span>
          </div>
          <span style={{ color: 'white', fontSize: '18px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Bilgisayarı Kapat</span>
        </div>
        
        <div style={{ marginLeft: 'auto', textAlign: 'right', color: 'white', fontSize: '13px', opacity: 0.8 }}>
          Oturum açtıktan sonra, kendi puanlarınızı kontrol edebilir veya oy kullanabilirsiniz.<br/>
          Gizlilik ve yetkilendirme işlemleri için ADMIN.EXE'yi kullanın.
        </div>
      </div>
    </div>
  );
}
