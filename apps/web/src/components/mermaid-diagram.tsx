"use client";

import { useEffect, useId, useState } from "react";

type MermaidApi = typeof import("mermaid").default;

let mermaidPromise: Promise<MermaidApi> | null = null;

/**
 * mermaid is a heavy dependency, so it is imported the first time a diagram
 * actually appears rather than with the viewer bundle, and the initialized
 * instance is shared by every diagram afterwards.
 */
function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      // Diagrams always sit on the light surfaces the viewer uses
      // (.znc / prose), so the light theme is the right default.
      theme: "default",
      // Note bodies are user input: disable HTML labels and click bindings.
      securityLevel: "strict",
      fontFamily: "inherit",
    });
    return mermaid;
  });

  return mermaidPromise;
}

type RenderState =
  | { status: "loading" }
  | { status: "rendered"; svg: string }
  | { status: "error"; message: string };

interface MermaidDiagramProps {
  /** Diagram source, i.e. the body of a ```mermaid fenced block */
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const [state, setState] = useState<RenderState>({ status: "loading" });
  // useId() contains characters that are invalid in the DOM ids mermaid
  // derives from the one it is given.
  const renderId = `mermaid-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    // The previous diagram stays on screen while the new source renders,
    // which keeps live preview from flickering on every keystroke.
    loadMermaid()
      .then((mermaid) => mermaid.render(renderId, code))
      .then(({ svg }) => {
        if (!cancelled) setState({ status: "rendered", svg });
      })
      .catch((error: unknown) => {
        // A failed render leaves its temporary container behind;
        // mermaid names it "d" + the id it was given.
        document.getElementById(`d${renderId}`)?.remove();
        document.getElementById(renderId)?.remove();
        if (!cancelled) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  if (state.status === "error") {
    return (
      <div className="mermaid-error">
        <p>Failed to render diagram: {state.message}</p>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (state.status === "loading") {
    return <div className="mermaid-diagram" aria-busy="true" />;
  }

  return (
    <div
      className="mermaid-diagram"
      role="img"
      // mermaid sanitizes its own output under securityLevel: "strict".
      dangerouslySetInnerHTML={{ __html: state.svg }}
    />
  );
}
