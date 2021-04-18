import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-Yw6aLdIyTl980dJtos6ArXJXxYoEUEc",
    authDomain: "blazed-chat.firebaseapp.com",
    projectId: "blazed-chat",
    storageBucket: "blazed-chat.appspot.com",
    messagingSenderId: "828720495047",
    appId: "1:828720495047:web:5d28a5945f4dd7564b41e2",
    measurementId: "G-3YVFYJCPFV"
  };

  const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

  const db = app.firestore();
  const auth = app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { db, auth, provider };