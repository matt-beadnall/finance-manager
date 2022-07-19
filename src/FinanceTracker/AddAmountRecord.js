import React from "react";

export function AddAmountRecord() {
  const [visible, setVisible] = React.useState(false);

  const handleAddAmount = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        className="bg-stone-400 hover:bg-stone-500 text-white py-1 px-2 rounded"
      >
        Add Amount
      </button>
      {
        <div style={{ display: visible ? "block" : "none" }}>
          <form>
            <input type="text" placeholder="Amount" />
            <input type="text" placeholder="Date" />
            <input type="text" placeholder="Note" />
          </form>
        </div>
      }
    </>
  );
}
