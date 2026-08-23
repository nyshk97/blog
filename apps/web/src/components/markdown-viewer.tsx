"use client";

import React from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { LinkCard } from "./link-card";
import { MermaidDiagram } from "./mermaid-diagram";

const URL_REGEX = /^https?:\/\/[^\s]+$/;

const remarkPlugins: Options["remarkPlugins"] = [remarkGfm];

/**
 * `mermaid` is listed as plain text so highlight.js does not try (and fail)
 * to tokenize it: those blocks are handed to MermaidDiagram instead.
 */
const rehypePlugins: Options["rehypePlugins"] = [
  [rehypeHighlight, { plainText: ["mermaid"] }],
];

function isBareLink(children: React.ReactNode, href: string | undefined): boolean {
  if (!href) return false;
  const text = React.Children.toArray(children)
    .map((child) => (typeof child === "string" ? child : ""))
    .join("");
  return text === href && URL_REGEX.test(href);
}

function textContentOf(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (React.isValidElement(child)) {
        const { children: nested } = child.props as {
          children?: React.ReactNode;
        };
        return textContentOf(nested);
      }
      return "";
    })
    .join("");
}

/** Returns the diagram source when a `pre` wraps a ```mermaid block. */
function mermaidSourceOf(children: React.ReactNode): string | null {
  const childArray = React.Children.toArray(children);
  if (childArray.length !== 1) return null;

  const child = childArray[0];
  if (!React.isValidElement(child) || child.type !== "code") return null;

  const { className, children: codeChildren } = child.props as {
    className?: string;
    children?: React.ReactNode;
  };
  if (!className?.split(" ").includes("language-mermaid")) return null;

  return textContentOf(codeChildren);
}

/**
 * Components shared by both variants.
 *
 * Defined once at module scope: recreating them per render would give them a
 * new identity, making React unmount and remount every matching node (and any
 * state it holds, such as a rendered diagram) on each re-render of the viewer.
 */
const baseComponents: Components = {
  pre({ children, ...props }) {
    const source = mermaidSourceOf(children);
    if (source !== null) return <MermaidDiagram code={source} />;

    return <pre {...props}>{children}</pre>;
  },
};

/**
 * In public variant, paragraphs containing only a bare link
 * (text === href) are rendered as rich link cards.
 */
const publicComponents: Components = {
  ...baseComponents,

  p({ children }) {
    const childArray = React.Children.toArray(children);

    if (childArray.length === 1 && React.isValidElement(childArray[0])) {
      const child = childArray[0] as React.ReactElement<{
        href?: string;
        children?: React.ReactNode;
      }>;
      if (
        child.type === "a" &&
        child.props.href &&
        isBareLink(child.props.children, child.props.href)
      ) {
        return <LinkCard url={child.props.href} />;
      }
    }

    return <p>{children}</p>;
  },
};

interface MarkdownViewerProps {
  content: string;
  className?: string;
  /** Use Zenn-inspired styles for public pages */
  variant?: "default" | "public";
}

export function MarkdownViewer({
  content,
  className,
  variant = "default",
}: MarkdownViewerProps) {
  const baseClassName =
    variant === "public"
      ? "znc"
      : "prose prose-slate max-w-none";

  const components = variant === "public" ? publicComponents : baseComponents;

  return (
    <article className={`${baseClassName} ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
