import React from "react";

export function EditDataTable({ savings, handleDelete }) {
  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Bank</th>
              <th>Currency</th>
              <th>Date</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {savings &&
              savings.map((record, i) => (
                <tr key={i}>
                  <td>{record.data().amount}</td>
                  <td>{record.data().bank}</td>
                  <td>{record.data().currency}</td>
                  <td>
                    {new Date(record.data().date.seconds * 1000)
                      .toISOString()
                      .substring(0, 10)}
                  </td>
                  <td>{record.data().notes}</td>
                  <td>
                    <button
                      onClick={(e) => handleDelete(e, record)}
                      className="text-gray-500 hover:bg-blue-50 justify-start border-2 px-2 rounded-md m-1"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
