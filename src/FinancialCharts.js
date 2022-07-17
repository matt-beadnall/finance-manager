import React from "react";
import { StandardChart } from "./Charts";

/**
 * Logic only for the read-only display of charts
 *
 * TODO
 * 1. Add in the ability to change the frequecy displayed
 * @param {*} param0
 * @returns
 */

export function ChartsFinancialCharts({ amounts, bank }) {
  return (
    <div>
      <h3>{bank.description}</h3>
      <p>{`Current value: ${amounts[amounts.length - 1].amount}`}</p>

      <StandardChart data={amounts} />
      {/* <table>
              <thead>
                <tr>
                  <th>amount</th>
                  <th>bank</th>
                  <th>currency</th>
                  <th>date</th>
                </tr>
              </thead>
              <tbody>
                {amounts &&
                  amounts.map((row, i) => (
                    <tr key={i}>
                      <td>{row.amount}</td>
                      <td>{row.bank}</td>
                      <td>{row.currency}</td>
                      <td>{row.date.seconds}</td>
                    </tr>
                  ))}
              </tbody>
            </table> */}
    </div>
  );
}
