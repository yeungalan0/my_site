import { Box, IconButton, Tooltip, Typography } from "@material-ui/core";
import { DefaultLayout } from "../src/layout";
import { useStyles } from "../src/style";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ReorderIcon from "@mui/icons-material/Reorder";

export default function About(): JSX.Element {
  const classes = useStyles();

  return (
    <DefaultLayout head={"about"} title={""}>
      <img className={classes.myImage} src="photos/me.jpg" />
      <br />
      <Box className={classes.paragraph}>
        <Typography>
          Hello 👋, my name is Alan, and I like to learn things, and then try
          and use what I learned to make things. Most of the time what I make
          isn&apos;t super useful, but you can bet I had a lot of fun doing it!
          I&apos;m creating this site to document what I&apos;ve made, learned,
          and other things that keep me up at night. I hope you enjoy reading!
        </Typography>
      </Box>
      <br />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Tooltip title="GitHub">
          <IconButton
            aria-label="GitHub"
            onClick={() => window.open("https://github.com/yeungalan0")}
            className={classes.siteIconButton}
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="LinkedIn">
          <IconButton
            aria-label="LinkedIn"
            onClick={() =>
              window.open("https://www.linkedin.com/in/alanyeung0/")
            }
            className={classes.siteIconButton}
          >
            <LinkedInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="StackOverflow">
          <IconButton
            aria-label="StackOverflow"
            onClick={() =>
              window.open("https://stackoverflow.com/users/5910564/alan-yeung")
            }
            className={classes.siteIconButton}
          >
            <ReorderIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </DefaultLayout>
  );
}
