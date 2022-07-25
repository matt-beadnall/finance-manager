import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import {
  getTotals,
  sortData,
} from "../../functions/DataCalculations/DataCalculations";

import AccountHistoryChart from "../Account";
import { AccountPicker } from "./AccountPicker";
import Modal from "../../Modal";
import { TotalsChart } from "../Charts.js";
import UploadCSVToDatabase from "../UploadCSVToDatabase";
import { UserLoginStatus } from "../UserLoginStatus";
import { data } from "autoprefixer";

function FinanceTracker() {
  // const savingsRef = db.collection("savings");
  // const query = savingsRef.orderBy("date").limit(200);
  // const [savings] = useCollectionData(query, { idField: "id" });
  const [accounts, setAccounts] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const [selected, setSelected] = useState("");
  const [compare, setCompare] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
  }, []);

  /**
   * Add caching to this! React hooks
   */
  const getAllCashLocations = async (uid, db) => {
    const locationsRef = db.collection("locations")
      .where("uid", "==", uid);
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
    savings.forEach(
      (entry) => {
        try {
          entry.data().date = new Date(entry.data().date.seconds * 1000)
            .toISOString()
            .substring(0, 10);
        } catch (err) {
          // TODO: find out where this error is occuring
          // console.log("ERROR", err);
          console.log("ERROR", entry.data().date);
        }
      }
      // console.log("Data",new Date(data.date.seconds*1000).toISOString())
    );
    return savings
      .map((entry) => entry.data())
      .sort((a, b) => a.date.seconds - b.date.seconds);
  };

  const processedData = useMemo(() => processData(savings), [savings]);
  // const selectedData = processedData.filter(
  //   (entry) => entry.bank === selectedBucket
  // );

  const totalsData = useMemo(() => getTotals(processedData), [processedData]);
  // combine each account into one object per date
  // const sortedData = useMemo(() => getTotals(processedData), [processedData]);
  const sortedData = sortData(processedData);

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

  const toggleModal = () => {
    console.log("Toggling modal");
    setShowModal(!showModal);
  }

  return (
    <>
      <UserLoginStatus auth={auth} />
      <UploadCSVToDatabase />
      <div>
        <h1>Net Worth</h1>
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

      <AccountHistoryChart
        setSavings={setSavings}
        accounts={accounts}
        savings={sortedData}
        investments={investments}
        selectedAccounts={selectedAccounts}
      />
      <button
        className="text-gray-500 hover:bg-blue-50 justify-start border-2 px-2 rounded-md m-1"
        onClick={toggleModal}
      >
        {`${showModal ? 'Close' : 'Open'} Modal`}
      </button>
      {showModal &&
        (<Modal>
          <div className="h-2">
            <button onClick={() => setShowModal(!showModal)}>
              X
            </button>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Bank</th>
                    <th>Currency</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {savings &&
                    savings.map((record, i) => (
                      <tr key={i}>
                        <td>{record.data().amount}</td>
                        <td>{record.data().bank}</td>
                        <td>{record.data().currency}</td>
                        <td>
                          {new Date(record.data().date.seconds * 1000)
                            .toISOString()
                            .substring(0, 10)}
                        </td>
                        <td>{record.data().notes}</td>
                        <td>
                          <button
                            onClick={(e) => handleDelete(e, record)}
                            className="text-gray-500 hover:bg-blue-50 justify-start border-2 px-2 rounded-md m-1"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
        )}
    </>
  );
}

export default FinanceTracker;
