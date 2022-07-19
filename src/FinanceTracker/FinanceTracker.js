import React, { useEffect, useState } from "react";
import { auth, db } from '../firebase/firebaseConfig.js';

import UploadCSVToDatabase from "../UploadCSVToDatabase";
import FinanceBucket from "./FinanceBucket";

function FinanceTracker() {
  // const savingsRef = db.collection("savings");
  // const query = savingsRef.orderBy("date").limit(200);
  // const [savings] = useCollectionData(query, { idField: "id" });
  const [locations, setLocations] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  // const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [loading, setLoading] = useState({savings: false, locations: true, investments: true});
  const [user, setUser] = useState({})




  useEffect(() => {
    getAllCashLocations();
    setUser(auth.currentUser);
    fetchAllDocuments("investments");
    fetchAllDocuments("savings");
    setLoading({locations: false, investments: false});

  }, []);

  /**
   * Add caching to this! React hooks
   */
  const getAllCashLocations = () => {
    const locationsRef = db.collection("locations");
    let locationsArray = [];
    locationsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          locationsArray.push(doc);
        });
        setLocations(locationsArray);
        setLoading({locations:false});
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        setLoading({locations:false});
      });
    };
    
    /**
     * Fetches all investments in db for user. In time this will need to be able to select bank subsets.
     * Move the setters out of this funciton
     * Make sure the document you're fetching has a date.
     */
    const fetchAllDocuments = (docName) => {
      const docsRef = db.collection(docName).orderBy("date").limit(200);
      let docsArray = [];
      docsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.data());
          docsArray.push(doc);
        });
        switch (docName) {
          case "savings": setSavings(docsArray); break;
          case "investments": setInvestments(docsArray); break;
          default: break;
        }
        setLoading({[docName]:false});
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        setLoading({[docName]:false});
      });
  };

  // FinanceTracker return
  return (
    <>
      <UploadCSVToDatabase/>
      {loading.locations ? (
        <p>Loading...</p>
      ) : (
        locations.map((location) => (
          <FinanceBucket key={location.id} location={location} savings={savings} investments={investments} />)
        )
      )}
    </>
  );
}

export default FinanceTracker;