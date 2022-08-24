import React from "react";
import { TotalsChart } from "../Charts/Charts.js";
import { getLastInArray } from "../../functions/arrays/ProcessArray.js";

export function NetWorthDisplay({ totalsData }) {

  let locale = Intl.NumberFormat('en-AU',{
    style: "currency",
    currency: "AUD",
});

  return (<div>
    <h1>{`New Worth: ${locale.format(getLastInArray(totalsData).amount)}`}</h1>
    <TotalsChart data={totalsData}></TotalsChart>
  </div>);
}
