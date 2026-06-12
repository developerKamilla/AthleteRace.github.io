/* Athlete Race realtime backend adapter — Firebase Realtime Database.
   Syncs shared club data across different phones/laptops:
   users, sessions, events, chat, athleteBook. */
(function(){
  const PLACEHOLDER = /PASTE_|YOUR_|xxxx/i;
  let dbRef = null;
  let initialized = false;
  let applyingRemote = false;
  let saveTimer = null;
  let lastSerialized = '';
  let statusHandler = null;

  function cleanState(state){
    const safe = state || {};
    return {
      users: Array.isArray(safe.users) ? safe.users : [],
      sessions: Array.isArray(safe.sessions) ? safe.sessions : [],
      events: Array.isArray(safe.events) ? safe.events : [],
      chat: Array.isArray(safe.chat) ? safe.chat.slice(-500) : [],
      athleteBook: safe.athleteBook && typeof safe.athleteBook === 'object' ? safe.athleteBook : {}
    };
  }

  function configIsReady(config){
    if(!config || typeof config !== 'object') return false;
    const required = ['apiKey','authDomain','databaseURL','projectId','appId'];
    return required.every(k => typeof config[k] === 'string' && config[k] && !PLACEHOLDER.test(config[k]));
  }

  function setStatus(mode, text){
    const payload = { mode, text };
    window.AR_BACKEND_STATUS = payload;
    if(typeof statusHandler === 'function') statusHandler(payload);
    const el = document.getElementById('backend-status');
    if(el){
      el.className = 'backend-status ' + mode;
      el.textContent = text;
    }
  }

  function init({ getState, setState, onStatus } = {}){
    statusHandler = onStatus || null;

    if(!window.firebase || !window.firebase.database){
      setStatus('local', 'Local demo mode');
      return false;
    }
    if(!configIsReady(window.FIREBASE_CONFIG)){
      setStatus('local', 'Local demo mode · add Firebase config');
      return false;
    }

    try{
      if(!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      const path = window.AR_FIREBASE_PATH || 'athleteRace/prod/sharedState';
      dbRef = firebase.database().ref(path);
      initialized = true;
      setStatus('connecting', 'Connecting realtime…');

      dbRef.on('value', snapshot => {
        const remote = snapshot.val();
        if(!remote){
          const initial = cleanState(typeof getState === 'function' ? getState() : {});
          dbRef.set(initial);
          return;
        }
        const serialized = JSON.stringify(cleanState(remote));
        lastSerialized = serialized;
        applyingRemote = true;
        if(typeof setState === 'function') setState(remote);
        applyingRemote = false;
        setStatus('online', 'Realtime sync online');
      }, error => {
        console.error('[ARBackend] realtime listener failed:', error);
        setStatus('error', 'Realtime sync error');
      });

      window.addEventListener('online', () => setStatus('online', 'Realtime sync online'));
      window.addEventListener('offline', () => setStatus('error', 'Offline · changes will retry'));
      return true;
    } catch(err){
      console.error('[ARBackend] init failed:', err);
      setStatus('error', 'Realtime sync failed');
      initialized = false;
      return false;
    }
  }

  function save(state){
    if(!initialized || !dbRef || applyingRemote) return;
    const shared = cleanState(state);
    const serialized = JSON.stringify(shared);
    if(serialized === lastSerialized) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      lastSerialized = serialized;
      dbRef.set({ ...shared, updatedAt: new Date().toISOString() }).catch(err => {
        console.error('[ARBackend] save failed:', err);
        setStatus('error', 'Realtime save error');
      });
    }, 180);
  }

  function isOnline(){ return initialized; }

  window.ARBackend = { init, save, isOnline, cleanState };
})();
