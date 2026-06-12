/* Firebase config for Athlete Race.
   This project uses the Firebase compat CDN scripts already included in index.html,
   so DO NOT paste the npm import/initializeApp code here. Only this object is needed.

   Realtime Database must be enabled in Firebase Console.
   If your database URL in Firebase Console differs from databaseURL below,
   replace it with the exact URL from Realtime Database → Data.
*/
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyAAYtByPyun7tMioc6kQFv2dTXfJqvHa_U",
  authDomain: "athlete-race.firebaseapp.com",
  databaseURL: "https://athlete-race-default-rtdb.firebaseio.com",
  projectId: "athlete-race",
  storageBucket: "athlete-race.firebasestorage.app",
  messagingSenderId: "303840224630",
  appId: "1:303840224630:web:d424ba2e5ac185a2868657",
  measurementId: "G-V2ZEFG0L41"
};

// Shared room/path for all club data: chat, users, sessions, diary, events.
window.AR_FIREBASE_PATH = "athleteRace/prod/sharedState";
