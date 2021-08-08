import { Typography } from "@material-ui/core";
import { ClipLoader } from "react-spinners";

export function HandleLoading({
  isLoading,
  errorMessage,
  children,
}: {
  isLoading: boolean;
  errorMessage: string;
  children: JSX.Element;
}): JSX.Element {
  if (isLoading) {
    return <ClipLoader />;
  } else if (errorMessage) {
    return (
      <>
        <Typography variant="h5" component="h2">
          ERROR loading component
        </Typography>
        <Typography variant="body2" component="p">
          <b>please send the below error details to the site administrator:</b>
          <br />
          {errorMessage}
        </Typography>
      </>
    );
  } else {
    return children;
  }
}
