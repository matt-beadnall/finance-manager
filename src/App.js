import "firebase/compat/auth";
import "firebase/compat/firestore";

import React, { useRef } from "react";
import { SignIn, SignOut } from "./Authentication";

import { FinanceTracker } from "./FinanceTracker";
import axios from "axios";
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

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Finance Manager</h1>
        <SignOut auth={auth}/>
      </header>

      <section>
        {user ? (
          <FinanceTracker auth={auth} firestore={firestore} />
        ) : (
          <SignIn auth={auth} />
        )}
      </section>
    </div>
  );
}

export default App;
