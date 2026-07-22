import { useRef, useState, useEffect } from 'react';
import { useStore } from '../store/data';

export default function Paint() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const { paintCanvas, savePaint } = useStore();
  const [tool, setTool] = useState('pencil'); // pencil, eraser, rect, circle, line, triangle
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (paintCanvas) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = paintCanvas;
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [paintCanvas]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else {
      // Shapes
      if (!snapshot) return;
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();

      if (tool === 'rect') {
        const width = offsetX - startPos.x;
        const height = offsetY - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      } else if (tool === 'triangle') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.lineTo(startPos.x - (offsetX - startPos.x), offsetY);
        ctx.closePath();
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      if (tool === 'pencil' || tool === 'eraser') {
        ctx.closePath();
      }
      setIsDrawing(false);
      setSnapshot(null);
      // Save drawing to Firebase
      savePaint(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    savePaint(canvas.toDataURL());
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '60px' }}>
        <button className="win95-btn" title="Kalem" style={{ background: tool === 'pencil' ? '#d0d0d0' : '' }} onClick={() => setTool('pencil')}>✏️</button>
        <button className="win95-btn" title="Silgi" style={{ background: tool === 'eraser' ? '#d0d0d0' : '' }} onClick={() => setTool('eraser')}>🧽</button>
        <button className="win95-btn" title="Çizgi" style={{ background: tool === 'line' ? '#d0d0d0' : '' }} onClick={() => setTool('line')}>➖</button>
        <button className="win95-btn" title="Kare" style={{ background: tool === 'rect' ? '#d0d0d0' : '' }} onClick={() => setTool('rect')}>⬜</button>
        <button className="win95-btn" title="Daire" style={{ background: tool === 'circle' ? '#d0d0d0' : '' }} onClick={() => setTool('circle')}>⭕</button>
        <button className="win95-btn" title="Üçgen" style={{ background: tool === 'triangle' ? '#d0d0d0' : '' }} onClick={() => setTool('triangle')}>🔺</button>
        
        <div style={{ marginTop: '5px', fontSize: '10px', textAlign: 'center' }}>
          Boyut: {brushSize}px
          <input 
            type="range" 
            min="1" max="20" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ border: '2px inset #fff', background: '#fff', width: '100%', height: '40px', marginTop: '5px' }}>
          <div style={{ width: '100%', height: '100%', background: color }}></div>
        </div>

        <button className="win95-btn" onClick={clearCanvas} style={{ fontSize: '10px' }}>Temizle</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div className="win95-inset" style={{ padding: 0 }}>
          <canvas
            ref={canvasRef}
            width={500}
            height={350}
            style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', display: 'block' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', width: '500px' }}>
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', flexGrow: 1 }}>
            {colors.map(c => (
              <button 
                key={c}
                className="win95-btn"
                title={c}
                style={{ 
                  width: '23px', height: '23px', background: c, padding: 0, 
                  border: color === c ? '2px inset #000' : '2px outset #fff' 
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px' }}>Özel:</span>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '30px', height: '25px', padding: 0, border: '1px solid #808080', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
