import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import React from "react";
import { format } from "date-fns";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "falecci.dev | Blog",
  };
}

type Post = {
  slug: string;
  metadata: PostMetadata;
};

interface PostMetadata {
  title: string;
  publishDate: string;
  description?: string;
  [key: string]: any;
}

function stripPrefix(filename: string): string {
  // Remove the numbered prefix (e.g., "001-") from the filename
  return filename.replace(/^\d+-/, "");
}

async function getAllPosts(): Promise<Post[]> {
  const dir = path.join(process.cwd(), "content", "blogs");
  const files = fs.readdirSync(dir);

  const posts = files
    .filter(
      (filename) => filename.endsWith(".mdx") && !filename.startsWith(".")
    )
    .map((filename) => {
      try {
        const { metadata } = require(`@/content/blogs/${filename}`);
        return {
          slug: stripPrefix(filename.replace(".mdx", "")),
          metadata: metadata || {
            title: "Untitled",
            publishDate: "1970-01-01",
            description: "Work in progress",
          },
        };
      } catch (error) {
        console.error(`Error loading metadata for file ${filename}:`, error);
        return {
          slug: filename.replace(".mdx", ""),
          metadata: { title: "Untitled", publishDate: "1970-01-01" },
        };
      }
    })
    .filter((post) => !post.metadata.draft); // Filter out draft posts

  // Sort posts by publishDate in descending order
  posts.sort(
    (a, b) =>
      new Date(b.metadata.publishDate).getTime() -
      new Date(a.metadata.publishDate).getTime()
  );

  return posts;
}

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main id="main-content" className="py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">falecci.dev</h1>
          <p className="text-gray-600 text-lg mb-6">
            My name is Fede. This is my personal blog.
          </p>
          <div className="space-y-2 text-black">
            <p>
              <a
                href="https://github.com/falecci"
                className="underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              >
                Github
              </a>
              {" · "}
              <a
                href="mailto:i.am@falecci.dev"
                className="underline focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              >
                Email
              </a>
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black mb-8 mt-16">Blog Posts</h2>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <Link
                href={`/${post.slug}`}
                className="block focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg"
              >
                <h3 className="text-xl font-bold text-black mb-2">
                  {post.metadata.title}
                </h3>
                <time
                  dateTime={post.metadata.publishDate}
                  className="text-gray-500 text-sm mb-3 block"
                >
                  {format(new Date(post.metadata.publishDate), "MMMM dd, yyyy")}
                </time>
                {post.metadata.description && (
                  <p className="text-black leading-relaxed">
                    {post.metadata.description}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
