import "firebase/compat/auth";
import "firebase/compat/firestore";

import { SignIn, SignOut } from "./Authentication";

import FinanceTracker from "./FinanceTracker";
import React from "react";
import { auth } from './firebase/firebaseConfig.js';
import { useAuthState } from "react-firebase-hooks/auth";

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
