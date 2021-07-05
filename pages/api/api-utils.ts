import { NextApiRequest } from "next";

export type QueryParams = {
  [key: string]: string[];
};

export function getQueryParams(query: NextApiRequest["query"]): QueryParams {
  const queryParams: QueryParams = {};

  Object.keys(query).forEach((key) => {
    const value: string[] = Array.isArray(query[key])
      ? (query[key] as string[])
      : [query[key] as string];
    queryParams[key] = value;
  });

  return queryParams;
}

/**
 * Schema definition where the key is an expected query key, and the value is
 * a boolean determined by validating the query value
 */
export type schema = {
  [key: string]: (value: string[]) => boolean;
};

/**
 * Ensures the input query only has keys that are validly defined by the schema
 *
 * @param query - The user query string object
 * @param mySchema - The schema to validate against
 * @returns The list of key errors when validating against the schema
 *
 */
export function validateQuery(
  query: QueryParams,
  mySchema: schema,
  requiredKeys?: string[]
): Error[] {
  const queryKeys = Object.keys(query);
  if (
    requiredKeys !== undefined &&
    !requiredKeys.every((rKey) => queryKeys.includes(rKey))
  ) {
    return [
      Error(
        `Missing required key! Required keys: '${requiredKeys}', Detected keys: '${queryKeys}'`
      ),
    ];
  }

  let validKeys = Object.keys(mySchema);

  return queryKeys
    .filter(
      (key) =>
        !Object.values(validKeys).includes(key) || !mySchema[key](query[key])
    )
    .map((key) => new Error(`Key: '${key}' or associated value(s) is invalid`));
}

export async function getFromApi<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}
