import { useEffect } from "react";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(path: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", new URL(path, window.location.origin).toString());
}

/**
 * Minimal per-route SEO: sets document title, meta description and Open
 * Graph tags without pulling in react-helmet — this is a small SPA with a
 * handful of routes, a dependency for this would be overkill.
 */
export function useDocumentMeta({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    const fullTitle = `${title} — ExcelWeb`;
    document.title = fullTitle;
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", new URL(path, window.location.origin).toString(), "property");
    setCanonical(path);
  }, [title, description, path]);
}
