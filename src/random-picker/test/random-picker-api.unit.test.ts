import {
  PickerFilterKeys,
  pickerQuerySchema,
} from "../../../pages/api/random-picker-api";

describe("pickerQuerySchema", () => {
  it.each([
    [["-33.8670522,151.1957362"], true],
    [["-160.8670522,151.1957362"], false],
    [["-33.8670522,190.1957362"], false],
    [["-33.8670522,151.1957362", "-33.8670522,151.1957362"], false],
    [["-33.8670522,151.1957362,1234"], false],
    [["thisShouldFail,thisShouldFail"], false],
  ])(
    "location tests - input: %s, expected out: %s",
    (testCase, expectedOutput) => {
      const actualOutput = pickerQuerySchema[PickerFilterKeys.LOCATION](
        testCase
      );

      expect(actualOutput).toStrictEqual(expectedOutput);
    }
  );

  it.each([
    [["restaurant"], true],
    [["restarant"], false],
    [[""], false],
    [["123"], false],
  ])("type tests - input: %s, expected out: %s", (testCase, expectedOutput) => {
    const actualOutput = pickerQuerySchema[PickerFilterKeys.TYPE](testCase);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  it.each([
    [["45000"], true],
    [["233"], true],
    [["0"], true],
    [["50000"], true],
    [["test"], false],
    [["-1"], false],
    [["55000"], false],
  ])(
    "radius tests - input: %s, expected out: %s",
    (testCase, expectedOutput) => {
      const actualOutput = pickerQuerySchema[PickerFilterKeys.RADIUS](testCase);

      expect(actualOutput).toStrictEqual(expectedOutput);
    }
  );
});
