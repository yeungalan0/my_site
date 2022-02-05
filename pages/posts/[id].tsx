/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import remarkHeadings from "remark-autolink-headings";
import remarkFootnotes from "remark-footnotes";
// @ts-ignore
import remarkSlug from "remark-slug";
import remarkGfm from "remark-gfm";
import Date from "../../src/blog/components/date";
import { getAllPostIds, getPostData, PostData } from "../../src/blog/lib/posts";
import { postStyles } from "../../src/blog/styles/styles";
import { DefaultLayout } from "../../src/layout";
import { useStyles } from "../../src/style";

type postParam = {
  id: string;
};

export async function getStaticProps({
  params,
}: {
  params: postParam;
}): Promise<{
  props: {
    postData: PostData;
  };
}> {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths(): Promise<{
  paths: {
    params: {
      id: string;
    };
  }[];
  fallback: boolean;
}> {
  const paths = getAllPostIds();

  return {
    paths,
    fallback: false,
  };
}

export default function Post({
  postData,
}: {
  postData: PostData;
}): JSX.Element {
  const baseClasses = useStyles();
  const classes = postStyles();

  return (
    <DefaultLayout head={postData.title} title={postData.title}>
      <Typography align="center" color="textSecondary" className={classes.date}>
        <Date dateString={postData.date} />
      </Typography>
      <ReactMarkdown
        remarkPlugins={[
          remarkSlug,
          [remarkHeadings, { behavior: "wrap" }],
          remarkFootnotes,
          remarkGfm,
        ]}
        className={baseClasses.paragraph}
      >
        {postData.contentMarkdown}
      </ReactMarkdown>
    </DefaultLayout>
  );
}
