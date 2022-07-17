import 'firebase/auth';
import 'firebase/firestore';

import firebase from 'firebase/compat/app';

// Initialize Firebase
let config = {
    apiKey: "AIzaSyCQAIqj4r4x5lu01iktmJkWQgnA-qYjaOw",
    authDomain: "finance-manager-baf55.firebaseapp.com",
    projectId: "finance-manager-baf55",
    storageBucket: "finance-manager-baf55.appspot.com",
    messagingSenderId: "977205835382",
    appId: "1:977205835382:web:a9b78ad9671e2983409157",
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const emailAuthProvider = new firebase.auth.EmailAuthProvider();

export { auth, firebase, db, googleAuthProvider, emailAuthProvider };