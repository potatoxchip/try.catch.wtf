import fs from "fs";
import path from "path";

import React, { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import styled from "@emotion/styled";
import useSWR from "swr";

import { POSTS_PATH, postFilePaths } from "utils/mdxUtils";
import Hero from "@components/Hero";
import Layout from "@components/Layout";
import heroImageMap from "@components/HeroImage";
import MDXComponents from "@components/MDXComponents";
import { HeroImageName } from "@typings/heroImageName";
import HeadingStyle from "@components/Heading";
import { NextPageWithLayout } from "@typings/app";
import { GetStaticPaths, GetStaticProps } from "next";
import axios, { Axios } from "axios";
import Counter from "@components/ViewsCounter";
import CalendarIcon from "@components/icons/CalendarIcon";
import EyeIcon from "@components/icons/EyeIcon";

type BlogPropsType = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: {
    slug: string;
    heroImageName: HeroImageName;
    heroCreditUserProfile: string;
    heroCreditUserProfileUrl: string;
    heroCreditSource: string;
    title: string;
    createdAt: string;
    tags: string[];
  };
};

const LayoutWrapper = styled(Layout)`
  padding: 0 2rem;
  display: grid;
  grid-template-columns: minmax(0, max-content);
  grid-template-rows: min-content min-content minmax(0, max-content);
  grid-template-areas:
    "heading"
    "hero"
    "post";
  gap: 3rem;

  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

const Blog: NextPageWithLayout<BlogPropsType> = ({ source, frontMatter }) => {
  const { slug } = frontMatter;

  const [views, setViews] = useState(0);

  useEffect(() => {
    axios
      .get("/api/updateViews/" + slug)
      .then(({ data }) => setViews(data as number))
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    const url = window.location.hash;
    document.getElementById(url.replace("#", ""))?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
        <meta
          name="description"
          content="How to use fonts with minimal side effects on lighthouse score"
        />
      </Head>
      <div style={{ gridArea: "heading" }}>
        <HeadingStyle
          fgColor="green-100"
          fontSize="3rem"
          fontWeight={600}
          margin="1rem 0 0.5rem 0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, translateX: -32 },
            visible: {
              opacity: 1,
              translateX: 0,
            },
          }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {frontMatter.title}
        </HeadingStyle>
        <div>
          <CalendarIcon />
          <p>{frontMatter.createdAt}</p>
        </div>
        <div>
          <EyeIcon />
          <Counter from={0} to={views} />
        </div>
      </div>
      <div style={{ gridArea: "hero" }}>
        <Hero
          layoutId={`${frontMatter.slug}__hero`}
          title={frontMatter.title}
          heroSrc={heroImageMap[frontMatter.heroImageName]}
          heroCreditSource={frontMatter.heroCreditSource}
          heroCreditUserProfile={frontMatter.heroCreditUserProfile}
          heroCreditUserProfileUrl={frontMatter.heroCreditUserProfileUrl}
        />
      </div>

      <div style={{ gridArea: "post" }}>
        <MDXRemote {...source} components={MDXComponents} />
      </div>
    </>
  );
};

Blog.getLayout = (page: ReactElement) => <LayoutWrapper>{page}</LayoutWrapper>;

export const getStaticProps: GetStaticProps<BlogPropsType> = async ({
  params,
}: any) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);
  const mdxSource = await serialize(content);

  return {
    props: {
      source: mdxSource,
      frontMatter: {
        ...data,
        slug: params.slug,
      } as BlogPropsType["frontMatter"],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = postFilePaths
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default Blog;
