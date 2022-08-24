import { auth, db, firebase } from "../../firebase/firebaseConfig";

import React from "react";

export function AddNewAccount() {  
  //form values:
  const [code, setSelectedCode] = React.useState("");
  const [company, setSelectedCompany] = React.useState("");
  const [type, setSelectedType] = React.useState("");

  const { uid } = auth.currentUser;

  const handleChangeCode = (e) => {
    e.preventDefault();
    setSelectedCode(e.target.value);
  };
  const handleChangeCompany = (e) => {
    e.preventDefault();
    setSelectedCompany(e.target.value);
  };
  const handleChangeType = (e) => {
    e.preventDefault();
    setSelectedType(e.target.value);
  };


  const uploadData = async (e) => {
    e.preventDefault();

    const data = {
      code: code,
      company: company,
      type: type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    }

    await db.collection('accounts').add(data)

    setSelectedCode("");
    setSelectedCompany("");
    setSelectedType("");
  }

  
  return (
    <>
      {
        <div >
          <form onSubmit={uploadData}>
            <input value={code} onChange={handleChangeCode} type="text" placeholder="Code" />
            <input value={company} onChange={handleChangeCompany} type="text" placeholder="Company" />
            <input value={type} onChange={handleChangeType} type="text" placeholder="Type" />
            <button type="submit">Upload</button>
          </form>
        </div>
      }
    </>
  );
}
