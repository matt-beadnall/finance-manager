import { React, useEffect, useMemo, useState } from "react";
import { STOCK_DATA } from '../../data/SampleData'

import { StockChart } from "../Charts/Charts";
import axios from "axios";

//============================================================================================================================
// API INFO:
// ALPHA VANTAGE
const apiKey = "KZKF9TGFQ4X4CAD9";
const OPEN_VALUE = "1. open";
const HIGH_VALUE = "2. high";
const LOW_VALUE = "3. low";
const CLOSE_VALUE = "4. close";
const VOLUME = "5. volume";
//============================================================================================================================

export default function Investment({ document }) {

  const [showTable, setShowTable] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [stockData, setStockData] = useState(STOCK_DATA);

  const TIME_SERIES_INTRADAY = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${document.ticker}&interval=5min&apikey=${apiKey}`;
  useEffect(() => {
    // N.B.DISABLE TO SAVE API CALLS. Will Fall back to TEST_DATA.
    // Need to limit this to only querying maximum every 15 mins
    // fetchStockData(TIME_SERIES_INTRADAY, setStockData);
  }, [TIME_SERIES_INTRADAY]);

  const convertData = (data) => {
    const array = [];
    data.forEach(([key, value]) =>
      array.push(
        [(new Date(key)).getTime(), [Number(value[OPEN_VALUE]), Number(value[HIGH_VALUE]), Number(value[LOW_VALUE]), Number(value[CLOSE_VALUE])]])
    );
    return array;
  };


  const fetchStockData = (axiosUrl, setter) => {
    const time = Date.now();
    console.log(`${time} - Axios request: ${axiosUrl}`)
    axios.get(axiosUrl)
    .then((response) => {
      console.log(`${time} - Axios request successful!`)
      setter(response.data);
    })
    .catch((error) => {console.log(error)});
  }


  const timeSeries = Object.entries(stockData["Time Series (5min)"]);
  const convertedTimeSeries = useMemo(() => convertData(timeSeries), [document])

  return (
    <>
      <h3>{document.ticker}</h3>
      <StockChart  visible={showChart} setVisible={setShowChart} data={convertedTimeSeries} />
      {/* Show stocks held breakdown (date invested and amount). From this work out current amount and % change (Daily, All time) */}
      <TimeSeriesData visible={showTable} setVisible={setShowTable} data={timeSeries} />
    </>
  );
}

/**
 * 
 * @param visible boolean which controls visibility of the table
 * @param timeSeries data to display
 * @returns 
 */
function TimeSeriesData({ visible, setVisible, data }) {
  return (
    <>
      <button className="visibility-button" onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'} Data</button>
      <div style={{ display: visible ? "block" : "none" }}>
        {data.map(([key, value]) => (
          <table key={key}>
            <thead>
              <tr>
                <th>time</th>
                <th>open</th>
                <th>high</th>
                <th>low</th>
                <th>close</th>
                <th>volume</th>
              </tr>
            </thead>
            <tbody>
              <tr key={key}>
                <td>{key}</td>
                <td>{value[OPEN_VALUE]}</td>
                <td>{value[HIGH_VALUE]}</td>
                <td>{value[LOW_VALUE]}</td>
                <td>{value[CLOSE_VALUE]}</td>
                <td>{value[VOLUME]}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </>
  );

}
  
