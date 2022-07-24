  /**
   * Takes an arbitrary array, and sums for distinct values
   * N.b. this could be more general by being able to provide the key we sum over
   * @param {*} savings
   */
   export function getTotals() {
    return (savings) => {
      var result = [];
      savings.reduce((res, value) => {
        if (!res[value.data]) {
          res[value.Id] = { Id: value.Id, qty: 0 };
          result.push(res[value.Id]);
        }
        res[value.Id].qty += value.qty;
        return res;
      }, {});
    };
  }