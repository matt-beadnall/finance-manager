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

export function StandardChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      {/* <XAxis dataKey="date" tickFormatter={formatXAxis} /> */}
      <XAxis dataKey="date" />
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
      data: data
    }
  ];
  return (
    <>
      <button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'} Chart</button>
      <Chart style={{ display: visible ? "block" : "none" }} options={options} series={series} type="candlestick" width="600px" />
    </>
  );
}
