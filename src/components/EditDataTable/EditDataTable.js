import React from "react";

export function EditDataTable({ savings, handleDelete }) {

  let uniqueBanks = [...new Set(savings.map(entry => entry.data().bank))];
  console.log(uniqueBanks)

  return (
    uniqueBanks.map(bank => (
      <>
      <h1>hello</h1>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden"></div>
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Amount</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Bank</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Currency</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Date</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Notes</th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {
                  <tr className={'bg-green-100 border-b'}>
                  <td>amount</td>
                  <td>bank</td>
                  <td>curr</td>
                  <td>date</td>
                  <td>noes</td>
                  <td>
                    <button
                      className="text-gray-500 hover:bg-blue-50 justify-start border-2 px-2 rounded-md m-1"
                    >
                      delete
                    </button>
                  </td>
                </tr>
                }
                {savings &&
                  savings.reverse().filter(record => record.data().bank === bank).map((record, i) => (
                    <tr key={record.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b`}>
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
      </div>
      </>
    ))

  );
}
