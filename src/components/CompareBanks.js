import React from "react";

export function CompareBanks({ compare, setComparisonMode }) {
  return (<div className="flex">
    <button className={`text-gray-500 hover:bg-blue-50 justify-start border-2 px-2 py-1 rounded-md m-1 ${compare && "bg-blue-300 hover:bg-blue-200"}`} onClick={setComparisonMode}>
      Compare
    </button>
    {compare && <p className="text-gray-200">Multiple accounts can be selected</p>}
  </div>);
}
