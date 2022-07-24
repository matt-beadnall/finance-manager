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
        className="bg-white hover:bg-neutral-100 text-gray-500 border-2 py-1 px-2 rounded m-1"
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
