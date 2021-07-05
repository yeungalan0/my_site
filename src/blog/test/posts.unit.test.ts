import { QueryParams } from "../../../pages/api/api-utils";
import { testables, PostData } from "../lib/posts";

const { applyFilters, getSnippet } = testables;

describe("applyFilters", () => {
  const fakePostsData: PostData[] = [
    {
      id: "test1",
      title: "test1",
      date: "test1",
      tags: ["finance", "values", "test"],
      contentMarkdown: "test1",
    },
    {
      id: "test2",
      title: "test2",
      date: "test2",
      tags: ["testing"],
      contentMarkdown: "test2",
    },
    {
      id: "test3",
      title: "test3",
      date: "test3",
      tags: ["values", "finance", "tech"],
      contentMarkdown: "test3",
    },
    {
      id: "test4",
      title: "test4",
      date: "test4",
      tags: ["test"],
      contentMarkdown: "test4",
    },
  ];
  test("should correctly filter single tags", () => {
    const fakeQueryParams: QueryParams = {
      test: ["a"],
      tags: ["test"],
    };
    const expectedOutput = [fakePostsData[0], fakePostsData[3]];

    const actualOutput = applyFilters(fakePostsData, fakeQueryParams);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should correctly filter multiple tags", () => {
    const fakeQueryParams: QueryParams = {
      test: ["a"],
      tags: ["values", "finance"],
    };
    const expectedOutput = [fakePostsData[0], fakePostsData[2]];

    const actualOutput = applyFilters(fakePostsData, fakeQueryParams);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });

  test("should correctly filter multiple tags with no results", () => {
    const fakeQueryParams: QueryParams = {
      tags: ["values", "testing"],
    };
    const expectedOutput: PostData[] = [];

    const actualOutput = applyFilters(fakePostsData, fakeQueryParams);

    expect(actualOutput).toStrictEqual(expectedOutput);
  });
});

describe("getSnippet", () => {
  const testText = "This is the test string. Let's see if snippets work.";

  test("should return whole string if less than charLimit", () => {
    const expectedOutput = testText;

    const actualOutput = getSnippet(testText, 100);

    expect(actualOutput).toBe(expectedOutput);
  });

  test("should return string snippet if more than charLimit", () => {
    const expectedOutput = "This is the test string....";

    const actualOutput = getSnippet(testText, 20);

    expect(actualOutput).toBe(expectedOutput);
  });
});
