import { auth, firebase } from './firebase/firebaseConfig.js';

import React from "react";

/**
 * Add a Google logo SVG
 * @returns 
 */
export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

export function SignOut() {
  return (
    auth.currentUser && (
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}
