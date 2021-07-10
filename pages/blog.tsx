import {
  Box,
  Card,
  CardActionArea,
  Checkbox,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@material-ui/core";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import Date from "../src/blog/components/date";
import { VALID_TAGS } from "../src/blog/constants";
import { getSortedPostsSummaryData, PostData } from "../src/blog/lib/posts";
import { blogStyles } from "../src/blog/styles/styles";
import { DefaultLayout } from "../src/layout";
import { fetcher, isEmpty } from "../src/utils";
import {
  buildQueryString,
  getQueryParams,
  validateQuery,
} from "./api/api-utils";
import {
  PostSummaryFilterKeys,
  postSummaryQuerySchema,
} from "./api/post-summary-data";

export async function getStaticProps(): Promise<{
  props: {
    allPostsData: PostData[];
  };
}> {
  const allPostsData = await getSortedPostsSummaryData({});

  return {
    props: {
      allPostsData,
    },
  };
}

// TODO: test this site functionality
export default function Blog({
  allPostsData,
}: {
  allPostsData: PostData[];
}): JSX.Element {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const tagsUpdatedRef = useRef(false);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    // Run initial query with params if there is any
    const queryParams = getQueryParams(router.query as NextApiRequest["query"]);
    const queryErrors = validateQuery(queryParams, postSummaryQuerySchema);

    if (queryErrors.length > 0) {
      setErrors(queryErrors);
    } else if (isEmpty(queryParams) && tags.length == 0) {
      // do nothing
    } else {
      tagsUpdatedRef.current = true;
      setTags(queryParams[PostSummaryFilterKeys.TAGS] ?? []);
    }
  }, [router.query]);

  if (errors.length > 0) {
    // TODO: perhaps redirect to error page with info?
    return (
      <div>failed to load: "{errors.map((error) => `${error.message}, `)}"</div>
    );
  }

  return (
    <DefaultLayout head="blog" title="Posts">
      <FilterByTags
        tags={tags}
        setTags={setTags}
        tagsUpdatedRef={tagsUpdatedRef}
      />
      <PostsList
        tags={tags}
        allPostsData={allPostsData}
        tagsUpdatedRef={tagsUpdatedRef}
      ></PostsList>
    </DefaultLayout>
  );
}

function PostsList({
  tags,
  allPostsData,
  tagsUpdatedRef,
}: {
  tags: string[];
  allPostsData: PostData[];
  tagsUpdatedRef: MutableRefObject<boolean>;
}): JSX.Element {
  const classes = blogStyles();
  let postData: PostData[] = allPostsData;

  const { data, error } = useSWR<PostData[], Error>(
    () =>
      tagsUpdatedRef.current
        ? `/api/post-summary-data?${buildQueryString({ tags: tags })}`
        : null,
    fetcher
  );

  if (data !== undefined) {
    postData = data;
  } else if (error) {
    return <div>failed to load: "{error.message}"</div>;
  } else if (tagsUpdatedRef.current && !data) {
    return <div>loading...</div>;
  }

  return (
    <Grid container direction="column">
      {postData.map((data) => (
        <Grid
          item
          key={data.id}
          className={classes.postList}
          data-cy="blog-posts"
        >
          <PostCard postData={data} />
        </Grid>
      ))}
    </Grid>
  );
}

function PostCard({ postData }: { postData: PostData }): JSX.Element {
  const theme = useTheme();

  return (
    <Link href={`/posts/${postData.id}`}>
      <Card variant="outlined">
        <CardActionArea>
          <Box margin={theme.spacing(0.5)} textAlign="center">
            <Typography variant="h6">{postData.title}</Typography>
            <small>
              <br />
              <Typography color="textSecondary">
                <Date dateString={postData.date} />
              </Typography>
              <br />
              <Typography color="textSecondary">
                Tags: {postData.tags.join(", ")}
              </Typography>
            </small>
          </Box>
        </CardActionArea>
      </Card>
    </Link>
  );
}

function FilterByTags({
  tags,
  setTags,
  tagsUpdatedRef,
}: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  tagsUpdatedRef: MutableRefObject<boolean>;
}): JSX.Element {
  const classes = blogStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    tagsUpdatedRef.current = true;
    setTags(event.target.value as string[]);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Tag(s)</InputLabel>
      <Select
        multiple
        value={tags}
        onChange={handleChange}
        input={<Input inputProps={{ "data-cy": "blog-tags-filter-input" }} />}
        renderValue={(selected) => (selected as string[]).join(", ")}
        data-cy="blog-tags-filter"
      >
        {VALID_TAGS.map((tag) => (
          <MenuItem key={tag} value={tag}>
            <Checkbox
              checked={tags.indexOf(tag) > -1}
              // @ts-ignore
              inputProps={{ "data-cy": `blog-tags-filter-box-${tag}` }}
            />
            <ListItemText primary={tag} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
