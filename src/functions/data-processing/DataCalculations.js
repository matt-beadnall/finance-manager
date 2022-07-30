/**
 * Takes an arbitrary array, and sums for distinct values
 * N.b. this could be more general by being able to provide the key we sum over
 * @param {*} savings
 */
export function getTotals(data) {
  // return (data) => {
  var result = [];
  data.reduce((res, value) => {
    if (!res[value.date]) {
      res[value.date] = { date: value.date, amount: 0 };
      result.push(res[value.date]);
    }
    res[value.date].amount += value.amount;
    return res;
  }, {});
  return result;
}


export function sortData(data) {

  let result = []
  data.reduce((res, value) => {
    if (!res[value.date]) {
      res[value.date] = { date: value.date }; 
      result.push(res[value.date]);
    }
    if(res[value.date][value.bank] === undefined){
      res[value.date][value.bank] = value.amount;
    } else {
      res[value.date][value.bank] +=  value.amount;
    }
    return res;
    }, {});
  return result;
}

