import "firebase/compat/auth";
import "firebase/compat/firestore";

import { Route, Routes } from "react-router-dom";

import FinanceTracker from "./components/FinanceTracker";
import React from "react";
import { SignIn } from "./components/Authentication/Authentication";
import { auth } from "./firebase/firebaseConfig.js";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="p-2">
      <header>
        <h1 className="text-3xl m-1 text-slate-400">Finance Tracker</h1>
      </header>

      <section>
        {user ? (
          <Routes>
            <Route path={"/"} element={<FinanceTracker />} />
            {/* <Route path={"/"} element={<FinanceTracker />} /> */}
          </Routes>
        ) : (
          <SignIn />
        )}
        {/* <FinanceTracker/> */}
      </section>
    </div>
  );
}

export default App;
