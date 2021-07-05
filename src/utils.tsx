import { Logger, TLogLevelName } from "tslog";

export function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

export async function fetcher(url: string) {
  const res = await fetch(url);

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

export const log: Logger = new Logger({
  minLevel: (process.env.LOG_LEVEL as TLogLevelName) ?? "info",
});
