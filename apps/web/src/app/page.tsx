import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type ArticleSummary } from "@/components/article-card";
import { DEFAULT_OG_IMAGE } from "@/lib/constants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ArticlesResponse {
  articles: ArticleSummary[];
  meta: { total_count: number };
}

async function getRecentArticles(): Promise<ArticlesResponse | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/articles?page=1&per_page=5`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "DAN",
  description: "Ruby Developer / Web Services Manager / Songwriter / Boxer",
  openGraph: {
    title: "DAN",
    description: "Ruby Developer / Web Services Manager / Songwriter / Boxer",
    type: "website",
    ...(DEFAULT_OG_IMAGE && { images: [DEFAULT_OG_IMAGE] }),
  },
  twitter: {
    card: "summary",
    title: "DAN",
    description: "Ruby Developer / Web Services Manager / Songwriter / Boxer",
  },
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/nyshk97", icon: GitHubIcon, hoverColor: "" },
  { name: "X", href: "https://x.com/d0ne1s", icon: XIcon, hoverColor: "" },
  { name: "Zenn", href: "https://zenn.dev/d0ne1s", icon: ZennIcon, hoverColor: "#3EA8FF" },
  { name: "Qiita", href: "https://qiita.com/d0ne1s", icon: QiitaIcon, hoverColor: "" },
  { name: "note", href: "https://note.com/d0ne1s", icon: NoteIcon, hoverColor: "" },
  {
    name: "Spotify",
    href: "https://open.spotify.com/intl-ja/artist/4PDzmkyVjBguwRug2CVNNP",
    icon: SpotifyIcon,
    hoverColor: "#1DB954",
  },
];

const projects = [
  {
    name: "HyperForm",
    description: "Headless form backend",
    href: "https://hyperform.jp/",
  },
  {
    name: "TAGENGO Form",
    description: "Multilingual form service",
    href: "https://tagengo-form.app/",
  },
  {
    name: "malcheck",
    description: "Malware detection API",
    href: "https://malcheck.com/",
  },
  {
    name: "Shuriken Note",
    description: "Personal note-taking app",
    href: "https://github.com/nyshk97/blog",
  },
  {
    name: "Qiigle",
    description: "Search engine for Qiita",
    href: "https://qiigle.com/",
  },
  {
    name: "Songs",
    description: "Original music on Spotify",
    href: "https://open.spotify.com/intl-ja/artist/4PDzmkyVjBguwRug2CVNNP",
  },
] as const;

export default async function HomePage() {
  const data = await getRecentArticles();
  const articles = data?.articles ?? [];

  return (
    <div
      className="min-h-screen bg-white antialiased"
      style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl px-6 py-20">
        {/* Hero */}
        <header className="mb-20">
          <div className="flex items-center gap-5">
            <Image
              src="/avatar.png"
              alt="DAN"
              width={72}
              height={72}
              className="rounded-full"
              priority
            />
            <div>
              <h1
                className="text-4xl font-bold tracking-tight text-gray-900"
                style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace" }}
              >
                DAN
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Ruby Developer / Web Services Manager / Songwriter / Boxer
              </p>
            </div>
          </div>
          <nav className="mt-6 flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="social-link group/link flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-gray-100"
                {...(link.hoverColor ? { style: { "--brand-color": link.hoverColor } as React.CSSProperties } : {})}
              >
                <link.icon />
              </a>
            ))}
          </nav>
        </header>

        {/* Projects */}
        <section className="mb-20">
          <h2 className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Projects
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <h3 className="text-sm font-medium text-gray-900">
                  {project.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {project.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Articles */}
        <section className="mb-16">
          <h2 className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Articles
          </h2>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-400">No articles yet.</p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCardLight key={article.id} article={article} />
              ))}
            </div>
          )}
          {articles.length > 0 && (
            <div className="mt-8">
              <Link
                href="/articles"
                className="text-xs text-gray-400 transition-colors hover:text-gray-900"
              >
                View all articles &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <p className="text-[10px] tracking-[0.15em] text-gray-300">
            d0ne1s
          </p>
        </footer>
      </div>
    </div>
  );
}

function ArticleCardLight({ article }: { article: ArticleSummary }) {
  const formattedDate = new Date(article.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article>
      <Link href={`/articles/${article.id}`} className="group block">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
            {article.title || "Untitled"}
          </h3>
          <time
            className="shrink-0 text-xs text-gray-400"
            dateTime={article.created_at}
          >
            {formattedDate}
          </time>
        </div>
        {article.excerpt && (
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
            {article.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}

// --- Icon components ---

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ZennIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.264 23.771h4.984a.8.8 0 00.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72a.627.627 0 00-.557.323L.03 23.125c-.147.264.029.645.234.645zM17.445 23.419l6.479-10.408a.477.477 0 00-.41-.733h-4.691a.517.517 0 00-.44.264l-6.655 10.408c-.176.322.029.704.381.704h4.926a.583.583 0 00.41-.235z" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <Image
      src="/note-icon.webp"
      alt="note"
      width={18}
      height={18}
      className="rounded-sm grayscale opacity-60 transition-all group-hover/link:grayscale-0 group-hover/link:opacity-100"
    />
  );
}

function QiitaIcon() {
  return (
    <Image
      src="/qiita-icon.png"
      alt="Qiita"
      width={18}
      height={18}
      className="rounded-sm grayscale opacity-60 transition-all group-hover/link:grayscale-0 group-hover/link:opacity-100"
    />
  );
}

function SpotifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
