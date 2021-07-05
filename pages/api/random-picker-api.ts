import { NextApiRequest, NextApiResponse } from "next";
import { log } from "../../src/utils";
import {
  getFromApi,
  getQueryParams,
  QueryParams,
  schema,
  validateQuery,
} from "./api-utils";

export enum PickerFilterKeys {
  LOCATION = "location",
  TYPE = "type",
  RADIUS = "radius",
  KEYWORD = "keyword",
}

const RADIUS_UPPER_LIMIT = 50000;
const RADIUS_LOWER_LIMIT = 0;
const ALLOWED_TYPES = ["restaurant"];
const REQUIRED_KEYS = [PickerFilterKeys.LOCATION, PickerFilterKeys.TYPE];

export const pickerQuerySchema: schema = {
  [PickerFilterKeys.LOCATION]: (value: string[]) => {
    const latAndLong = value[0].split(",");
    if (value.length !== 1 || latAndLong.length !== 2) return false;

    const isLatitude = (lat: string) => isFinite(+lat) && Math.abs(+lat) <= 90;
    const isLongitude = (lng: string) =>
      isFinite(+lng) && Math.abs(+lng) <= 180;

    return isLatitude(latAndLong[0]) && isLongitude(latAndLong[1]);
  },

  [PickerFilterKeys.TYPE]: (value: string[]) => {
    if (value.length !== 1) return false;

    return ALLOWED_TYPES.includes(value[0]);
  },

  [PickerFilterKeys.RADIUS]: (value: string[]) => {
    if (value.length !== 1) return false;

    const radius = +value[0];
    return RADIUS_LOWER_LIMIT <= radius && radius <= RADIUS_UPPER_LIMIT;
  },

  [PickerFilterKeys.KEYWORD]: (value: string[]) =>
    value.length == 1 && value[0].length > 0,
};

export default async function getNearbyPlacesApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const queryParams: QueryParams = getQueryParams(req.query);

  const errors = validateQuery(queryParams, pickerQuerySchema, REQUIRED_KEYS);

  log.debug(`query params: ${JSON.stringify(queryParams)}`);

  if (errors.length > 0) {
    res.statusCode = 400; // Note: tested, order for this is important
    res.json(errors.map((error) => error.message));
  } else {
    const placeResult = await getNearbyPlaces(queryParams);
    res.statusCode = 200;
    res.json(placeResult);
  }
}

async function getNearbyPlaces(queryParams: QueryParams) {
  const location = queryParams[PickerFilterKeys.LOCATION][0];
  const type = queryParams[PickerFilterKeys.TYPE][0];
  const radius = queryParams[PickerFilterKeys.RADIUS]?.[0];
  const keyword = queryParams[PickerFilterKeys.KEYWORD]?.[0];

  const url = new URL(process.env.GOOGLE_MAPS_API_ENDPOINT!);
  url.searchParams.append("location", location);
  url.searchParams.append("type", type);
  url.searchParams.append("key", process.env.GOOGLE_MAPS_API_KEY!);

  if (radius !== undefined) url.searchParams.append("radius", radius);
  if (keyword !== undefined) url.searchParams.append("keyword", keyword);

  return await getFromApi<google.maps.places.PlaceResult>(url.toString());
}
