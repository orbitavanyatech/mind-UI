/* Lightweight drill-down navigation layer.
   The sidebar/tab bar already manage top-level `page` switching in App.jsx.
   This context adds a `navigate(page, params)` / `back()` pair so pages can
   push detail views (e.g. a specific module or session) without every page
   in the tree having to thread params through renderPage manually. */

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const NavigationContext = createContext(null);

export const NavigationProvider = ({ page, params, setPage, setParams, children }) => {
  const [history, setHistory] = useState([]); // stack of { page, params }

  const navigate = useCallback(
    (nextPage, nextParams = {}) => {
      setHistory((h) => [...h, { page, params }]);
      setPage(nextPage);
      setParams(nextParams);
    },
    [page, params, setPage, setParams]
  );

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setPage(prev.page);
      setParams(prev.params);
      return h.slice(0, -1);
    });
  }, [setPage, setParams]);

  /* Top-level nav (sidebar / tab bar) should reset the drill-down stack. */
  const resetTo = useCallback(
    (nextPage) => {
      setHistory([]);
      setPage(nextPage);
      setParams({});
    },
    [setPage, setParams]
  );

  const value = useMemo(
    () => ({ page, params, navigate, back, resetTo, canGoBack: history.length > 0 }),
    [page, params, navigate, back, resetTo, history.length]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within a NavigationProvider");
  return ctx;
};
