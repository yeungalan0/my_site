import { NextApiRequest, NextApiResponse } from "next";
import { log } from "../../src/utils";
import {
  getQueryParams,
  googleMapsClient,
  QueryParams,
  schema,
  validateQuery,
} from "./api-utils";
import {
  LatLng,
  Place,
  PlacesNearbyRequest,
} from "@googlemaps/google-maps-services-js";

export enum NearbyFilterKeys {
  LOCATION = "location",
  TYPE = "type",
  RADIUS = "radius",
  KEYWORD = "keyword",
}

const RADIUS_UPPER_LIMIT = 50000;
const RADIUS_LOWER_LIMIT = 0;
export const VALID_TYPES = ["restaurant"];
export const REQUIRED_KEYS = [NearbyFilterKeys.LOCATION, NearbyFilterKeys.TYPE];

export const nearbyQuerySchema: schema = {
  [NearbyFilterKeys.LOCATION]: (value: string[]) => {
    const latAndLong = value[0].split(",");
    if (value.length !== 1 || latAndLong.length !== 2) return false;

    const isLatitude = (lat: string) => isFinite(+lat) && Math.abs(+lat) <= 90;
    const isLongitude = (lng: string) =>
      isFinite(+lng) && Math.abs(+lng) <= 180;

    return isLatitude(latAndLong[0]) && isLongitude(latAndLong[1]);
  },

  [NearbyFilterKeys.TYPE]: (value: string[]) => {
    if (value.length !== 1) return false;

    return VALID_TYPES.includes(value[0]);
  },

  [NearbyFilterKeys.RADIUS]: (value: string[]) => {
    if (value.length !== 1) return false;

    const radius = +value[0];
    return RADIUS_LOWER_LIMIT <= radius && radius <= RADIUS_UPPER_LIMIT;
  },

  [NearbyFilterKeys.KEYWORD]: (value: string[]) =>
    value.length == 1 && value[0].length > 0,
};

export default async function getNearbyPlacesApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const queryParams: QueryParams = getQueryParams(req.query);

  const errors = validateQuery(queryParams, nearbyQuerySchema, REQUIRED_KEYS);

  log.debug(
    `getNearbyPlacesApi - query params: ${JSON.stringify(queryParams)}`
  );

  if (errors.length > 0) {
    res.statusCode = 400; // Note: tested, order for this is important
    res.json(errors.map((error) => error.message));
  } else {
    const placeResult = await getNearbyPlaces(queryParams);
    res.statusCode = 200;
    res.json(placeResult);
  }
}

async function getNearbyPlaces(queryParams: QueryParams): Promise<Place[]> {
  const location: LatLng = queryParams[NearbyFilterKeys.LOCATION][0];
  const type = queryParams[NearbyFilterKeys.TYPE][0];
  const radius = Number(queryParams[NearbyFilterKeys.RADIUS]?.[0]) || undefined;
  const keyword = queryParams[NearbyFilterKeys.KEYWORD]?.[0];

  const request: PlacesNearbyRequest = {
    params: {
      location: location as LatLng,
      type: type,
      radius: radius,
      keyword: keyword,
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  };

  if (process.env.GOOGLE_MAPS_NEARBY_API_ENDPOINT) {
    request.url = process.env.GOOGLE_MAPS_NEARBY_API_ENDPOINT;
  }

  return await googleMapsClient
    .placesNearby(request)
    .then((r) => r.data.results);
}
