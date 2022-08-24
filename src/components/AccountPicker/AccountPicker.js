import { AddNewAccount } from "../AddNewAccount/AddNewAccount";
import Modal from "../../Modal";
import React from "react";

export function AccountPicker({
  accounts,
  savings,
  selected,
  handleSelectBucket,
  selectedAccounts,
}) {
  // let uniqueBanks = [...new Set(savings.map(entry => entry.data().bank))];

  return (
    <div className="flex">
      {accounts.sort().map((account) => (
        <div key={account.code}>
          <button
            onClick={(e) => handleSelectBucket(e, account.code)}
            className={`flex text-gray-500 hover:bg-neutral-200 justify-start border-slate-300 border-2 px-2 py-1 rounded-md m-1 ${
              selectedAccounts[account.code] && "bg-blue-200 hover:bg-blue-200"
            }`}
          >
            {account.company + " " + account.type}
          </button>
        </div>
      ))}
      <Modal title="+" size="lg" index={3}>
        <AddNewAccount />
      </Modal>
    </div>
  );
}
