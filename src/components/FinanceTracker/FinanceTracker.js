import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import { getTotals } from "../../functions/data-processing/DataCalculations";

import Account from "../Account";
import { AccountPicker } from "../AccountPicker/AccountPicker";
import { EditDataTable } from "../EditDataTable/EditDataTable";
import Modal from "../../Modal";
import { TotalsChart } from "../Charts/Charts.js";
import UploadCSVToDatabase from "../UploadCSVToDatabase/UploadCSVToDatabase";
import { UserLoginStatus } from "../UserLoginStatus";
import { getLastInArray } from "../../functions/arrays/ProcessArray.js";

function FinanceTracker() {
  // const savingsRef = db.collection("savings");
  // const query = savingsRef.orderBy("date").limit(200);
  // const [savings] = useCollectionData(query, { idField: "id" });
  const [accounts, setAccounts] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState({});
  // eslint-disable-next-line
  const [selected, setSelected] = useState("");
  const [compare, setCompare] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line
  const [loading, setLoading] = useState({
    savings: false,
    locations: true,
    investments: true,
  });

  // current user information
  const { uid, photoURL } = auth.currentUser;

  useEffect(() => {
    getAllCashLocations(uid, db);
    fetchAllDocuments("investments", uid);
    fetchAllDocuments("savings", uid);
    setLoading({ locations: false, investments: false });
    // eslint-disable-next-line
  }, []);

  /**
   * Add caching to this! React hooks
   */
  const getAllCashLocations = async (uid, db) => {
    const locationsRef = db.collection("locations").where("uid", "==", uid);
    let locationsArray = [];
    locationsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          locationsArray.push(doc);
          if (doc.id !== undefined) {
            let updateValue = selectedAccounts;
            updateValue[doc.id] = false;
            setSelectedAccounts(updateValue);
          }
        });
        setAccounts(locationsArray);
        setSelected(locationsArray[0].id);
        if (selectedAccounts !== undefined) {
          setSelectedAccounts({
            ...selectedAccounts,
            [locationsArray[0].id]: true,
          });
        }
        setLoading({ locations: false });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        setLoading({ locations: false });
      });
  };

  /**
   * Fetches all investments in db for user. In time this will need to be able to select bank subsets.
   * Move the setters out of this funciton
   * Make sure the document you're fetching has a date.
   */
  const fetchAllDocuments = (docName, uid) => {
    const docsRef = db
      .collection(docName)
      .where("uid", "==", uid)
      .orderBy("date")
      .limit(200);
    let docsArray = [];
    docsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          docsArray.push(doc);
        });
        switch (docName) {
          case "savings":
            setSavings(docsArray);
            break;
          case "investments":
            setInvestments(docsArray);
            break;
          default:
            break;
        }
        setLoading({ [docName]: false });
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        setLoading({ [docName]: false });
      });
  };

  const handleSelectAccount = (e, location) => {
    // console.log("accounts",accounts)
    e.preventDefault();
    setSelected(location);
    console.log("Selected Account:", location);
    if (!compare) {
      let updated = accounts.map(
        (account) => (selectedAccounts[account.id] = false)
      );
      updated[location] = true;
      setSelectedAccounts(updated);
    } else {
      setSelectedAccounts({
        ...selectedAccounts,
        [location]: !selectedAccounts[location],
      });
    }
  };

  /**
   * Does operations to process the data into the correct format. Currently this only needs to convert the date
   * @param {*} savings
   * @param {*} selectedBucket
   * @returns
   */
  const processData = (savings) => {
    console.log("Processing account data");
    const newArray = savings
      .map((entry) => (
        entry.data()
      ))
      .sort((a, b) => a.date.seconds - b.date.seconds);
    console.log("newArray", newArray)
    newArray.forEach(
      (entry) => {
        try {
          entry.date = new Date(entry.date.seconds * 1000)
            .toISOString()
            .substring(0, 10);
        } catch (err) {
          // TODO: find out where this error is occuring
          // console.log("ERROR", err);
          console.log("ERROR", entry.date);
        }
      }
    );
    return newArray
  };

  // preprocess data for charts
  const processedData = useMemo(() => processData(savings), [savings]);

  // Create data for the totals chart
  const totalsData = useMemo(() => getTotals(processedData), [processedData]);

  const setComparisonMode = () => {
    // if already in comparison mode, reset the selected accounts
    if (compare) {
      accounts.map((account) => (selectedAccounts[account.id] = false));
      setSelectedAccounts({ ...selectedAccounts, [accounts[0].id]: true });
    }
    setCompare(!compare);
  };

  /**
   * For data returned from firebase, map to the correct format (.data())
   */
  const extractData = (data) => {
    return data.map((entry) => entry.data());
  };

  const handleDelete = (e, record) => {
    e.preventDefault();
    if (window.confirm("Delete " + record.id)) {
      console.log("Deleting", record);
      db.collection("savings")
        .doc(record.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          setSavings(savings.filter((entry) => entry.id !== record.id));
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    }
  };

  return (
    <>
      <UserLoginStatus auth={auth} />
      <UploadCSVToDatabase />
      <div>
        <h1>Net Worth</h1>
        <h1>{`Value: ${getLastInArray()}`}</h1>
        <TotalsChart data={totalsData}></TotalsChart>
      </div>
      <AccountPicker
        accounts={accounts}
        handleSelectBucket={handleSelectAccount}
        selectedAccounts={selectedAccounts}
      />
      <div className="flex">
        <button
          className={`text-gray-500 hover:bg-blue-50 justify-start border-2 px-2 py-1 rounded-md m-1 ${compare && "bg-blue-300 hover:bg-blue-200"
            }`}
          onClick={setComparisonMode}
        >
          Compare
        </button>
        {compare && (
          <p className="text-gray-200">Multiple accounts can be selected</p>
        )}
      </div>

      <Account
        setSavings={setSavings}
        accounts={accounts}
        data={processedData}
        investments={investments}
        selectedAccounts={selectedAccounts}
      />
      <Modal title="Edit Data">
        <EditDataTable savings={savings} handleDelete={handleDelete}/>
      </Modal>
    </>
  );
}

export default FinanceTracker;


