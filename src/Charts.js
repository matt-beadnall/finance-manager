import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import React from 'react';

// const formatXAxis = (tickItem) => {
//     console.log({tickItem})
//     return new Date(tickItem.seconds * 1000).toLocaleDateString();
//   }

const formatXAxis = (data) =>{
    console.log(data)
    data.seconds.toDate().toString();
}

export function StandardChart({data}) {

    return (
        <LineChart width={500} height={300} data={data}>
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