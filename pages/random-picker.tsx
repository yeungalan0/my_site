import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DefaultLayout } from "../src/layout";
import { buildQueryString, getFromApi, QueryParams } from "./api/api-utils";
import {
  NearbyFilterKeys,
  nearbyQuerySchema,
  VALID_TYPES,
} from "./api/places-nearby";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { DetailsFilterKeys } from "./api/place-details";
import { Place } from "@googlemaps/google-maps-services-js";
import { HandleLoading } from "../src/components";

export default function RandomPicker(): JSX.Element {
  return (
    <DefaultLayout head={"random-picker"} title={"Random Picker"}>
      <Content />
    </DefaultLayout>
  );
}

function Content(): JSX.Element {
  const [placeResults, setPlaceResults] = useState<
    google.maps.places.PlaceResult[] | null
  >(null);

  if (placeResults === null) {
    return (
      <UserInputNeeded setPlaceResults={setPlaceResults}></UserInputNeeded>
    );
  }

  const randomPick = Math.floor(Math.random() * placeResults.length);

  return (
    <PickPlace placeResults={placeResults} randomPick={randomPick}></PickPlace>
  );
}

function PickPlace({
  placeResults,
  randomPick,
}: {
  placeResults: google.maps.places.PlaceResult[];
  randomPick: number;
}): JSX.Element {
  const [
    currentPlace,
    setCurrentPlace,
  ] = useState<google.maps.places.PlaceResult>(placeResults[randomPick]);

  return (
    <>
      <PickPlaceCarousel
        randomPick={randomPick}
        placeResults={placeResults}
        setCurrentPlace={setCurrentPlace}
      ></PickPlaceCarousel>
      <DisplayPlace currentPlace={currentPlace}></DisplayPlace>
      <DisplayDetails currentPlace={currentPlace} />
    </>
  );
}

