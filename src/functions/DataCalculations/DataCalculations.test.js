const getTotals = require("./index");

const testData = {};

test("Returns about-us for english language", () => {
    expect(getTotals("en-US")).toBe("/about-us");
});
