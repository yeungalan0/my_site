// eslint-disable-next-line @typescript-eslint/ban-types
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export async function fetcher(
  url: string,
  requestInit: RequestInit | undefined
): Promise<unknown> {
  const res = await fetch(url, requestInit);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    // Attach extra info to the error object.
    const info = await res.json();

    const error = new Error(
      `An error occurred while fetching the data. Status: ${res.status}, Message: ${info}`
    );

    throw error;
  }

  console.log(`STATUS: ${res.status}`);

  return res.json();
}
