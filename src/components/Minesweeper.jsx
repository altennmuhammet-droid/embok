import { useState, useEffect } from 'react';

export default function Minesweeper() {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [minesLeft, setMinesLeft] = useState(10);
  const [difficulty, setDifficulty] = useState({ rows: 8, cols: 8, mines: 10 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customSettings, setCustomSettings] = useState({ rows: 8, cols: 8, mines: 10 });

  useEffect(() => {
    initGame(difficulty.rows, difficulty.cols, difficulty.mines);
  }, [difficulty]);

  const initGame = (rows, cols, mines) => {
    let newGrid = [];
    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
        row.push({ isMine: false, isRevealed: false, neighborMines: 0, isFlagged: false });
      }
      newGrid.push(row);
    }
    
    let minesPlanted = 0;
    while (minesPlanted < mines) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlanted++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMinesLeft(mines);
    setMenuOpen(false);
  };

  const revealCell = (r, c) => {
    if (gameOver || win || !grid[r] || grid[r][c].isRevealed || grid[r][c].isFlagged) return;
    
    let newGrid = JSON.parse(JSON.stringify(grid));
    
    const floodFill = (row, col) => {
      if (row < 0 || row >= difficulty.rows || col < 0 || col >= difficulty.cols || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      newGrid[row][col].isRevealed = true;
      if (newGrid[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            floodFill(row + i, col + j);
          }
        }
      }
    };

    if (newGrid[r][c].isMine) {
      setGameOver(true);
      newGrid = newGrid.map(row => row.map(cell => cell.isMine ? { ...cell, isRevealed: true } : cell));
      setGrid(newGrid);
      window.dispatchEvent(new CustomEvent('win95-alert', { detail: "💥 BUM! Mayına bastın." }));
      return;
    } else {
      floodFill(r, c);
    }

    let unrevealedSafe = 0;
    newGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    
    if (unrevealedSafe === 0) {
      setWin(true);
      window.dispatchEvent(new CustomEvent('win95-alert', { detail: "🏆 Mayın Tarlasını bitirdin!" }));
    }
    
    setGrid(newGrid);
  };

  const toggleFlag = (e, r, c) => {
    if (e) e.preventDefault();
    if (gameOver || win || !grid[r] || grid[r][c].isRevealed) return;
    let newGrid = JSON.parse(JSON.stringify(grid));
    const newFlagState = !newGrid[r][c].isFlagged;
    newGrid[r][c].isFlagged = newFlagState;
    setMinesLeft(prev => newFlagState ? prev - 1 : prev + 1);
    setGrid(newGrid);
  };

  if (!grid.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#c0c0c0' }}>
      {/* Menu Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #808080', padding: '2px 5px', gap: '10px', fontSize: '12px', position: 'relative' }}>
        <div style={{ cursor: 'pointer' }} onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{ textDecoration: 'underline' }}>O</span>yun
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => window.dispatchEvent(new CustomEvent('win95-alert', { detail: 'Windows 95 Mayın Tarlası - EMBOK Sürümü | Çift tıklayarak bayrak dikebilirsin!' }))}>
          <span style={{ textDecoration: 'underline' }}>Y</span>ardım
        </div>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: '0', background: '#c0c0c0', 
            border: '2px solid', borderColor: '#fff #808080 #808080 #fff', zIndex: 1000,
            display: 'flex', flexDirection: 'column', minWidth: '150px', boxShadow: '2px 2px 5px rgba(0,0,0,0.5)'
          }}>
            <div className="xp-start-item" style={{ padding: '5px 10px', color: 'black' }} onClick={() => initGame(difficulty.rows, difficulty.cols, difficulty.mines)}>
              Yeni Oyun <span style={{ float: 'right' }}>F2</span>
            </div>
            <div style={{ borderBottom: '1px solid #808080', margin: '2px 0' }}></div>
            <div className="xp-start-item" style={{ padding: '5px 10px', color: 'black' }} onClick={() => setDifficulty({ rows: 8, cols: 8, mines: 10 })}>
              {difficulty.mines === 10 ? '✓ ' : ''}Başlangıç (10)
            </div>
            <div className="xp-start-item" style={{ padding: '5px 10px', color: 'black' }} onClick={() => setDifficulty({ rows: 16, cols: 16, mines: 40 })}>
              {difficulty.mines === 40 && difficulty.rows === 16 ? '✓ ' : ''}Orta (40)
            </div>
            <div className="xp-start-item" style={{ padding: '5px 10px', color: 'black' }} onClick={() => setDifficulty({ rows: 16, cols: 30, mines: 99 })}>
              {difficulty.mines === 99 ? '✓ ' : ''}Uzman (99)
            </div>
            <div className="xp-start-item" style={{ padding: '5px 10px', color: 'black' }} onClick={() => { setCustomModalOpen(true); setMenuOpen(false); }}>
              Özel...
            </div>
          </div>
        )}
      </div>

      {customModalOpen && (
        <div style={{ position: 'absolute', top: '50px', left: '50px', background: '#c0c0c0', border: '2px solid', borderColor: '#fff #808080 #808080 #fff', zIndex: 2000, padding: '10px', boxShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '10px' }}>
            <label>Yükseklik:</label>
            <input type="number" min="5" max="30" value={customSettings.rows} onChange={(e) => setCustomSettings({...customSettings, rows: parseInt(e.target.value) || 8})} className="win95-input" style={{ width: '60px' }} />
            <label>Genişlik:</label>
            <input type="number" min="5" max="40" value={customSettings.cols} onChange={(e) => setCustomSettings({...customSettings, cols: parseInt(e.target.value) || 8})} className="win95-input" style={{ width: '60px' }} />
            <label>Mayınlar:</label>
            <input type="number" min="1" max="999" value={customSettings.mines} onChange={(e) => setCustomSettings({...customSettings, mines: parseInt(e.target.value) || 10})} className="win95-input" style={{ width: '60px' }} />
          </div>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between' }}>
            <button className="win95-btn" onClick={() => { setDifficulty(customSettings); setCustomModalOpen(false); }}>Tamam</button>
            <button className="win95-btn" onClick={() => setCustomModalOpen(false)}>İptal</button>
          </div>
        </div>
      )}

      <div style={{ padding: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header Display */}
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', width: '100%', border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080', padding: '5px' }}>
          <div className="win95-inset" style={{ padding: '2px 5px', color: 'red', fontWeight: 'bold', background: 'black', fontFamily: 'monospace', fontSize: '20px' }}>
            {minesLeft.toString().padStart(3, '0')}
          </div>
          <button className="win95-btn" onClick={() => initGame(difficulty.rows, difficulty.cols, difficulty.mines)} style={{ fontSize: '20px', width: '32px', height: '32px', padding: 0 }}>
            {gameOver ? '😵' : win ? '😎' : '🙂'}
          </button>
          <div className="win95-inset" style={{ padding: '2px 5px', color: 'red', fontWeight: 'bold', background: 'black', fontFamily: 'monospace', fontSize: '20px' }}>
            000
          </div>
        </div>

        {/* Grid Container */}
        <div style={{ display: 'flex', flexDirection: 'column', border: '3px solid', borderColor: '#808080 #ffffff #ffffff #808080', background: '#c0c0c0' }}>
          {grid.map((row, r) => (
            <div key={`row-${r}`} style={{ display: 'flex' }}>
              {row.map((cell, c) => (
                <button 
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onDoubleClick={() => toggleFlag(null, r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  style={{
                    width: '24px', height: '24px',
                    border: cell.isRevealed ? '1px solid #808080' : '2px solid',
                    borderColor: cell.isRevealed ? '#808080' : '#ffffff #808080 #808080 #ffffff',
                    background: cell.isRevealed ? (cell.isMine ? 'red' : '#c0c0c0') : '#c0c0c0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 'bold', cursor: 'default', padding: 0,
                    color: cell.neighborMines === 1 ? 'blue' : cell.neighborMines === 2 ? '#008000' : cell.neighborMines === 3 ? 'red' : cell.neighborMines === 4 ? 'navy' : cell.neighborMines === 5 ? 'maroon' : 'black'
                  }}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? '💣' : (cell.neighborMines > 0 ? cell.neighborMines : '')
                  ) : (cell.isFlagged ? '🚩' : '')}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
