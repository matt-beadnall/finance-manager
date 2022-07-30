import React from "react";

export function AccountPicker({ accounts, e, handleSelectBucket, selectedAccounts }) {
  return (
    <div className="flex">
      {accounts.map((account) => (
        <div key={account.id}>
          <button
            onClick={(e) => handleSelectBucket(e, account.id)}
            className={`flex text-gray-500 hover:bg-neutral-200 justify-start border-slate-300 border-2 px-2 py-1 rounded-md m-1 ${selectedAccounts[account.id] && "bg-blue-200 hover:bg-blue-200"}`}
          >
            {account.id === "total" ? "Total" : account.data().description}
          </button>
        </div>
      ))}
    </div>
  );
}
