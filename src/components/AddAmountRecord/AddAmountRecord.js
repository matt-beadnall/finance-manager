import React, { useMemo } from "react";
import { auth, db, firebase } from "../../firebase/firebaseConfig";

import { sortData } from "../../functions/data-processing/DataCalculations";

export function AddAmountRecord({ accounts, savings, setSavings }) {  
  //form values:
  const [selectedAccount, setSelectedAccount] = React.useState("");
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState(0);
  const [notes, setNotes] = React.useState("");

  const { uid } = auth.currentUser;

  const savingsRef = db.collection('savings');

  const sortedData = useMemo(() => sortData(savings), [savings]);

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

  const handleChangeDate = (e) => {
    e.preventDefault();
    console.log("date", e.target.value)
    setSelectedDate(e.target.value);

  };

  const handleChangeNotes = (e) => {
    e.preventDefault();
    setNotes(e.target.value);
  };

  const uploadData = async (e) => {
    e.preventDefault();

    const data = {
      amount: Number(selectedAmount),
      bank: selectedAccount,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      currency: "GBP",
      date: new Date(selectedDate),
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
      sortedData.push(data)
      setSavings(sortedData)
    }
    setSelectedAccount('');
    setSelectedAmount(0);
    setNotes("");
  }

  
  return (
    <>
      {
        <div >
          <form onSubmit={uploadData}>
            <select defaultValue={'DEFAULT'} onChange={handleSelectChange} name="account">
            <option disabled value="DEFAULT"> -- select an account -- </option>
              {accounts &&
                accounts.map((account) => <option key={account.code} value={account.code}>{account.company} {account.type}</option>)
                }
            </select>
            <input placeholder="Amount" onChange={handleChangeAmount} />
            <input placeholder="Date" type="date" onChange={handleChangeDate} />
            {/* <input type="text" placeholder="Date" /> */}
            <input value={notes} onChange={handleChangeNotes} type="text" placeholder="Notes" />
            <button type="submit">Upload</button>
          </form>
        </div>
      }
    </>
  );
}
