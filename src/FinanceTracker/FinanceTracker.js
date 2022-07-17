import React, { useEffect, useState } from "react";
import { auth, db } from '../firebase/firebaseConfig.js';

import { ChartsFinancialCharts } from "../FinancialCharts";
import UploadCSVToDatabase from "../UploadCSVToDatabase";
import { useCollectionData } from "react-firebase-hooks/firestore";

function FinanceTracker() {
  const savingsRef = db.collection("savings");
  const query = savingsRef.orderBy("date").limit(200);
  const [savings] = useCollectionData(query, { idField: "id" });
  const [locations, setLocations] = useState([]);
  const [documents, setDocuments] = useState([])
  const [investments, setInvestments] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [loading, setLoading] = useState({savings: false, locations: true, investments: true});
  const [user, setUser] = useState({})


  //============================================================================================================================
  // API INFO:
  // ALPHA VANTAGE
  const apiKey = "KZKF9TGFQ4X4CAD9";
  var alphaUrl = `https://www.alphavantage.co/query?function=HT_DCPHASE&symbol=IBM&interval=daily&series_type=close&apikey=${apiKey}`;
  //============================================================================================================================

  useEffect(() => {
    getAllCashLocations();
    setUser(auth.currentUser);
    fetchAllDocuments("investments");
    setLoading({locations: false, investments: false});

    // AXIOS > MOVE TO ANOTHER FUNCTION
    // axios.get(alphaUrl).then((response) => {
    //   console.log(response.data);
    // });
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
     */
    const fetchAllDocuments = (docName) => {
      console.log(docName);
      const docsRef = db.collection(docName);
      let docsArray = [];
      docsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          docsArray.push(doc);
        });
        setDocuments({[docName]: docsArray});
        // setLoading({[docName]:false});
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        // setLoading({[docName]:false});
      });
  };

  // FinanceTracker return
  return (
    <>
      <UploadCSVToDatabase/>
      {console.log(locations)}
      {loading.locations ? (
        <p>Loading...</p>
      ) : (
        locations.map((location) => (
          <div key={location.id}>
            <button>{location.data().description}</button>
            <ChartsFinancialCharts
              amounts={savings.filter((entry) => entry.bank === location.id)}
              bank={location.data()}
            />
            {/* Add an new amount */}
            <h4>Functions</h4>
            <button>Add Amount</button>
            <button>Show Trend Line</button>
            <button>Show Investments</button>
            {investments &&
              investments
                .filter((i) => i.bank === location.id)
                .map((investment) => {
                  <h4>{investment.bank}</h4>;
                })}
          </div>
        ))
      )}
    </>
  );
}

export default FinanceTracker;