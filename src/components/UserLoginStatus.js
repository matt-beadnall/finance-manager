import React from "react";
import { SignOut } from "../Authentication.js";

export function UserLoginStatus({ auth }) {
  const { uid, photoURL, displayName } = auth.currentUser;

  console.log(auth);

  return (
    <div className="flex bg-slate-100 p-3">
      <img
        className="w-12 h-12 rounded-full m-2"
        src={
          photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt=""
      />
      <div>
        <h3>{displayName}</h3>
        <SignOut />
      </div>
    </div>
  );
}
