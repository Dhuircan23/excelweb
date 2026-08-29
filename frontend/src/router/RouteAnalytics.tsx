import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "../lib/analytics";

/** Fires a page_view event on every route change. */
export function RouteAnalytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    track("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
