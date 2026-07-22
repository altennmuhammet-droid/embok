import { useState, useRef, useEffect } from 'react';

export default function DraggableWindow({ title, icon = '', children, initialPos = { x: 0, y: 0 }, onClose, zIndex, setZIndex, initialWidth = 'max-content', initialHeight = 'auto', resizable = false }) {
  const [pos, setPos] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.win95-title-bar-controls') || e.target.tagName === 'BUTTON') return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    if (setZIndex) setZIndex();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // prevent text selection
    
    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;
    
    const windowWidth = windowRef.current ? windowRef.current.offsetWidth : 250;
    
    // Prevent dragging completely off-screen
    newX = Math.min(window.innerWidth - 50, Math.max(-windowWidth + 50, newX));
    newY = Math.min(window.innerHeight - 60, Math.max(0, newY)); // Keep title bar above taskbar

    setPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, pos]);

  return (
    <div 
      className="win95-window draggable"
      ref={windowRef}
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: zIndex || 10,
        minWidth: '250px',
        width: initialWidth,
        height: initialHeight,
        resize: resizable ? 'both' : 'none',
        overflow: resizable ? 'hidden' : 'visible',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isDragging ? '4px 4px 10px rgba(0,0,0,0.5)' : '2px 2px 5px rgba(0,0,0,0.3)',
      }}
      onMouseDown={() => { if (setZIndex) setZIndex(); }}
    >
      <div 
        className="win95-title-bar" 
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
      >
        <div className="win95-title-bar-text">
          <span>{icon} {title}</span>
        </div>
        {onClose && (
          <div className="win95-title-bar-controls">
            <button className="win95-btn win95-btn-close" onClick={onClose}>X</button>
          </div>
        )}
      </div>
      
      <div className="win95-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: resizable ? 'hidden' : 'visible', padding: '10px' }}>
        {children}
      </div>
    </div>
  );
}
