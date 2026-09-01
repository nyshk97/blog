import { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_OG_IMAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Apps — DAN",
  description: "Personal apps I build for myself and use every day",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Apps — DAN",
    description: "Personal apps I build for myself and use every day",
    type: "website",
    ...(DEFAULT_OG_IMAGE && { images: [DEFAULT_OG_IMAGE] }),
  },
  twitter: {
    card: "summary",
    title: "Apps — DAN",
    description: "Personal apps I build for myself and use every day",
  },
};

interface AppEntry {
  name: string;
  description: string;
  platforms: string[];
  stack: string;
  repo: string;
  /** Shown when the app lives inside a monorepo shared with other apps */
  repoLabel?: string;
  forkOf?: { name: string; href: string };
  /** Optional screenshot path (public/). Rendered when present. */
  screenshot?: string;
}

const dailyDrivers: AppEntry[] = [
  {
    name: "LaLa",
    description:
      "A personal DAW stripped down to only the features I actually use. Hosts the built-in macOS GM synth, ships custom DSP effects (reverb / delay / limiter), and imports audio straight from URLs.",
    platforms: ["macOS"],
    stack: "C++ / JUCE",
    repo: "https://github.com/nyshk97/daw",
    repoLabel: "nyshk97/daw",
  },
  {
    name: "Salva",
    description:
      "Turns vinyl records and local audio into sampling material — grab the section you want and send it to an MPC or into LaLa.",
    platforms: ["macOS"],
    stack: "C++ / JUCE",
    repo: "https://github.com/nyshk97/daw/tree/main/apps/salva",
    repoLabel: "nyshk97/daw (apps/salva)",
  },
  {
    name: "Todo",
    description:
      "Today-focused task management inspired by DayTask — an iOS app, a macOS menu bar app, and a Workers API.",
    platforms: ["iOS", "macOS"],
    stack: "SwiftUI / Hono / Cloudflare Workers",
    repo: "https://github.com/nyshk97/todo-app",
    repoLabel: "nyshk97/todo-app",
  },
  {
    name: "Shelf",
    description:
      "A Todoist replacement — a place for things I don't want to forget but won't do right now. Tasks can be promoted into Todo.",
    platforms: ["iOS", "Web"],
    stack: "SwiftUI / React / Cloudflare Workers",
    repo: "https://github.com/nyshk97/todo-app/tree/main/apps/shelf",
    repoLabel: "nyshk97/todo-app (apps/shelf)",
  },
  {
    name: "Translator",
    description:
      "A macOS translation tool designed around a single metric: time to first token. Menu bar resident, global shortcut, one launcher window.",
    platforms: ["macOS"],
    stack: "Swift / Gemini API",
    repo: "https://github.com/nyshk97/translate",
  },
  {
    name: "keyrc",
    description:
      "A lightweight key remapper that replaced Karabiner-Elements in my setup — a two-layer design of hidutil and CGEventTap.",
    platforms: ["macOS"],
    stack: "Swift",
    repo: "https://github.com/nyshk97/keyrc",
  },
  {
    name: "Shuriken Note",
    description:
      "A markdown note app stripped down to what matters — auto-save, full-text search, and publishing. It powers this site, including the page you are reading.",
    platforms: ["Web"],
    stack: "Rails / Next.js / PostgreSQL",
    repo: "https://github.com/nyshk97/blog",
  },
  {
    name: "menubar-tidy",
    description:
      "A menu bar manager cut down to the five features I actually use, with everything else removed.",
    platforms: ["macOS"],
    stack: "Swift",
    repo: "https://github.com/nyshk97/menubar-tidy",
    forkOf: { name: "thaw-app/Thaw", href: "https://github.com/thaw-app/Thaw" },
  },
  {
    name: "Shoplist",
    description: "A simple shopping list — an iOS app backed by a Workers API.",
    platforms: ["iOS"],
    stack: "SwiftUI / Hono / Cloudflare Workers",
    repo: "https://github.com/nyshk97/shoplist",
  },
  {
    name: "Vid",
    description:
      "A gesture-driven video player and trimmer for iOS — long-press for 2x speed, trim in place.",
    platforms: ["iOS"],
    stack: "SwiftUI / AVKit",
    repo: "https://github.com/nyshk97/video-player",
  },
];

const dormant: AppEntry[] = [
  {
    name: "tab-trace",
    description:
      "A Chrome extension for keyboard-driven tab switching in MRU order — like Cmd+Tab, but for browser tabs.",
    platforms: ["Chrome"],
    stack: "JavaScript",
    repo: "https://github.com/nyshk97/tab-trace",
  },
  {
    name: "DiffViewer",
    description:
      "A launcher-style app to check Git diffs across repos — overlays fullscreen apps, no window switching needed.",
    platforms: ["macOS"],
    stack: "Swift",
    repo: "https://github.com/nyshk97/diff-viewer",
  },
];

export default function AppsPage() {
  return (
    <div
      className="min-h-screen bg-white antialiased"
      style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl px-6 py-20">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/"
            className="text-xs text-gray-400 transition-colors hover:text-gray-900"
          >
            &larr; d0ne1s.com
          </Link>
          <h1
            className="mt-6 text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace" }}
          >
            Apps
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Apps I build for myself and use in my daily life. They are open
            source and you are welcome to install them — but I ship breaking
            changes without notice, so forking is the recommended way to depend
            on one.
          </p>
        </header>

        {/* Daily drivers */}
        <section className="mb-16">
          <h2 className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            In daily use
          </h2>
          <div className="space-y-4">
            {dailyDrivers.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
        </section>

        {/* Dormant */}
        <section className="mb-16">
          <h2 className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Dormant
          </h2>
          <div className="space-y-4">
            {dormant.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <p className="text-[10px] tracking-[0.15em] text-gray-300">d0ne1s</p>
        </footer>
      </div>
    </div>
  );
}

function AppCard({ app }: { app: AppEntry }) {
  return (
    <a
      href={app.repo}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium text-gray-900">{app.name}</h3>
        <span className="shrink-0 text-[10px] tracking-wide text-gray-400">
          {app.platforms.join(" · ")}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
        {app.description}
      </p>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[10px] text-gray-400">
        <span>{app.stack}</span>
        <span className="text-gray-300">·</span>
        <span className="transition-colors group-hover:text-gray-600">
          {app.repoLabel ?? app.repo.replace("https://github.com/", "")}
        </span>
        {app.forkOf && (
          <>
            <span className="text-gray-300">·</span>
            <span>fork of {app.forkOf.name}</span>
          </>
        )}
      </div>
    </a>
  );
}
