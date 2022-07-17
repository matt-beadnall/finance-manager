import React, { useEffect, useState } from "react";

import { ChartsFinancialCharts } from "./FinancialCharts";
import UploadCSVToDatabase from "./UploadCSVToDatabase";
import { firestore } from "./App";
import { useCollectionData } from "react-firebase-hooks/firestore";

export function FinanceTracker({auth, firestore}) {
  const walletRef = firestore.collection("wallet");
  const query = walletRef.orderBy("date").limit(200);
  const [locations, setLocations] = useState([]);
  const [documents, setDocuments] = useState([])
  const [investments, setInvestments] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(undefined);
  const [loading, setLoading] = useState({locations: true, investments: true});
  const [user, setUser] = useState({})

  const [wallet] = useCollectionData(query, { idField: "id" });

  //============================================================================================================================
  // API INFO:
  // ALPHA VANTAGE
  const apiKey = "KZKF9TGFQ4X4CAD9";
  var alphaUrl = `https://www.alphavantage.co/query?function=HT_DCPHASE&symbol=IBM&interval=daily&series_type=close&apikey=${apiKey}`;
  //============================================================================================================================

  useEffect(() => {
    getAllCashLocations();
    setUser(auth.currentUser);
    fetchAllDocuments()

    // AXIOS > MOVE TO ANOTHER FUNCTION
    // axios.get(alphaUrl).then((response) => {
    //   console.log(response.data);
    // });
  }, []);

  const getInvestments = ({ bank }) => {
    const investmentArray = fetchAllInvestmentsForBank(bank);
    console.log("investmentArray", investmentArray);
    setInvestments(
      investments.concat[
        {
          bank: bank,
          investments: investmentArray,
        }
      ]
    );
  };

  /**
   * Add caching to this! React hooks
   */
  const getAllCashLocations = () => {
    const locationsRef = firestore.collection("location");
    let locationsArray = [];
    locationsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          locationsArray.push(doc);
          // getInvestments(doc.id);
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
  const fetchAllDocuments = ({docName}) => {
    const docsRef = firestore
      .collection(docName);
    let docsArray = [];
    docsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          docsArray.push(doc);
        });
        setDocuments({[docName]: docsArray});
        setLoading({[docName]:false});
      })
      .catch((err) => {
        console.log("Error getting documents", err);
        setLoading({[docName]:false});
      });
  };

  console.log(locations);

  // FinanceTracker return
  return (
    <>
      <UploadCSVToDatabase db={firestore}/>
      {loading ? (
        <p>Loading...</p>
      ) : (
        locations.map((location) => (
          <div key={location.id}>
            <button>{location.data().description}</button>
            <ChartsFinancialCharts
              amounts={wallet.filter((entry) => entry.bank === location.id)}
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
