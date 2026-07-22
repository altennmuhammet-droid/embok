import { useEffect, useState } from 'react';

export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState(1);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Phase 1: BIOS Text
    const t1 = setTimeout(() => {
      setPhase(2); // Logo & Quote
    }, 4500); // 4.5 seconds of BIOS boot

    // Hold logo
    const t2 = setTimeout(() => {
      setOpacity(0);
    }, 9000); // fade out at 9 seconds

    const t3 = setTimeout(() => {
      onComplete();
    }, 10000); // finish at 10 seconds

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: phase === 1 ? 'flex-start' : 'center',
      justifyContent: phase === 1 ? 'flex-start' : 'center',
      zIndex: 99999,
      transition: 'opacity 1s ease',
      opacity: opacity,
      color: 'white',
      padding: phase === 1 ? '40px' : '0'
    }}>
      {phase === 1 && (
        <div style={{ fontFamily: 'Courier New, monospace', color: '#0f0', fontSize: '18px', lineHeight: '1.8', textShadow: '0 0 5px #0f0' }}>
          <div className="type-line" style={{ animationDelay: '0.1s' }}>EMBOK OS BIOS Version 6.9 - Build 2026</div>
          <div className="type-line" style={{ animationDelay: '0.6s' }}>Checking Memory... 4096MB OK</div>
          <div className="type-line" style={{ animationDelay: '1.0s' }}>Loading 5-Bro Protocol...</div>
          <br/>
          <div className="type-line" style={{ animationDelay: '1.5s' }}>Initializing Core [ERMAN]... <span style={{color:'white'}}>[OK]</span></div>
          <div className="type-line" style={{ animationDelay: '1.8s' }}>Initializing Core [ALTAN]... <span style={{color:'white'}}>[OK]</span></div>
          <div className="type-line" style={{ animationDelay: '2.1s' }}>Initializing Core [BUĞRA]... <span style={{color:'white'}}>[OK]</span></div>
          <div className="type-line" style={{ animationDelay: '2.4s' }}>Initializing Core [OZAN]... <span style={{color:'white'}}>[OK]</span></div>
          <div className="type-line" style={{ animationDelay: '2.7s' }}>Initializing Core [KORAY]... <span style={{color:'white'}}>[OK]</span></div>
          <br/>
          <div className="type-line" style={{ animationDelay: '3.4s', color: 'yellow' }}>Warning: High Makara Level Detected in System Environment...</div>
          <div className="type-line" style={{ animationDelay: '3.9s' }}>Mounting C:/EMBOK/Tutanaklar... <span style={{color:'white'}}>[SUCCESS]</span></div>
          <div className="type-line" style={{ animationDelay: '4.2s' }}>Starting User Interface...</div>
          <div className="type-line blink-cursor" style={{ animationDelay: '4.4s' }}>_</div>
        </div>
      )}

      {phase === 2 && (
        <div className="fade-in-scale" style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '110px', 
            fontFamily: 'Impact, sans-serif', 
            letterSpacing: '5px',
            margin: 0,
            textShadow: '0 0 20px rgba(0, 85, 229, 0.8)'
          }}>
            <span style={{ color: '#0f86e3' }}>E</span>
            <span style={{ color: '#e34f0f' }}>M</span>
            <span style={{ color: '#0f86e3' }}>B</span>
            <span style={{ color: '#e3b60f' }}>O</span>
            <span style={{ color: '#0f86e3' }}>K</span>
          </h1>
          
          <div style={{
            marginTop: '30px',
            width: '350px',
            height: '14px',
            border: '2px solid #555',
            borderRadius: '7px',
            overflow: 'hidden',
            position: 'relative',
            margin: '30px auto'
          }}>
            <div style={{
              position: 'absolute',
              top: 0, bottom: 0,
              width: '50px',
              background: 'linear-gradient(90deg, transparent, #0f86e3, transparent)',
              animation: 'loadBar 1s infinite linear'
            }} />
          </div>

          <h2 className="glitch-text" style={{
            fontFamily: 'Courier New, monospace',
            color: '#ff3333',
            fontSize: '32px',
            marginTop: '60px',
            textShadow: '2px 2px 0px #000, -1px -1px 0px #fff',
            letterSpacing: '1px',
            fontWeight: 'bold'
          }}>
            "Makarayız di mi abi? Piçiz biz piç"
          </h2>
        </div>
      )}

      <style>
        {`
          .type-line {
            opacity: 0;
            animation: appear 0.1s forwards;
          }
          .blink-cursor {
            animation: appear 0.1s forwards, blink 0.5s infinite alternate;
          }
          .fade-in-scale {
            animation: fadeInScale 1.5s ease-out forwards;
          }
          .glitch-text {
            animation: glitch 3s infinite;
          }
          
          @keyframes appear {
            to { opacity: 1; }
          }
          @keyframes blink {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes loadBar {
            0% { left: -50px; }
            100% { left: 350px; }
          }
          @keyframes glitch {
            0% { transform: translate(0) }
            2% { transform: translate(-2px, 2px) }
            4% { transform: translate(-2px, -2px) }
            6% { transform: translate(2px, 2px) }
            8% { transform: translate(2px, -2px) }
            10% { transform: translate(0) }
            100% { transform: translate(0) }
          }
        `}
      </style>
    </div>
  );
}
