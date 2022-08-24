import React from "react";

export function AccountPicker({ savings, selected, handleSelectBucket, selectedAccounts }) {

  let uniqueBanks = [...new Set(savings.map(entry => entry.data().bank))];

  return (
    <div className="flex">
      {uniqueBanks.sort().map((bank) => (
        <div key={bank}>
          <button
            onClick={(e) => handleSelectBucket(e, bank)}
            className={`flex text-gray-500 hover:bg-neutral-200 justify-start border-slate-300 border-2 px-2 py-1 rounded-md m-1 ${selectedAccounts[bank] && "bg-blue-200 hover:bg-blue-200"}`}
          >
            {bank}
          </button>
        </div>
      ))}
    </div>
  );
}
