import makeStyles from "@mui/styles/makeStyles";
import { darkTheme as theme } from "../../theme";

const postStyles = makeStyles(() => ({
  date: {
    paddingBottom: theme.spacing(2),
  },
}));

const blogStyles = makeStyles(() => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  postList: {
    paddingBottom: theme.spacing(3),
  },
}));

export { postStyles, blogStyles };
