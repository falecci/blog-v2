import fs from "node:fs";
import path from "node:path";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { format } from "date-fns";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params);
  return {
    title: `falecci.dev | ${post.metadata.title}`,
    description: post.metadata.description,
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
    },
  };
}

function stripPrefix(filename: string): string {
  // Remove the numbered prefix (e.g., "001-") from the filename
  return filename.replace(/^\d+-/, "");
}

function getPrefixNumber(filename: string): number {
  // Extract the number prefix (e.g., "001" from "001-unit-testing-react-hooks.mdx")
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

async function getAllPosts() {
  const blogsDir = path.join("content", "blogs");
  const files = fs
    .readdirSync(blogsDir)
    .filter((filename) => filename.endsWith(".mdx"))
    .sort((a, b) => getPrefixNumber(a) - getPrefixNumber(b));

  // Filter out draft posts
  const postsWithMetadata = await Promise.all(
    files.map(async (filename) => {
      try {
        const { metadata } = await import(`@/content/blogs/${filename}`);
        return {
          filename,
          slug: stripPrefix(filename.replace(".mdx", "")),
          number: getPrefixNumber(filename),
          isDraft: metadata?.draft === true,
        };
      } catch {
        return {
          filename,
          slug: stripPrefix(filename.replace(".mdx", "")),
          number: getPrefixNumber(filename),
          isDraft: false,
        };
      }
    })
  );

  return postsWithMetadata
    .filter((post) => !post.isDraft)
    .map(({ filename, slug, number }) => ({ filename, slug, number }));
}

function findActualFilename(slug: string): string {
  const blogsDir = path.join("content", "blogs");
  const files = fs.readdirSync(blogsDir);

  // Find the file that matches the slug (with or without prefix)
  const file = files.find((filename) => {
    const filenameWithoutExt = filename.replace(".mdx", "");
    return stripPrefix(filenameWithoutExt) === slug;
  });

  if (!file) {
    notFound();
  }

  return file;
}

async function getAdjacentPosts(currentSlug: string) {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const previousPost =
    currentIndex > 0
      ? await import(
          `@/content/blogs/${posts[currentIndex - 1].filename}`
        ).then((mod) => ({
          slug: posts[currentIndex - 1].slug,
          title: mod.metadata.title,
        }))
      : null;

  const nextPost =
    currentIndex < posts.length - 1
      ? await import(
          `@/content/blogs/${posts[currentIndex + 1].filename}`
        ).then((mod) => ({
          slug: posts[currentIndex + 1].slug,
          title: mod.metadata.title,
        }))
      : null;

  return { previous: previousPost, next: nextPost };
}

async function getPost({ slug }: { slug: string }) {
  try {
    const actualFilename = findActualFilename(slug);
    const mdxPath = path.join("content", "blogs", actualFilename);

    if (!fs.existsSync(mdxPath)) {
      notFound();
    }

    const { metadata } = await import(`@/content/blogs/${actualFilename}`);

    return {
      slug,
      metadata,
      actualFilename,
    };
  } catch (error) {
    // If it's already a NEXT_NOT_FOUND error, re-throw it
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error fetching post:", error);
    notFound();
  }
}

type AdjacentPost = {
  slug: string;
  title: string;
} | null;

function PostNavigation({
  previous,
  next,
}: {
  previous: AdjacentPost;
  next: AdjacentPost;
}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 sm:gap-8">
      {previous && (
        <Link
          href={`/${previous.slug}`}
          className="flex-1 group hover:bg-gray-50 p-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label={`Previous post: ${previous.title}`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>Previous</span>
          </div>
          <p className="font-semibold text-gray-900 group-hover:text-gray-700">
            {previous.title}
          </p>
        </Link>
      )}
      {next && (
        <Link
          href={`/${next.slug}`}
          className="flex-1 group hover:bg-gray-50 p-4 rounded-lg transition-colors text-right sm:text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label={`Next post: ${next.title}`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 justify-end sm:justify-start">
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
          <p className="font-semibold text-gray-900 group-hover:text-gray-700">
            {next.title}
          </p>
        </Link>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("content", "blogs"));
  const params = await Promise.all(
    files
      .filter((filename) => filename.endsWith(".mdx"))
      .map(async (filename) => {
        try {
          const { metadata } = await import(`@/content/blogs/${filename}`);
          return {
            slug: stripPrefix(filename.replace(".mdx", "")),
            isDraft: metadata?.draft === true,
          };
        } catch {
          return {
            slug: stripPrefix(filename.replace(".mdx", "")),
            isDraft: false,
          };
        }
      })
  );

  // Filter out draft posts from static generation
  return params.filter(({ isDraft }) => !isDraft).map(({ slug }) => ({ slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const post = await getPost(params);

  // Prevent access to draft posts
  if (post.metadata.draft) {
    notFound();
  }

  const { previous, next } = await getAdjacentPosts(slug);

  // Dynamically import the MDX file using the actual filename with prefix
  const MDXContent = dynamic(
    () => import(`@/content/blogs/${post.actualFilename}`)
  );

  const formattedDate = format(
    new Date(post.metadata.publishDate),
    "MMMM dd, yyyy"
  );

  return (
    <main
      id="main-content"
      className="flex flex-col items-center px-6 py-12 sm:px-10 sm:py-24"
    >
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>
        <article className="prose prose-lg md:prose-lg lg:prose-lg">
          <div className="pb-8">
            <time
              dateTime={post.metadata.publishDate}
              className="font-semibold text-lg block"
            >
              <span className="text-red-600 pr-1">{formattedDate}</span>
            </time>
          </div>
          <div className="pb-10">
            <h1 className="text-5xl sm:text-6xl font-black leading-12">
              {post.metadata.title}
            </h1>
          </div>
          <MDXContent />
        </article>

        <PostNavigation previous={previous} next={next} />
      </div>
    </main>
  );
}
