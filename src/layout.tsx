import {
  AppBar,
  Grid,
  GridSize,
  Slide,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Head from "next/head";
import Link from "next/link";
import { Fragment, ReactElement, useContext } from "react";
import { useStyles } from "./style";
import { ToggleThemeContext } from "./theme-provider";

type DefaultLayoutProps = {
  children: JSX.Element | JSX.Element[];
  head?: string | null;
  title?: string | null;
  gridSizes?: CustomGridSizes;
};

type DefaultGridLayoutProps = {
  children: JSX.Element | JSX.Element[];
  title?: JSX.Element | null;
  gridSizes?: CustomGridSizes;
};

type CustomGridSizes = {
  xs: GridSize | false;
  sm: GridSize | false;
  md: GridSize | false;
  lg: GridSize | false;
  xl: GridSize | false;
};

function getEdgeSizes(
  contentSize: GridSize | false
): { leftEdge: GridSize | false; rightEdge: GridSize | false } {
  let leftEdge: GridSize | false = Math.floor(
    (12 - (contentSize as number)) / 2
  ) as GridSize;
  let rightEdge: GridSize | false = (12 -
    (contentSize as number) -
    (leftEdge as number)) as GridSize;

  leftEdge = (leftEdge as number) == 0 ? false : leftEdge;
  rightEdge = (rightEdge as number) == 0 ? false : rightEdge;

  return { leftEdge, rightEdge };
}

export function DefaultGridLayout({
  children,
  title = null,
  gridSizes = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
  },
}: DefaultGridLayoutProps): JSX.Element {
  const classes = useStyles();

  const { leftEdge: xsLeftEdge, rightEdge: xsRightEdge } = getEdgeSizes(
    gridSizes.xs
  );
  const { leftEdge: smLeftEdge, rightEdge: smRightEdge } = getEdgeSizes(
    gridSizes.sm
  );
  const { leftEdge: mdLeftEdge, rightEdge: mdRightEdge } = getEdgeSizes(
    gridSizes.md
  );
  const { leftEdge: lgLeftEdge, rightEdge: lgRightEdge } = getEdgeSizes(
    gridSizes.lg
  );
  const { leftEdge: xlLeftEdge, rightEdge: xlRightEdge } = getEdgeSizes(
    gridSizes.xl
  );

  return (
    <Grid container direction="column">
      {title}
      <Grid item container>
        <Grid
          item
          xs={xsLeftEdge}
          sm={smLeftEdge}
          md={mdLeftEdge}
          lg={lgLeftEdge}
          xl={xlLeftEdge}
        />
        <Grid
          item
          xs={gridSizes.xs}
          sm={gridSizes.sm}
          md={gridSizes.md}
          lg={gridSizes.lg}
          xl={gridSizes.xl}
          className={classes.contentGrid}
        >
          {children}
        </Grid>
        <Grid
          item
          xs={xsRightEdge}
          sm={smRightEdge}
          md={mdRightEdge}
          lg={lgRightEdge}
          xl={xlRightEdge}
        />
      </Grid>
    </Grid>
  );
}

export function DefaultLayout({
  children,
  head = null,
  title = null,
  gridSizes = undefined,
}: DefaultLayoutProps): JSX.Element {
  return (
    <Fragment>
      <ConditionalHead head={head} />
      <DefaultGridLayout
        title={<ConditionalTitle title={title}></ConditionalTitle>}
        gridSizes={gridSizes}
      >
        {children}
      </DefaultGridLayout>
    </Fragment>
  );
}

function ConditionalHead({ head }: { head: string | null }): JSX.Element {
  if (head === null) {
    return <></>;
  }

  return (
    <Head>
      <title>{head}</title>
    </Head>
  );
}

function ConditionalTitle({ title }: { title: string | null }): JSX.Element {
  const classes = useStyles();

  if (title === null) {
    return <Fragment></Fragment>;
  }

  return (
    <Grid item>
      <Typography variant="h3" align="center" className={classes.title}>
        {title}
      </Typography>
    </Grid>
  );
}

function HideOnScroll({
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ReactElement<any, any>;
}) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function TopBar(): JSX.Element {
  const classes = useStyles();
  const { toggleTheme, darkThemeActive } = useContext(ToggleThemeContext);

  return (
    <HideOnScroll>
      <AppBar position="sticky" data-cy="top-bar">
        <DefaultGridLayout>
          <Toolbar className={classes.toolbar}>
            <Typography
              color="textSecondary"
              variant="h6"
              className={classes.topic}
            >
              <Link href={`/blog`}>
                <a data-cy="top-bar-blog">Blog</a>
              </Link>
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              className={classes.topic}
            >
              <Link href={`/about`}>
                <a data-cy="top-bar-about">About</a>
              </Link>
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              className={classes.topic}
            >
              <Link href={`/blog?tags=projects`}>
                <a data-cy="top-bar-projects">Projects</a>
              </Link>
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              className={classes.topic}
            >
              <Link href={`/resume/resume_cv.pdf`}>
                <a data-cy="top-bar-resume">Resume</a>
              </Link>
            </Typography>
            <Tooltip title="Toggle Theme">
              <Switch
                checked={darkThemeActive}
                onChange={toggleTheme}
                icon={<WbSunnyIcon fontSize="small" />}
                checkedIcon={<Brightness2Icon fontSize="small" />}
                color="default"
                // Ignoring this per: https://github.com/mui-org/material-ui/issues/20160
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                inputProps={{ "data-cy": "top-bar-toggle-theme" }}
              />
            </Tooltip>
          </Toolbar>
        </DefaultGridLayout>
      </AppBar>
    </HideOnScroll>
  );
}
