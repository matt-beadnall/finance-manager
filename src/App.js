import "firebase/compat/auth";
import "firebase/compat/firestore";

import { SignIn, SignOut } from "./Authentication";

import FinanceTracker from "./FinanceTracker";
import React from "react";
import { auth } from './firebase/firebaseConfig.js';
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";

firebase.initializeApp({
  apiKey: "AIzaSyCQAIqj4r4x5lu01iktmJkWQgnA-qYjaOw",
  authDomain: "finance-manager-baf55.firebaseapp.com",
  projectId: "finance-manager-baf55",
  storageBucket: "finance-manager-baf55.appspot.com",
  messagingSenderId: "977205835382",
  appId: "1:977205835382:web:a9b78ad9671e2983409157",
});

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Finance Manager</h1>
        <SignOut/>
      </header>

      <section>
        {user ? (
          <FinanceTracker/>
        ) : (
          <SignIn />
        )}
      </section>
    </div>
  );
}

export default App;
