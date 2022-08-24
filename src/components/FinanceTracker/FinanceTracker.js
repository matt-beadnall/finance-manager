import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";

import AccountHistoryBox from "../Account";
import { AccountHistoryTable } from "../AccountHistoryTable.js";
import { AddAmountRecord } from "../AddAmountRecord/AddAmountRecord.js";
import { AccountPicker as BankSelector } from "../AccountPicker/AccountPicker";
import { CompareBanks } from "../CompareBanks";
import Modal from "../../Modal";
import { NetWorthDisplay } from "./NetWorthDisplay";
import UploadCSVToDatabase from "../UploadCSVToDatabase/UploadCSVToDatabase";
import { UserLoginStatus } from "../UserLoginStatus";
import { getLastInArray } from "../../functions/arrays/ProcessArray.js";
import { getTotals } from "../../functions/data-processing/DataCalculations";
import { useFormik } from "formik";

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
    fetchAllDocumentsForUser("investments", uid);
    fetchAllDocumentsForUser("savings", uid);
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
          locationsArray.push(doc.data());
          let updateValue = selectedAccounts;
          updateValue[doc.data().code] = false;
          setSelectedAccounts(updateValue);
        });
        setAccounts(locationsArray);
        setSelected(locationsArray[0].code);
        if (selectedAccounts !== undefined) {
          setSelectedAccounts({
            ...selectedAccounts,
            [locationsArray[0].code]: true,
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
  const fetchAllDocumentsForUser = (docName, uid) => {
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
        (account) => (selectedAccounts[account.code] = false)
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
      .map((entry) => entry.data())
      .sort((a, b) => a.date.seconds - b.date.seconds);
    console.log("newArray", newArray);
    newArray.forEach((entry) => {
      try {
        entry.date = new Date(entry.date.seconds * 1000)
          .toISOString()
          .substring(0, 10);
      } catch (err) {
        // TODO: find out where this error is occuring
        // console.log("ERROR", err);
        console.log("ERROR", entry.date);
      }
    });
    return newArray;
  };

  // preprocess data for charts
  const processedData = useMemo(() => processData(savings), [savings]);

  // Create data for the totals chart
  const totalsData = useMemo(() => getTotals(processedData), [processedData]);

  const setComparisonMode = () => {
    // if already in comparison mode, reset the selected accounts
    if (compare) {
      accounts.map((account) => (selectedAccounts[account.code] = false));
      setSelectedAccounts({ ...selectedAccounts, [accounts[0].code]: true });
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

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <UserLoginStatus auth={auth} />

      <NetWorthDisplay totalsData={totalsData} />
      <BankSelector
        savings={savings}
        selected={selected}
        handleSelectBucket={handleSelectAccount}
        selectedAccounts={selectedAccounts}
      />
      <CompareBanks compare={compare} setComparisonMode={setComparisonMode} />
      <AccountHistoryBox
        setSavings={setSavings}
        accounts={accounts}
        data={processedData}
        investments={investments}
        selectedAccounts={selectedAccounts}
      />
      <Modal title="Upload Data" size="lg" index={2}>
        <UploadCSVToDatabase />
      </Modal>  
      <Modal title="View Data" size="xl" index={0}>
        <AccountHistoryTable selectedBank={selected} savings={savings} handleDelete={handleDelete}/>
      </Modal>
      <Modal title="Add Data" size="lg" index={1}>
        <div>
          {/* <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />

            <button type="submit">Submit</button>
          </form> */}
          <AddAmountRecord
            accounts={accounts}
            savings={savings}
            setSavings={setSavings}
          />
        </div>
      </Modal>
    </>
  );
}

export default FinanceTracker;
