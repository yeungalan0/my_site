import {
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
} from "@material-ui/core";
import { ChangeEvent, useRef, useState } from "react";
import useSWR from "swr";
import { DefaultLayout } from "../src/layout";
import { useStyles } from "../src/style";
import { fetcher } from "../src/utils";
import { buildQueryString, getFromApi, QueryParams } from "./api/api-utils";
import { PickerFilterKeys, VALID_TYPES } from "./api/random-picker-api";

export default function About(): JSX.Element {
  const classes = useStyles();
  const [type, setType] = useState(VALID_TYPES[0]);
  const radiusInput = useRef<HTMLInputElement>(null);
  const keywordInput = useRef<HTMLInputElement>(null);

  // const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
  //   setType(event.target.value as string);
  // };

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
      const radius = radiusInput.current?.value;
      const keyword = keywordInput.current?.value;
      const queryParams: QueryParams = {
        [PickerFilterKeys.LOCATION]: [
          `${position.coords.latitude},${position.coords.longitude}`,
        ],
        [PickerFilterKeys.TYPE]: [type],
      };

      if (radius) queryParams[PickerFilterKeys.RADIUS] = [radius];
      if (keyword) queryParams[PickerFilterKeys.KEYWORD] = [keyword];

      // const { data, error } = useSWR<google.maps.places.PlaceResult[], Error>(
      //   `/api/random-picker?${buildQueryString(queryParams)}`,
      //   fetcher
      // );

      // TODO: Validate query params
      console.log(
        `Query: /api/random-picker-api?${buildQueryString(queryParams)}`
      );

      getFromApi<google.maps.places.PlaceResult[]>(
        `/api/random-picker-api?${buildQueryString(queryParams)}`
      ).then((data) => {
        console.log("We got data: ", data);
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
    <DefaultLayout head={"random-picker"} title={"Random Picker"}>
      <form onSubmit={handleSubmit}>
        {/* <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select value={type} onChange={handleChange}>
          {VALID_TYPES.map((valid_type) => (
            <MenuItem key={valid_type} value={valid_type}>
              {valid_type}
            </MenuItem>
          ))}
        </Select> */}
        <div>
          <TextField
            label="Radius"
            helperText="Enter value between 0 - 50000"
            inputRef={radiusInput}
          ></TextField>
        </div>
        <div>
          <TextField
            label="Keyword"
            helperText="Ex: 'Chinese'"
            inputRef={keywordInput}
          ></TextField>
        </div>
        <Button variant="contained" type="submit">
          Pick near me
        </Button>
      </form>
    </DefaultLayout>
  );
}
