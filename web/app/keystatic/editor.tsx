"use client";

import { useSyncExternalStore } from "react";
import KeystaticApp from "./keystatic";
import BranchGuard from "./branch-guard";

// The editor is browser-only (it reads the URL and window): render it only in the
// browser so the build never tries to prerender it. While it is open, hide the
// public site chrome (nav, footer, chatbot, cookie banner) the root layout adds.
export default function Editor() {
  const inBrowser = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!inBrowser) return null;
  return (
    <>
      <style>{`body > header, body > footer, body > aside, body > div[class*="fixed"] { display: none !important; }`}</style>
      <KeystaticApp />
      <BranchGuard />
    </>
  );
}
