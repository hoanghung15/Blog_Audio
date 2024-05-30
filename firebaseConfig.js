// firebaseInit.js
const firebaseConfig = {
  apiKey: "AIzaSyAjuOIdmVqQ2TiSy4tGzlJ88rSooQvoUAI",
  authDomain: "blogaudio-39428.firebaseapp.com",
  projectId: "blogaudio-39428",
  storageBucket: "blogaudio-39428.appspot.com",
  messagingSenderId: "1054759365276",
  appId: "1:1054759365276:web:2c31fab142ab895d8b1b59",
  measurementId: "G-QXMVV39J5G",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
