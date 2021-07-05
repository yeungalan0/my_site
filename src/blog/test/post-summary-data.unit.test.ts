import {
  PostSummaryFilterKeys,
  postSummaryQuerySchema,
} from "../../../pages/api/post-summary-data";
import { VALID_TAGS } from "../constants";

describe("postSummaryQuerySchema", () => {
  test("should return true on valid tags", () => {
    const expectedOutput = true;
    const testCase = [VALID_TAGS[0], VALID_TAGS[1], VALID_TAGS[2]];

    const actualOutput = postSummaryQuerySchema[PostSummaryFilterKeys.TAGS](
      testCase
    );

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should return false on invalid tags", () => {
    const expectedOutput = false;
    const testCase = [VALID_TAGS[0], "invalid", VALID_TAGS[2]];

    const actualOutput = postSummaryQuerySchema[PostSummaryFilterKeys.TAGS](
      testCase
    );

    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});
