import { Button, TextField } from "@material-ui/core";
import { Dispatch, SetStateAction, useState } from "react";
import { DefaultLayout } from "../src/layout";
import { buildQueryString, getFromApi, QueryParams } from "./api/api-utils";
import {
  PickerFilterKeys,
  pickerQuerySchema,
  VALID_TYPES,
} from "./api/random-picker-api";

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

  console.log("Results: ", placeResults);

  return <p>FOUND!</p>;
}

// TODO
function PickPlace(): JSX.Element {}

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
        [PickerFilterKeys.LOCATION]: [
          `${position.coords.latitude},${position.coords.longitude}`,
        ],
        [PickerFilterKeys.TYPE]: [type],
        [PickerFilterKeys.RADIUS]: [radius],
      };

      if (keyword) queryParams[PickerFilterKeys.KEYWORD] = [keyword];

      // TODO: show loading during the data fetch
      getFromApi<google.maps.places.PlaceResult[]>(
        `/api/random-picker-api?${buildQueryString(queryParams)}`
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
          error={!pickerQuerySchema[PickerFilterKeys.RADIUS]([radius])}
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
            !pickerQuerySchema[PickerFilterKeys.KEYWORD]([keyword])
          }
        ></TextField>
      </div>
      <Button variant="contained" type="submit">
        Pick near me
      </Button>
    </form>
  );
}
