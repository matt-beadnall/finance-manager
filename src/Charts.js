import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import React from 'react';

// const formatXAxis = (tickItem) => {
//     console.log({tickItem})
//     return new Date(tickItem.seconds * 1000).toLocaleDateString();
//   }

export function StandardChart(props) {

    return (
        <LineChart width={500} height={300} data={props.data}>
        {/* <XAxis dataKey="date" tickFormatter={formatXAxis} /> */}
        <XAxis dataKey="date" />
        <YAxis/>
        <CartesianGrid stroke="#eee"/>
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        <Tooltip />
        <Legend />
      </LineChart>
    )
}