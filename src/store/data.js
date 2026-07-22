import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update, get, remove } from 'firebase/database';

const INITIAL_USERS = [
  { id: 'erman', name: 'Erman', score: 1000, avatar: 'erman.jpeg', password: 'ermeni31' },
  { id: 'altan', name: 'Altan (Muhammet)', score: 1000, avatar: 'altan.jpeg', password: 'sapık.kodlamacı' },
  { id: 'bugra', name: 'Buğra', score: 1000, avatar: 'bugra.jpeg', password: 'kanosiken' },
  { id: 'ozan', name: 'Ozan', score: 1000, avatar: 'ozan.jpeg', password: 'baskınozan' },
  { id: 'koray', name: 'Koray', score: 1000, avatar: 'koray.jpeg', password: 'maaşalamayan' },
];

const INITIAL_RULES = [
  { id: 1, type: 'below', threshold: 500, description: 'Kahve ısmarlar' },
];

export const useStore = () => {
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);
  const [rules, setRules] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [wallpaper, setWallpaper] = useState('mutluluk.jpg');
  const [paintCanvas, setPaintCanvas] = useState('');
  const [gallery, setGallery] = useState([]);
  const [notepad, setNotepad] = useState([]);

  useEffect(() => {
    // Listen to users
    const usersRef = ref(db, 'users');
    const unsubUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mergedUsers = Object.values(data).map(u => {
          const initial = INITIAL_USERS.find(iu => iu.id === u.id);
          // Avatar ve şifreyi daima local'den al
          return { ...u, password: initial?.password || u.password, avatar: initial?.avatar || u.avatar };
        });
        setUsers(mergedUsers);
      } else {
        // Initialize if empty
        const initialUsersObj = {};
        INITIAL_USERS.forEach(u => initialUsersObj[u.id] = u);
        set(usersRef, initialUsersObj);
      }
    });

    // Listen to actions
    const actionsRef = ref(db, 'actions');
    const unsubActions = onValue(actionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setActions(Object.values(data).sort((a, b) => b.id - a.id));
      } else {
        setActions([]);
      }
    });

    // Listen to rules
    const rulesRef = ref(db, 'rules');
    const unsubRules = onValue(rulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRules(Object.values(data));
      } else {
        setRules([]);
      }
      setIsLoaded(true);
    });

    // Listen to global wallpaper
    const wpRef = ref(db, 'global/wallpaper');
    const unsubWp = onValue(wpRef, (snapshot) => {
      if (snapshot.exists()) {
        setWallpaper(snapshot.val());
      } else {
        set(wpRef, 'mutluluk.jpg');
      }
    });

    // Listen to global paint canvas
    const paintRef = ref(db, 'global/paint');
    const unsubPaint = onValue(paintRef, (snapshot) => {
      if (snapshot.exists()) {
        setPaintCanvas(snapshot.val());
      }
    });

    // Listen to global gallery
    const galleryRef = ref(db, 'global/gallery');
    const unsubGallery = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = Date.now();
        const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
        const validGallery = [];
        
        Object.entries(data).forEach(([key, img]) => {
          if (now - img.timestamp > FOURTEEN_DAYS) {
            // Otomatik sil
            remove(ref(db, `global/gallery/${key}`));
          } else {
            validGallery.push(img);
          }
        });
        
        setGallery(validGallery.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setGallery([]);
      }
    });

    // Listen to notepad
    const notepadRef = ref(db, 'global/notepad');
    const unsubNotepad = onValue(notepadRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotepad(Object.values(data).sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setNotepad([]);
      }
    });

    return () => {
      unsubUsers();
      unsubActions();
      unsubRules();
      unsubWp();
      unsubPaint();
      unsubGallery();
      unsubNotepad();
    };
  }, []);

  const addAction = (userId, points, reason) => {
    const newId = Date.now();
    const newAction = {
      id: newId,
      userId,
      points: Number(points),
      reason,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    set(ref(db, `actions/${newId}`), newAction);
  };

  const voteAction = async (actionId, voterId, vote) => {
    const actionRef = ref(db, `actions/${actionId}`);
    const snapshot = await get(actionRef);
    if (!snapshot.exists()) return;
    
    const action = snapshot.val();
    if (action.status !== 'pending') return;

    const newVotes = { ...(action.votes || {}), [voterId]: vote };
    
    let yesCount = 0;
    let noCount = 0;
    Object.values(newVotes).forEach(v => {
      if (v === 'yes') yesCount++;
      if (v === 'no') noCount++;
    });

    let newStatus = 'pending';
    if (yesCount >= 3) {
      newStatus = 'approved';
    } else if (noCount >= 3) {
      newStatus = 'rejected';
    }

    const updates = {};
    updates[`actions/${actionId}/votes`] = newVotes;
    updates[`actions/${actionId}/status`] = newStatus;

    if (newStatus === 'approved') {
      const userRef = ref(db, `users/${action.userId}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const u = userSnap.val();
        updates[`users/${action.userId}/score`] = u.score + action.points;
      }
    }
    update(ref(db), updates);
  };

  const addRule = (type, threshold, description) => {
    const newId = Date.now();
    const newRule = {
      id: newId,
      type,
      threshold: Number(threshold),
      description
    };
    set(ref(db, `rules/${newId}`), newRule);
  };

  const deleteRule = (ruleId) => {
    set(ref(db, `rules/${ruleId}`), null);
  };

  const updateScore = (userId, newScore) => {
    set(ref(db, `users/${userId}/score`), Number(newScore));
  };

  const changeWallpaper = (newWp) => {
    set(ref(db, 'global/wallpaper'), newWp);
  };

  const savePaint = (dataUrl) => {
    set(ref(db, 'global/paint'), dataUrl);
  };

  const addGalleryImage = (dataUrl, title, uploaderId) => {
    const newId = Date.now();
    const newImage = {
      id: newId,
      url: dataUrl,
      title: title || 'İsimsiz',
      uploaderId,
      timestamp: newId
    };
    set(ref(db, `global/gallery/${newId}`), newImage);
  };

  const clearGallery = () => {
    set(ref(db, 'global/gallery'), null);
  };

  const deleteGalleryImage = (id) => {
    set(ref(db, `global/gallery/${id}`), null);
  };

  const clearNotepad = () => {
    set(ref(db, 'global/notepad'), null);
  };

  const deleteNotepadEntry = (id) => {
    set(ref(db, `global/notepad/${id}`), null);
  };

  const updateNotepadEntry = (id, newText) => {
    update(ref(db, `global/notepad/${id}`), { text: newText });
  };

  const addNotepadEntry = (text, uploaderName) => {
    const newId = Date.now();
    set(ref(db, `global/notepad/${newId}`), {
      id: newId,
      text: `${text} - ${uploaderName}`,
      timestamp: newId
    });
  };

  const resetSystem = () => {
    set(ref(db, 'actions'), null);
    set(ref(db, 'rules'), null);
    users.forEach(u => {
      set(ref(db, `users/${u.id}/score`), 1000);
    });
  };

  const getLeaderboard = () => {
    return [...users].sort((a, b) => b.score - a.score);
  };

  return { 
    users, 
    actions, 
    rules,
    isLoaded,
    wallpaper,
    paintCanvas,
    gallery,
    notepad,
    addAction, 
    voteAction,
    addRule,
    deleteRule,
    updateScore,
    changeWallpaper,
    savePaint,
    addGalleryImage,
    clearGallery,
    deleteGalleryImage,
    clearNotepad,
    deleteNotepadEntry,
    updateNotepadEntry,
    addNotepadEntry,
    resetSystem,
    getLeaderboard 
  };
};
