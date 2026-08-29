import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets scroll position on every route change, except within-page anchors (#hash). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
