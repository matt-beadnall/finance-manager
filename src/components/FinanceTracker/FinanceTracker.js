import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";

import FinanceBucket from "../Account";
import UploadCSVToDatabase from "../UploadCSVToDatabase";
import { UserLoginStatus } from "../UserLoginStatus";
import { data } from "autoprefixer";

function FinanceTracker() {
  // const savingsRef = db.collection("savings");
  // const query = savingsRef.orderBy("date").limit(200);
  // const [savings] = useCollectionData(query, { idField: "id" });
  const [locations, setLocations] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState("total");
  const [loading, setLoading] = useState({
    savings: false,
    locations: true,
    investments: true,
  });

  // current user information
  const { uid, photoURL } = auth.currentUser;

  useEffect(() => {
    getAllCashLocations();
    fetchAllDocuments("investments");
    fetchAllDocuments("savings");
    setLoading({ locations: false, investments: false });
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
  const fetchAllDocuments = (docName) => {
    const docsRef = db.collection(docName).orderBy("date").limit(200);
    let docsArray = [];
    docsRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          docsArray.push(doc.data());
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

  const handleSelectBucket = (e, location) => {
    e.preventDefault();
    console.log("selectedBucket:", location);
    setSelectedBucket(location);
  };

  const processData = (savings, selectedBucket) => {
    const array = savings;
    array.forEach(
      (data) => {
        try {
          data.date = new Date(data.date.seconds * 1000)
            .toISOString()
            .substring(0, 10);
        } catch (err) {
          // TODO: find out where this error is occuring
          console.log("ERROR", err);
        }
      }
      // console.log("Data",new Date(data.date.seconds*1000).toISOString())
    );
    return array
      .filter(
        (entry) => entry.bank === selectedBucket || selectedBucket === "total"
      )
      .sort((a, b) => a.date.seconds - b.date.seconds);
  };

  return (
    <>
      {/* <UserLoginStatus auth={auth} /> */}
      <UploadCSVToDatabase />
      <div className="flex">
        {locations.map((location) => (
          <div key={location.id}>
            <button
              onClick={(e) => handleSelectBucket(e, location.id)}
              className={`flex hover:bg-red-50 justify-start border-2 px-2 py-1 rounded-md m-1 ${
                selectedBucket === location.id &&
                "bg-orange-200 hover:bg-orange-200"
              }`}
            >
              {location.id === "total" ? "Total" : location.data().description}
            </button>
          </div>
        ))}
      </div>
      {[{ id: "total" }, ...locations].map((location) => (
        <FinanceBucket
          key={location.id}
          savings={processData(savings, selectedBucket)}
          investments={investments}
          selectedBucket={selectedBucket}
          bank={location.id}
        />
      ))}
    </>
  );
}

export default FinanceTracker;
