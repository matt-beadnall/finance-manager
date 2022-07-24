import { getTotals } from "./DataCalculations";

const testData = [
    {
      "uid": "veVFz2ftmRaF72DdQqC44p8f6B92",
      "date": "2019-12-01",
      "bank": "HLGS",
      "amount": "8838.5",
      "currency": "GBP",
      "createdAt": {
        "seconds": 1658244001,
        "nanoseconds": 118000000
      }
    },
    {
      "createdAt": {
        "seconds": 1658243999,
        "nanoseconds": 945000000
      },
      "amount": "2871.57",
      "bank": "HSSI",
      "date": "2019-12-01",
      "uid": "veVFz2ftmRaF72DdQqC44p8f6B92",
      "currency": "GBP"
    },
    {
      "bank": "HLSSI",
      "date": "2019-12-01",
      "amount": "10909.42",
      "currency": "GBP",
      "uid": "veVFz2ftmRaF72DdQqC44p8f6B92",
      "createdAt": {
        "seconds": 1658244000,
        "nanoseconds": 840000000
      }
    }
    ];

test("Tests key group summing functionality for dates", () => {
    expect(getTotals(testData)).toBe("/about-us");
});
