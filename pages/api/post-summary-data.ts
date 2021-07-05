// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { VALID_TAGS } from "../../src/blog/constants";
import { getSortedPostsSummaryData } from "../../src/blog/lib/posts";
import { getQueryParams, QueryParams, schema, validateQuery } from "./api-utils";

export enum PostSummaryFilterKeys {
  TAGS = "tags",
}

export const postSummaryQuerySchema: schema = {
  [PostSummaryFilterKeys.TAGS]: (value: string[]) => {
    const isValidTag = (tag: string) => VALID_TAGS.includes(tag);
    return value.every(isValidTag);
  },
};

export default async function getPostSummaryData(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const queryParams: QueryParams = getQueryParams(req.query);

  const errors = validateQuery(queryParams, postSummaryQuerySchema);

  if (errors.length > 0) {
    res.statusCode = 400; // Note: tested, order for this is important
    res.json(errors.map((error) => error.message));
  } else {
    const sortedPostsData = await getSortedPostsSummaryData(queryParams);
    res.statusCode = 200;
    res.json(sortedPostsData);
  }
}
