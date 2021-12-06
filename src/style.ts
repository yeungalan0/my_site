import { makeStyles } from "@material-ui/core";
import { darkTheme as theme } from "./theme";

const useStyles = makeStyles(() => ({
  topic: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    "&:hover": {
      color: theme.palette.text.primary,
      textDecoration: "underline",
    },
  },
  toolbar: {
    justifyContent: "space-evenly",
  },
  title: {
    padding: theme.spacing(3),
  },
  contentGrid: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  paragraph: {
    "& p": {
      lineHeight: 2,
    },
  },
  myImage: {
    maxWidth: "300px",
    height: "auto",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "20%",
  },
  siteIconButton: {
    marginLeft: "1.5em",
    marginRight: "1.5em",
    "& svg": {
      fontSize: "2.5em",
    },
  },
}));

export { useStyles };