function DisplayPlace({
  currentPlace,
}: {
  currentPlace: google.maps.places.PlaceResult;
}): JSX.Element {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {currentPlace.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Rating: {currentPlace.rating}, Review #:{" "}
          {currentPlace.user_ratings_total}
        </Typography>
        <Typography color="textSecondary">{currentPlace.vicinity}</Typography>
        <Typography variant="body2" component="p">
          Tags: {currentPlace.types?.join(", ")}
        </Typography>
        <Typography variant="body2" component="p">
          Open now: {`${currentPlace.opening_hours?.open_now}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

function DisplayDetails({
  currentPlace,
}: {
  currentPlace: google.maps.places.PlaceResult;
}): JSX.Element {
  const [placeDetails, setPlaceDetails] = useState<Place>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { promiseInProgress } = usePromiseTracker({
    area: "place-details-area",
  });

  useEffect(() => {
    const queryParams: QueryParams = {
      [DetailsFilterKeys.PLACE_ID]: [currentPlace.place_id!],
      [DetailsFilterKeys.FIELDS]: [
        "formatted_phone_number,opening_hours,website,utc_offset",
      ],
    };

    trackPromise(
      getFromApi<Place>(`/api/place-details?${buildQueryString(queryParams)}`)
        .then((_placeDetails) => {
          setErrorMessage("");
          setPlaceDetails(_placeDetails);
        })
        .catch((error) => {
          setErrorMessage(JSON.stringify(error));
        }),
      "place-details-area"
    );
  }, [currentPlace]);

  return (
    <Card>
      <CardContent>
        <HandleLoading
          isLoading={promiseInProgress}
          errorMessage={errorMessage}
        >
          <>
            <Typography variant="h5" component="h2">
              Open Now: {`${placeDetails?.opening_hours?.open_now}`}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {/* TODO: would be nice to highlight todays date */}
              Hours of operation:
              <ul>
                {placeDetails?.opening_hours?.weekday_text?.map(
                  (hours, index) => (
                    <li key={index}>{hours}</li>
                  )
                )}
              </ul>
            </Typography>
            <Typography variant="body2" component="p">
              {placeDetails?.website}
            </Typography>
            <Typography variant="body2" component="p">
              {placeDetails?.formatted_phone_number}
            </Typography>
          </>
        </HandleLoading>
      </CardContent>
    </Card>
  );
}

function PickPlaceCarousel({
  randomPick,
  placeResults,
  setCurrentPlace,
}: {
  randomPick: number;
  placeResults: google.maps.places.PlaceResult[];
  setCurrentPlace: Dispatch<SetStateAction<google.maps.places.PlaceResult>>;
}): JSX.Element {
  return (
    // Only need autoPlay and interval set until this bug is fixed: https://github.com/leandrowd/react-responsive-carousel/issues/621
    <Carousel
      showThumbs={false}
      autoPlay={false}
      interval={9000000}
      centerMode={true}
      centerSlidePercentage={80}
      emulateTouch={true}
      infiniteLoop={true}
      selectedItem={randomPick}
      onChange={(index, _) => {
        setCurrentPlace(placeResults[index]);
      }}
      showIndicators={true} // TODO: Depend on screen size/mobile
    >
      {placeResults.map((placeResult) => (
        <Card
          key={placeResult.place_id}
          style={{
            // border: "solid 1px",
            // backgroundColor: "orange",
            height: "10vh",
            minHeight: "50px",
            maxHeight: "60px",
            marginTop: "10px",
            marginBottom: "40px",
            marginRight: "10px", // TODO: Depend on screen size
          }}
        >
          <CardContent>
            <Typography>
              <b>{placeResult.name}</b>
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Carousel>
  );
}

function UserInputNeeded({
  setPlaceResults,
}: {
  setPlaceResults: Dispatch<
    SetStateAction<google.maps.places.PlaceResult[] | null>
  >;
}): JSX.Element {
  const [type, setType] = useState(VALID_TYPES[0]);
  const [radius, setRadius] = useState("10000");
  const [keyword, setKeyword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!navigator.geolocation) {
      console.log(
        "Geolocation is not supported for this Browser/OS. App features will not work as expected :("
      );
      alert(
        "Geolocation is not supported for this Browser/OS. App features will not work as expected :("
      );
      return;
    }

    const geoSuccess: PositionCallback = (position: GeolocationPosition) => {
      const queryParams: QueryParams = {
        [NearbyFilterKeys.LOCATION]: [
          `${position.coords.latitude},${position.coords.longitude}`,
        ],
        [NearbyFilterKeys.TYPE]: [type],
        [NearbyFilterKeys.RADIUS]: [radius],
      };

      if (keyword) queryParams[NearbyFilterKeys.KEYWORD] = [keyword];

      // TODO: show loading during the data fetch
      getFromApi<google.maps.places.PlaceResult[]>(
        `/api/places-nearby?${buildQueryString(queryParams)}`
      ).then((placeResults) => {
        setPlaceResults(placeResults);
      });
    };

    const geoError: PositionErrorCallback = (error) => {
      console.log(`ERROR: ${error.message}, Code: ${error.code}`);

      if (error.code === 1) {
        alert(
          "Permission to use location denied. App features will not work as expected :("
        );
      }
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select value={type} inputProps={{ readOnly: true }}>
          {VALID_TYPES.map((valid_type) => (
            <MenuItem key={valid_type} value={valid_type}>
            </MenuItem>
          ))}
        </Select> */}
      <div>
        <TextField
          label="Radius"
          helperText="Enter value between 0 - 50000"
          defaultValue={radius}
          onChange={(event) => setRadius(event.target.value)}
          error={!nearbyQuerySchema[NearbyFilterKeys.RADIUS]([radius])}
          required={true}
        ></TextField>
      </div>
      <div>
        <TextField
          label="Keyword"
          helperText="Ex: 'Chinese', 'ice cream', 'drinks'"
          onChange={(event) => setKeyword(event.target.value)}
          error={
            keyword !== "" &&
            !nearbyQuerySchema[NearbyFilterKeys.KEYWORD]([keyword])
          }
        ></TextField>
      </div>
      <Button variant="contained" type="submit">
        Pick near me
      </Button>
    </form>
  );
}
