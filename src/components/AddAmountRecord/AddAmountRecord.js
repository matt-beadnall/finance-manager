import { auth, db, firebase } from "../../firebase/firebaseConfig";

import React from "react";

export function AddAmountRecord({ accounts, savings, setSavings }) {
  const [visible, setVisible] = React.useState(false);
  
  //form values:
  const [selectedAccount, setSelectedAccount] = React.useState("");
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [notes, setNotes] = React.useState("");

  const { uid, photoURL } = auth.currentUser;

  const savingsRef = db.collection('savings');

  const handleSelectChange = (e) => {
    e.preventDefault()
    console.log("account",e.target.value)
    setSelectedAccount(e.target.value)
    console.log("selected account for add:", e.target.value)
  }

  const handleChangeAmount = (e) => {
    e.preventDefault();
    setSelectedAmount(e.target.value);

  };

  const handleChangeNotes = (e) => {
    e.preventDefault();
    setNotes(e.target.value);
  };

  const uploadData = async (e) => {
    e.preventDefault();
    // VALIDATION:
    // check bank is selected
    // check if amount is a number. Do not submit if not.
    const data = {
      amount: Number(selectedAmount),
      bank: selectedAccount,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      currency: "GBP",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      notes: notes
    }
    console.log("uploading data:", data)
  
    if(selectedAccount === "") {
      alert("Please select an account")
    } else {
      await savingsRef.add(data)
      setSelectedAccount('');
      setSelectedAmount(0);
      setNotes("");
      savings.push(data)
      setSavings(savings)
    }
    setSelectedAccount('');
    setSelectedAmount(0);
    setNotes("");
  }


  /**
   * TODO: complete this
   */
  const isFormComplete = () => {
    return true;
  }
  
  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="bg-white hover:bg-neutral-100 text-gray-500 border-2 py-1 px-2 rounded m-1"
      >
        Add Amount
      </button>
      {
        <div style={{ display: visible ? "block" : "none" }}>
          <form onSubmit={uploadData}>
            <select defaultValue={'DEFAULT'} onChange={handleSelectChange} name="account">
            <option disabled value="DEFAULT"> -- select an account -- </option>
              {accounts &&
                accounts.map((account) => <option value={account.id}>{account.data().description}</option>)
                }
            </select>
            <input placeholder="Amount" onChange={handleChangeAmount} />
            {/* <input type="text" placeholder="Date" /> */}
            <input value={notes} onChange={handleChangeNotes} type="text" placeholder="Notes" />
            <button type="submit">Upload</button>
          </form>
        </div>
      }
    </>
  );
}
