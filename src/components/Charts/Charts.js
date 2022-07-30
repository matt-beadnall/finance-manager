import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";
import React from "react";
import moment from "moment";

function formatXAxis(tickItem) {
  return moment(tickItem).format("MMM-yy");
}

/**
 * Made from recharts @LineChart
 */
export function StandardChart({ data, selectedAccounts }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="date" tickFormatter={formatXAxis} />
      <YAxis />
      <CartesianGrid stroke="#eee" />
      {Object.entries(selectedAccounts).map((account,i) => 
        <Line key={i} style={{ display: account[1] ? "block" : "none" }}  type="monotone" dataKey={account[0]} stroke="#8884d8" />
      )}
      <Tooltip />
    </LineChart>
  );
}

/**
 *
 */
export function TotalsChart({ data }) {
  return (
    <LineChart margin={0} width={800} height={200} data={data}>
      <XAxis dataKey="date" padding={0} tickFormatter={formatXAxis} tickMargin="0" tick={false} />
      <YAxis tick={false} domain={["dataMin", "domainMax"]} />
      <CartesianGrid stroke="#fff" />
      <Line dataKey="amount" stroke="#82ca9d" />
      <Tooltip />
    </LineChart>
  );
}

export function StockChart({ visible, setVisible, data }) {
  const options = {
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
  };

  const series = [
    {
      data: data,
    },
  ];
  return (
    <>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "Hide" : "Show"} Chart
      </button>
      <Chart
        style={{ display: visible ? "block" : "none" }}
        options={options}
        series={series}
        type="candlestick"
        width="600px"
      />
    </>
  );
}
