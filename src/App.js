import "firebase/compat/auth";
import "firebase/compat/firestore";

import FinanceTracker from "./components/FinanceTracker";
import React from "react";
import { SignIn } from "./Authentication";
import { auth } from './firebase/firebaseConfig.js';
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1 className="text-3xl m-1 text-orange-400">Finance Tracker</h1>
      </header>

      <section>
        {user ? (
          <FinanceTracker/>
        ) : (
          <SignIn />
        )}
        {/* <FinanceTracker/> */}
      </section>
    </div>
  );
}

export default App;
