import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
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
  [key: string]: any;
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
          slug: filename.replace(".mdx", ""),
          metadata: metadata || {
            thumbnail: "",
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
    });

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
    <main className="flex-1 py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="grid gap-4 max-w-[370px]">
              <Image
                width={370}
                height={245}
                src={
                  post.metadata.thumbnail ||
                  "https://generated.vusercontent.net/placeholder.svg"
                }
                alt={post.metadata.title}
                className="rounded-lg object-cover w-[370px] h-[245px]"
              />
              <a href={post.slug}>
                <h2 className="text-xl font-bold">{post.metadata.title}</h2>
                <p className="text-muted-foreground">
                  Posted on{" "}
                  {format(new Date(post.metadata.publishDate), "MMMM dd, yyyy")}
                </p>
              </a>
              <p className="text-muted-foreground">
                {post.metadata.description}
              </p>
              <Link
                href={post.slug}
                className="text-primary hover:underline"
                prefetch={false}
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
