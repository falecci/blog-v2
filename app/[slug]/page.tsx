import fs from "node:fs";
import path from "node:path";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { format } from "date-fns";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params);
  return {
    title: `falecci.dev | ${post.metadata.title}`,
    description: post.metadata.description,
    twitter: {
      card: "summary_large_image",
      images: [
        post.metadata.thumbnail.includes("twitter")
          ? post.metadata.thumbnail
          : `${post.metadata.thumbnail}&tr=w-400,h-200`,
      ],
      title: post.metadata.title,
      description: post.metadata.description,
    },
  };
}

async function getPost({ slug }: { slug: string }) {
  try {
    const mdxPath = path.join("content", "blogs", `${slug}.mdx`);
    if (!fs.existsSync(mdxPath)) {
      throw new Error(`MDX file for slug ${slug} does not exist`);
    }

    const { metadata } = await import(`@/content/blogs/${slug}.mdx`);

    return {
      slug,
      metadata,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error(`Unable to fetch the post for slug: ${slug}`);
  }
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("content", "blogs"));
  const params = files.map((filename) => ({
    slug: filename.replace(".mdx", ""),
  }));

  return params;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const post = await getPost(params);
  // Dynamically import the MDX file based on the slug
  const MDXContent = dynamic(() => import(`@/content/blogs/${slug}.mdx`));

  const formattedDate = format(
    new Date(post.metadata.publishDate),
    "MMMM dd, yyyy"
  );

  return (
    <main className="flex flex-col items-center justify-between px-6 py-12 sm:px-10 sm:py-24 min-h-[calc(100vh-12rem)]">
      <div className="max-w-3xl z-10 w-full items-center justify-between">
        <div className="w-full flex justify-center items-center flex-col gap-6">
          <Image
            width={600}
            height={245}
            src={
              post.metadata.portrait ||
              post.metadata.thumbnail ||
              "https://generated.vusercontent.net/placeholder.svg"
            }
            alt={post.metadata.title}
            className="rounded-lg object-cover w-[770px] h-[310px]"
          />
          <article className="prose prose-lg md:prose-lg lg:prose-lg mx-auto min-w-full">
            <div className="pb-8">
              <p className="font-semibold text-lg">
                <span className="text-red-600 pr-1">{formattedDate}</span>{" "}
              </p>
            </div>
            <div className="pb-10">
              <h1 className="text-5xl sm:text-6xl font-black capitalize leading-12">
                {post.metadata.title}
              </h1>
            </div>
            <MDXContent />
          </article>
        </div>
      </div>
    </main>
  );
}
