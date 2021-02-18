import React from "react";
import Link from "next/link"; // eslint-disable-line import/no-unresolved
import { getAllPostIds } from "../lib/posts";

export default function Home({ allPostsData }) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {allPostsData.map(({ params: { id } }) => (
          <li key={id}>
            <Link href={`/posts/${id}`}>
              <a>Post {id}</a>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}


export async function getStaticProps() {
  return {
    props: {
      allPostsData: await getAllPostIds()
    }
  };
}
