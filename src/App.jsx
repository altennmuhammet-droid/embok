import { useState, useEffect } from 'react';
import Leaderboard from './components/Leaderboard';
import ActionFeed from './components/ActionFeed';
import AddActionModal from './components/AddActionModal';
import Statistics from './components/Statistics';
import PendingActions from './components/PendingActions';
import RulesTable from './components/RulesTable';
import Taskbar from './components/Taskbar';
import Minesweeper from './components/Minesweeper';
import Paint from './components/Paint';
import RecycleBin from './components/RecycleBin';
import MediaPlayer from './components/MediaPlayer';
import AlertModal from './components/AlertModal';
import DraggableWindow from './components/DraggableWindow';
import DesktopProperties from './components/DesktopProperties';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import WidgetGallery from './components/WidgetGallery';
import ImageViewerModal from './components/ImageViewerModal';
import GalleryFolder from './components/GalleryFolder';
import Notepad from './components/Notepad';
import { useStore } from './store/data';

function App() {
  const { wallpaper, isLoaded, users } = useStore();
  const [booting, setBooting] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openWindows, setOpenWindows] = useState({
    leaderboard: true,
    rules: true,
    stats: true,
    pending: true,
    feed: true,
    minesweeper: false,
    paint: false,
    recycle: false,
    mediaPlayer: false,
    myComputer: false,
    desktopProperties: false,
    admin: false,
    notepad: false,
    galleryFolder: false
  });
  const [zIndexCounter, setZIndexCounter] = useState(20);
  const [zIndices, setZIndices] = useState({
    leaderboard: 1, rules: 2, stats: 3, pending: 4, feed: 5, minesweeper: 6, paint: 7, recycle: 8, myComputer: 9, mediaPlayer: 10, desktopProperties: 11, admin: 12, notepad: 13, galleryFolder: 14
  });

  const bringToFront = (id) => {
    setZIndexCounter(prev => prev + 1);
    setZIndices(prev => ({ ...prev, [id]: zIndexCounter }));
  };

  const toggleWindow = (id, forceState = null) => {
    setOpenWindows(prev => ({
      ...prev,
      [id]: forceState !== null ? forceState : !prev[id]
    }));
    if (forceState !== false) bringToFront(id);
  };

  useEffect(() => {
    if (wallpaper === 'none') {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = '#0055e5';
    } else {
      document.body.style.backgroundImage = `url('/assets/${wallpaper}')`;
    }
  }, [wallpaper]);

  const getCenterOffset = (offsetX, offsetY) => {
    const cx = Math.max(0, window.innerWidth / 2);
    const cy = Math.max(0, window.innerHeight / 2);
    return { x: Math.max(0, cx + offsetX), y: Math.max(0, cy + offsetY) };
  };

  if (booting) {
    return <BootScreen onComplete={() => setBooting(false)} />;
  }

  if (!currentUser) {
    return <LoginScreen onLogin={user => setCurrentUser(user)} />;
  }

  if (!isLoaded) {
    return <div style={{ background: '#0055e5', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Trebuchet MS' }}>Veritabanı Bekleniyor...</div>;
  }

  return (
    <>
      <div className="desktop-container" style={{ overflow: 'hidden' }} onContextMenu={(e) => { 
        if (e.target.classList.contains('desktop-container') || e.target.classList.contains('desktop-icons')) {
          e.preventDefault(); 
          toggleWindow('desktopProperties', true); 
        }
      }}>
        
        <div className="desktop-icons">
          <div className="desktop-icon" onClick={() => toggleWindow('myComputer', true)}>
            <img src="/assets/xp_computer.ico" alt="Bilgisayarım" />
            <span>Bilgisayarım</span>
          </div>
          
          <div className="desktop-icon" onClick={() => toggleWindow('recycle', true)}>
            <img src="/assets/xp_trash.ico" alt="Geri Dönüşüm Kutusu" />
            <span>Geri Dönüşüm<br/>Kutusu</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('minesweeper', true)}>
            <img src="/assets/xp_mines.ico" alt="Mayın Tarlası" />
            <span>Mayın Tarlası</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('paint', true)}>
            <img src="/assets/xp_paint.ico" alt="Paint" />
            <span>Paint</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('mediaPlayer', true)}>
            <img src="/assets/xp_media.ico" alt="Müzik Çalar" />
            <span>Radyo</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('desktopProperties', true)}>
            <img src="/assets/xp_properties.ico" alt="Özelleştir" />
            <span>Özelleştir</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('galleryFolder', true)}>
            <div style={{ fontSize: '32px', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>📁</div>
            <span>Galeri</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('notepad', true)}>
            <div style={{ fontSize: '32px', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>📝</div>
            <span>Not Defteri</span>
          </div>

          <div className="desktop-icon" onClick={() => toggleWindow('admin', true)}>
            <div style={{ fontSize: '32px', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>⚙️</div>
            <span style={{ color: '#ffaaaa' }}>ADMIN.EXE</span>
          </div>
        </div>

        {openWindows.leaderboard && (
          <DraggableWindow title="Vatandaşlık Sicili" icon="🏆" initialPos={getCenterOffset(-600, -350)} onClose={() => toggleWindow('leaderboard', false)} zIndex={zIndices.leaderboard} setZIndex={() => bringToFront('leaderboard')} resizable={true}>
            <Leaderboard />
          </DraggableWindow>
        )}

        {openWindows.rules && (
          <DraggableWindow title="Kanun Hükmünde Kararnameler (KHK.EXE)" icon="📜" initialPos={getCenterOffset(-500, 50)} onClose={() => toggleWindow('rules', false)} zIndex={zIndices.rules} setZIndex={() => bringToFront('rules')} resizable={true}>
            <RulesTable />
          </DraggableWindow>
        )}

        {openWindows.stats && (
          <DraggableWindow title="Sistem Analizi (SYSMON.EXE)" icon="📊" initialPos={getCenterOffset(200, 100)} onClose={() => toggleWindow('stats', false)} zIndex={zIndices.stats} setZIndex={() => bringToFront('stats')} resizable={true}>
            <Statistics />
          </DraggableWindow>
        )}

        {openWindows.pending && (
          <DraggableWindow title="Yüce Divan (Bekleyen Kararlar)" icon="⚖️" initialPos={getCenterOffset(-200, -150)} onClose={() => toggleWindow('pending', false)} zIndex={zIndices.pending} setZIndex={() => bringToFront('pending')} resizable={true}>
            <PendingActions currentUser={currentUser} />
          </DraggableWindow>
        )}

        {openWindows.feed && (
          <DraggableWindow title="Kesinleşen Hükümler (EVENTVWR.EXE)" icon="📝" initialPos={getCenterOffset(300, -300)} onClose={() => toggleWindow('feed', false)} zIndex={zIndices.feed} setZIndex={() => bringToFront('feed')} resizable={true}>
            <ActionFeed />
          </DraggableWindow>
        )}

        {openWindows.minesweeper && (
          <DraggableWindow title="Mayın Tarlası" icon="💣" initialPos={{x: 350, y: 150}} onClose={() => toggleWindow('minesweeper', false)} zIndex={zIndices.minesweeper} setZIndex={() => bringToFront('minesweeper')} resizable={true}>
            <Minesweeper />
          </DraggableWindow>
        )}

        {openWindows.myComputer && (
          <DraggableWindow title="Bilgisayarım" icon="💻" initialPos={{x: 300, y: 200}} onClose={() => toggleWindow('myComputer', false)} zIndex={zIndices.myComputer} setZIndex={() => bringToFront('myComputer')} resizable={true}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <img src="https://win98icons.alexmeub.com/icons/png/hard_disk_drive-5.png" alt="C Drive" style={{width: '32px'}}/><br/>
              <strong>Yerel Disk (C:)</strong><br/>
              <span style={{color: 'gray'}}>Ağzına kadar EMBOK tutanaklarıyla dolu.</span>
            </div>
          </DraggableWindow>
        )}

        {openWindows.recycle && (
          <DraggableWindow title="Geri Dönüşüm Kutusu" icon="🗑️" initialPos={{x: 400, y: 250}} onClose={() => toggleWindow('recycle', false)} zIndex={zIndices.recycle} setZIndex={() => bringToFront('recycle')} resizable={true}>
            <RecycleBin />
          </DraggableWindow>
        )}

        {openWindows.paint && (
          <DraggableWindow title="Adsız - Paint" icon={<img src="/assets/xp_paint.png" alt="paint" style={{width:'16px', verticalAlign:'middle'}}/>} initialPos={getCenterOffset(-350, -200)} onClose={() => toggleWindow('paint', false)} zIndex={zIndices.paint} setZIndex={() => bringToFront('paint')} resizable={true}>
            <Paint />
          </DraggableWindow>
        )}

        {openWindows.mediaPlayer && (
          <DraggableWindow title="Radyo (Winamp_Eski.exe)" icon="🎵" initialPos={{x: 50, y: 500}} onClose={() => toggleWindow('mediaPlayer', false)} zIndex={zIndices.mediaPlayer} setZIndex={() => bringToFront('mediaPlayer')} initialWidth="300px" initialHeight="400px" resizable={true}>
            <MediaPlayer />
          </DraggableWindow>
        )}

        {openWindows.admin && (
          <DraggableWindow title="Admin Kontrol Paneli" icon="⚙️" initialPos={getCenterOffset(-150, -100)} onClose={() => toggleWindow('admin', false)} zIndex={zIndices.admin} setZIndex={() => bringToFront('admin')} resizable={true}>
            <AdminPanel currentUser={currentUser} />
          </DraggableWindow>
        )}

        {openWindows.notepad && (
          <DraggableWindow title="Ortak Not Defteri" icon="📝" initialPos={getCenterOffset(100, -250)} onClose={() => toggleWindow('notepad', false)} zIndex={zIndices.notepad} setZIndex={() => bringToFront('notepad')} initialWidth="400px" initialHeight="600px" resizable={true}>
            <Notepad currentUser={currentUser} />
          </DraggableWindow>
        )}

        {openWindows.galleryFolder && (
          <DraggableWindow title="Galeri" icon="📁" initialPos={getCenterOffset(50, -150)} onClose={() => toggleWindow('galleryFolder', false)} zIndex={zIndices.galleryFolder} setZIndex={() => bringToFront('galleryFolder')} initialWidth="600px" initialHeight="400px" resizable={true}>
            <GalleryFolder onImageClick={(img) => setSelectedImage(img)} />
          </DraggableWindow>
        )}

        {openWindows.desktopProperties && (
          <DesktopProperties 
            onClose={() => toggleWindow('desktopProperties', false)} 
            zIndex={zIndices.desktopProperties} 
            setZIndex={() => bringToFront('desktopProperties')} 
          />
        )}

        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}>
          <button className="win95-btn" onClick={() => setIsModalOpen(true)} style={{ padding: '10px' }}>
            <span style={{ marginRight: '5px' }}>📝</span>
            Yeni Tutanak Tut
          </button>
        </div>

        <WidgetGallery currentUser={currentUser} onImageClick={(img) => setSelectedImage(img)} />

      </div>

      {selectedImage && (
        <ImageViewerModal 
          src={selectedImage.url} 
          title={selectedImage.title} 
          uploader={users?.find(u => u.id === selectedImage.uploaderId)?.name || selectedImage.uploaderId}
          onClose={() => setSelectedImage(null)} 
        />
      )}

      <AddActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AlertModal />
      <Taskbar openWindows={openWindows} toggleWindow={toggleWindow} bringToFront={bringToFront} />
    </>
  );
}

export default App;
