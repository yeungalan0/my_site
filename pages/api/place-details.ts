import {
  Place,
  PlaceDetailsRequest,
} from "@googlemaps/google-maps-services-js";
import { NextApiRequest, NextApiResponse } from "next";
import { log } from "../../src/utils";
import {
  getQueryParams,
  googleMapsClient,
  QueryParams,
  schema,
  validateQuery,
} from "./api-utils";

export enum DetailsFilterKeys {
  PLACE_ID = "place_id",
  FIELDS = "fields",
}
export const REQUIRED_KEYS = [DetailsFilterKeys.PLACE_ID];

const detailsQuerySchema: schema = {
  [DetailsFilterKeys.PLACE_ID]: (value: string[]) => {
    return value.length === 1;
  },

  [DetailsFilterKeys.FIELDS]: (value: string[]) => true,
};

export default async function getPlaceDetailsApi(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const queryParams: QueryParams = getQueryParams(req.query);

  const errors = validateQuery(queryParams, detailsQuerySchema, REQUIRED_KEYS);

  log.debug(
    `getPlaceDetailsApi - query params: ${JSON.stringify(queryParams)}`
  );

  if (errors.length > 0) {
    res.statusCode = 400; // Note: tested, order for this is important
    res.json(errors.map((error) => error.message));
  } else {
    const placeResult = await getPlaceDetails(queryParams);
    res.statusCode = 200;
    res.json(placeResult);
  }
}

async function getPlaceDetails(queryParams: QueryParams): Promise<Place> {
  const placeId = queryParams[DetailsFilterKeys.PLACE_ID][0];
  const fields = queryParams[DetailsFilterKeys.FIELDS]?.[0].split(",");

  const request: PlaceDetailsRequest = {
    params: {
      place_id: placeId,
      fields: fields,
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  };

  if (process.env.GOOGLE_MAPS_DETAILS_API_ENDPOINT) {
    request.url = process.env.GOOGLE_MAPS_DETAILS_API_ENDPOINT;
  }

  return await googleMapsClient
    .placeDetails(request)
    .then((r) => r.data.result);
}
