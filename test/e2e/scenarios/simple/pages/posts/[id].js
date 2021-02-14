/* eslint-disable filenames/match-regex */
import React from "react";
import { getAllPostIds } from "../../lib/posts";

export default function Post({ postData }) {
  return (
    <div>
      <article>
        <h1>Post {postData.id}</h1>
        <div>
          {postData.data}
        </div>
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: await getAllPostIds(),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      postData: {
        id: params.id,
        data: `data for ${params.id}`
      }
    }
  };
}
