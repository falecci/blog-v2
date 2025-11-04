import React from "react";
import type { MDXComponents } from "mdx/types";
import Code from "@/components/mdx/code";
import InlineCode from "@/components/mdx/inline-code";
import StackBlitz from "@/components/mdx/stackblitz";
import { Button } from "@/components/ui/button";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    code: (props) => {
      const { className, children } = props;
      if (className) {
        return <Code {...props} />;
      }
      return <InlineCode>{children}</InlineCode>;
    },
    h1: (props) => (
      <h1 className="text-4xl font-black pb-4 mt-10 mb-6" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-3xl font-bold pb-4 mt-10 mb-6" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-2xl font-semibold pb-4 mt-10 mb-6 " {...props} />
    ),
    h4: (props) => (
      <h4 className="text-xl font-medium pb-4 mt-10 mb-6" {...props} />
    ),
    h5: (props) => (
      <h5 className="text-lg font-normal pb-4 mt-10 mb-6" {...props} />
    ),
    h6: (props) => (
      <h6 className="text-base font-light pb-4 mt-10 mb-6" {...props} />
    ),
    p: (props) => <p className="text-lg mb-6" {...props} />,
    li: (props) => <li className="pb-1" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 pb-4 mt-10 mb-6" {...props} />,
    ol: (props) => (
      <ol className="list-decimal pl-6 pb-4 mt-10 mb-6" {...props} />
    ),
    hr: (props) => <hr className="my-4" {...props} />,
    blockquote: (props) => (
      <blockquote
        style={{ paddingBottom: 0 }}
        className="border-l-4 pl-4 my-4"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
        {...props}
      />
    ),
    img: (props) => (
      <img
        alt={props.alt || ""}
        className="max-w-full h-auto rounded-lg my-6"
        {...props}
      />
    ),
    StackBlitz,
  };
}
