import {
  PostSummaryFilterKeys,
  postSummaryQuerySchema,
} from "../../pages/api/post-summary-data";
import {
  buildQueryString,
  QueryParams,
  validateQuery,
} from "../../pages/api/api-utils";
import { VALID_TAGS } from "../blog/constants";

describe("validateQuery", () => {
  test("should return no errors on valid query", () => {
    const expectedOutput: Error[] = [];
    const testCase: QueryParams = {
      [PostSummaryFilterKeys.TAGS]: [
        VALID_TAGS[0],
        VALID_TAGS[1],
        VALID_TAGS[2],
      ],
    };

    const actualOutput = validateQuery(testCase, postSummaryQuerySchema);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should return no errors on valid query with requiredKeys", () => {
    const expectedOutput: Error[] = [];
    const testCase: QueryParams = {
      [PostSummaryFilterKeys.TAGS]: [
        VALID_TAGS[0],
        VALID_TAGS[1],
        VALID_TAGS[2],
      ],
    };
    const requiredKeys = [PostSummaryFilterKeys.TAGS];

    const actualOutput = validateQuery(
      testCase,
      postSummaryQuerySchema,
      requiredKeys
    );

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should return errors on invalid query value", () => {
    const expectedErrorNumber = 1;
    const testCase: QueryParams = {
      [PostSummaryFilterKeys.TAGS]: [VALID_TAGS[0], "invalid", VALID_TAGS[2]],
    };

    const actualOutput = validateQuery(testCase, postSummaryQuerySchema);

    expect(actualOutput.length).toStrictEqual(expectedErrorNumber);
  });

  test("should return errors on invalid key value", () => {
    const expectedErrorNumber = 1;
    const testCase: QueryParams = {
      [PostSummaryFilterKeys.TAGS]: [
        VALID_TAGS[0],
        VALID_TAGS[1],
        VALID_TAGS[2],
      ],
      invalid: ["testing"],
    };

    const actualOutput = validateQuery(testCase, postSummaryQuerySchema);

    expect(actualOutput.length).toStrictEqual(expectedErrorNumber);
  });

  test("should return error on query without requiredKey", () => {
    const expectedErrorNumber = 1;
    const testCase: QueryParams = {};
    const requiredKeys = [PostSummaryFilterKeys.TAGS];

    const actualOutput = validateQuery(
      testCase,
      postSummaryQuerySchema,
      requiredKeys
    );

    expect(actualOutput.length).toStrictEqual(expectedErrorNumber);
  });
});

describe("buildQueryString", () => {
  it.each([
    [
      { tags: ["finance", "tech", "values"] },
      "tags=finance&tags=tech&tags=values",
    ],
    [
      {
        location: ["123,456"],
        type: ["restaurant"],
        radius: ["200"],
      },
      "location=123%2C456&type=restaurant&radius=200",
    ],
    [{ foo: ["a", "b", "c"], bar: ["d"] }, "foo=a&foo=b&foo=c&bar=d"],
  ])(
    "buildQueryString tests - input: %s, expected output: %s",
    (testCase, expectedOutput) => {
      const actualOutput = buildQueryString(testCase);

      expect(actualOutput).toStrictEqual(expectedOutput);
    }
  );
});
