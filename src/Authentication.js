import { auth, firebase } from "./firebase/firebaseConfig.js";

import GoogleIcon from "./images/google-svgrepo-com.svg";
import React from "react";

/**
 * Add a Google logo SVG
 * @returns
 */
export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithCredential(provider);
  };

  return (
    <>
        <button className="flex hover:bg-slate-50 justify-start border-2 px-2 py-2 rounded-md m-1" onClick={signInWithGoogle}>
        <img className="pl-1 pr-2" src={GoogleIcon} alt="Google icon" />
          Sign in with Google
        </button>
    </>
  );
}

export function SignOut() {
  return (
    auth.currentUser && (
      <button
        className="h-8 hover:bg-slate-50 justify-start border-2 px-2 py-1 rounded-md m-1"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    )
  );
}
