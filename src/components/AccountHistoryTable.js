import React from "react";

export function AccountHistoryTable({ index, selectedBank, savings, handleDelete }) {
  return (
    <div
      className={`relative float-left w-full`}
    >
      <h1>{selectedBank}</h1>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden"></div>
            <form>
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Currency
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Notes
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {getTableRows(savings, selectedBank, handleDelete)}
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTableRows(savings, selectedBank, handleDelete) {
  return savings &&
    savings
      .reverse()
      .filter((record) => record.data().bank === selectedBank)
      .map((record, i) => (
        <tr
          key={i}
          className={`${i % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b`}
        >
          <td>{record.data().amount}</td>
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
      ));
}

