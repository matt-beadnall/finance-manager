import {
  CartesianGrid,
  Legend,
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
export function StandardChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      {/* <XAxis dataKey="date" tickFormatter={formatXAxis} /> */}
      <XAxis dataKey="date" tickFormatter={formatXAxis} />
      <YAxis />
      <CartesianGrid stroke="#eee" />
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      <Tooltip />
      <Legend />
    </LineChart>
  );
}

/**
 * Made from recharts @LineChart
 */
export function TotalsChart({ data }) {
  return (
    <LineChart width={800} height={300} data={data}>
      {/* <XAxis dataKey="date" tickFormatter={formatXAxis} /> */}
      <XAxis dataKey="date" tickFormatter={formatXAxis} />
      <YAxis />
      <CartesianGrid stroke="#eee" />
      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      <Tooltip />
      <Legend />
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
