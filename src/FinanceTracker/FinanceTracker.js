import React, { useEffect, useState } from "react";
import { auth, db } from '../firebase/firebaseConfig.js';

import { FinancialCharts } from "../FinancialCharts";
import UploadCSVToDatabase from "../UploadCSVToDatabase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Investment } from "../Investment";

function FinanceTracker() {
  // const savingsRef = db.collection("savings");
  // const query = savingsRef.orderBy("date").limit(200);
  // const [savings] = useCollectionData(query, { idField: "id" });
  const [locations, setLocations] = useState([]);
  const [documents, setDocuments] = useState({savings:[], investments:[]})
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
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
          <div key={location.id}>
            <button>{location.data().description}</button>
            <FinancialCharts
              amounts={savings.filter((entry) => entry.data().bank === location.id).map(entry => entry.data())}
              bank={location.data()}
            />
            {/* Add an new amount */}
            <h4>Functions</h4>
            <button>Add Amount</button>
            <button>Show Trend Line</button>
            <button>Show Investments</button>
            {investments &&
              investments.filter((entry) => entry.data().bank === location.id).map((investment, i) =>  <Investment key={i} document={investment.data()}/>
                )}
          </div>
        ))
      )}
    </>
  );
}

export default FinanceTracker;


