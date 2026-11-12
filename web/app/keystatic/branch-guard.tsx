"use client";

import { useEffect, useRef, useState } from "react";

// Keystatic's own toolbar cannot be changed, so this adds a small layer on top of it:
// - on develop (or another shared branch) a Save click is stopped and a popup says to make a branch
// - on any other branch a pill links to the open PR, or to "create pull request" against develop
// A Save on a branch just adds a commit, which updates that branch's PR. The real guard is
// GitHub branch protection on develop; this only explains it before the editor hits it.
// Only active when the URL has /branch/<name> (production). Local dev has no branches.
const REPO = "Furqanali111/ZenithCareWebsite";
const OWNER = REPO.split("/")[0];
const SHARED = ["develop", "deployment-branch", "main"];

const branchOf = (pathname: string) => {
  const m = pathname.match(/\/keystatic\/branch\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};

type Pr = { number: number; html_url: string };

const pill = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 2147483000,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 14px",
  borderRadius: 12,
  background: "#14181f",
  color: "#fff",
  font: "500 13px/1.3 system-ui, sans-serif",
  boxShadow: "0 6px 24px rgba(0,0,0,.35)",
} as const;
const btn = {
  padding: "7px 12px",
  borderRadius: 8,
  background: "#3b5bdb",
  color: "#fff",
  font: "600 13px system-ui, sans-serif",
  textDecoration: "none",
  border: 0,
  cursor: "pointer",
} as const;

export default function BranchGuard() {
  const [branch, setBranch] = useState<string | null>(null);
  const [pr, setPr] = useState<Pr | null>(null);
  const [popup, setPopup] = useState(false);
  const shared = branch !== null && SHARED.includes(branch);
  const sharedRef = useRef(false);
  useEffect(() => {
    sharedRef.current = shared;
  }, [shared]);

  // Keystatic routes client-side, so poll the address instead of waiting for a reload.
  useEffect(() => {
    const read = () => setBranch(branchOf(window.location.pathname));
    read();
    const t = setInterval(read, 500);
    return () => clearInterval(t);
  }, []);

  // Stop Save (button or Ctrl/Cmd+S) while on a shared branch.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element | null)?.closest?.("button");
      if (sharedRef.current && b && b.textContent?.trim() === "Save") {
        e.preventDefault();
        e.stopPropagation();
        setPopup(true);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (sharedRef.current && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        e.stopPropagation();
        setPopup(true);
      }
      if (e.key === "Escape") setPopup(false);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);

  // Is there an open PR from this branch into develop? Public repo, so no login needed.
  useEffect(() => {
    if (!branch || shared) return;
    let live = true;
    const load = () =>
      fetch(`https://api.github.com/repos/${REPO}/pulls?state=open&base=develop&head=${OWNER}:${encodeURIComponent(branch)}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((list: Pr[]) => live && setPr(list[0] ?? null))
        .catch(() => {});
    load();
    const t = setInterval(load, 20000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [branch, shared]);

  if (!branch) return null;

  if (shared) {
    return (
      <>
        <div style={{ ...pill, background: "#7a4b00" }} role="status">
          You are on {branch}. Create a new branch before editing.
        </div>
        {popup ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create a branch first"
            style={{ position: "fixed", inset: 0, zIndex: 2147483001, display: "grid", placeItems: "center", background: "rgba(0,0,0,.55)" }}
            onClick={() => setPopup(false)}
          >
            <div
              style={{ maxWidth: 420, margin: 16, padding: 24, borderRadius: 14, background: "#14181f", color: "#fff", font: "400 14px/1.5 system-ui, sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ margin: 0, font: "600 17px system-ui, sans-serif" }}>Create a new branch first</p>
              <p style={{ margin: "12px 0 0" }}>
                Changes are never saved on {branch}. Open the branch menu at the top left of the editor, choose
                New branch, give it a short name such as seo/update-titles, then make your changes there. When
                you are done, use Create pull request.
              </p>
              <p style={{ margin: "20px 0 0", textAlign: "right" }}>
                <button type="button" style={btn} autoFocus onClick={() => setPopup(false)}>
                  Got it
                </button>
              </p>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  const compare = `https://github.com/${REPO}/compare/develop...${branch.split("/").map(encodeURIComponent).join("/")}?expand=1`;
  return (
    <div style={pill} role="status">
      {pr ? (
        <>
          <span>PR #{pr.number} is open. Save adds your changes to it.</span>
          <a href={pr.html_url} target="_blank" rel="noreferrer" style={btn}>
            View PR
          </a>
        </>
      ) : (
        <>
          <span>Branch {branch}. Save, then open a PR into develop.</span>
          <a href={compare} target="_blank" rel="noreferrer" style={btn}>
            Create pull request
          </a>
        </>
      )}
    </div>
  );
}
