import React, { useState } from "react";
import { auth, db, firebase } from '../firebase/firebaseConfig.js';

import Papa from "papaparse";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

export default function UploadCSVToDatabase() {
  const [isDisplayed, setIsDisplayed] = useState(false);

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;

      uploadData(parsedData);

      // setData(parsedData);
    };
    reader.readAsText(file);
  };

  const uploadData = async (data) => {
    console.log(data);
    const bucketsRef = db.collection("savings");
    await data.forEach((entry) =>
      bucketsRef.add({
        amount: Number(entry.amount),
        bank: entry.bank,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        currency: entry.currency,
        date: new Date(entry.date),
        uid: auth.currentUser.uid
      })
    );
  };

  return (
    <div>
      <button className="flex hover:bg-blue-50 justify-start border-2 px-2 py-1 rounded-md m-1" onClick={() => setIsDisplayed(!isDisplayed)}>
        {isDisplayed ? "X" : "Upload Data"}
      </button>
      {isDisplayed && (
        <div className="csv-upload">
          <label htmlFor="csvInput" style={{ display: "block" }}>
            Enter CSV File
          </label>
          <input
            onChange={handleFileChange}
            id="csvInput"
            name="file"
            type="File"
          />
          <button onClick={handleParse} className="csv-parse">
            Parse
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}
