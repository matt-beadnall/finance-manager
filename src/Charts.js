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

export function StockChart({ data }) {
  console.log(data);

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
      <Chart options={options} series={series} type="candlestick" width="80%" />
    </>
    //     <LineChart width={500} height={300} data={data}>
    //     {/* <XAxis dataKey="date" tickFormatter={formatXAxis} /> */}
    //     <XAxis dataKey="date" />
    //     <YAxis type="number" domain={['dataMin', 'dataMax']} />
    //     <CartesianGrid stroke="#eee"/>
    //     <Line type="monotone" dot={false} dataKey="open" stroke="#82ca9d" />
    //     <Line type="monotone" dot={false} dataKey="high" stroke="#f0d08b" />
    //     <Line type="monotone" dot={false} dataKey="low" stroke="#f28ff1" />
    //     <Line type="monotone" dot={false} dataKey="close" stroke="#8ff2ec" />
    //     {/* <Line type="monotone" dataKey="volume" stroke="#82ca9d" /> */}
    //     <Tooltip />
    //     <Legend />
    //   </LineChart>
  );
}
