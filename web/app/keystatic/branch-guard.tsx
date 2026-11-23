"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Keystatic's own toolbar cannot be changed, so this adds a small layer on top of it:
// - on develop (or another shared branch) it asks /api/publish for the person's own content branch and moves
//   the editor there; if that fails, a Save click is stopped and a popup says to make a branch
// - on the person's own feature/content-<login> branch a pill says where their edits are, with a Publish button
//   (app/api/publish/route.ts); while publishing, Save, Create and Delete are stopped
// - on any other branch a pill links to the open PR, or to "create pull request" against develop
// The real guard is GitHub branch protection on develop; this only explains it before the editor hits it.
// Only active when the URL has /branch/<name> (production). Local dev has no branches.
import { BASE_BRANCH, REPO } from "@/lib/repo";
import { pillView, type PublishState } from "@/lib/publish-state";
const OWNER = REPO.split("/")[0];
const SHARED = [BASE_BRANCH, "deployment-branch", "main"];
const OWN = "feature/content-";
// Visible labels of Keystatic's buttons that write to the branch: Save, Create (new entry), Yes, delete (confirm).
const WRITES = ["save", "create", "yes, delete"];
const POLL = 15_000;

const branchOf = (pathname: string) => {
  const m = pathname.match(/\/keystatic\/branch\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};
const writeButton = (t: EventTarget | null) => {
  const b = (t as Element | null)?.closest?.("button");
  return !!b && WRITES.includes(b.textContent?.trim().toLowerCase() ?? "");
};

type Answer = PublishState & { branch: string };
async function api(action?: "open" | "publish") {
  const r = await fetch("/api/publish", action ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) } : { cache: "no-store" });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(body.error || "Something went wrong. Try again in a few minutes."), { status: r.status });
  return body as Answer;
}

type Pr = { number: number; html_url: string };
// sticky: the note came from a Publish click, so it stays until the state changes, not just until the next poll.
type Pub = { answer: Answer | null; saw: boolean; note: string | null; sticky: boolean };

const pill = {
  position: "fixed",
  right: 16,
  bottom: 16,
  maxWidth: "calc(100vw - 32px)",
  zIndex: 2147483000,
  display: "flex",
  flexWrap: "wrap",
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
// Inline styles cannot do :focus-visible, so the focus ring and touch size live here. The form padding lets
// the last field scroll clear of the pill.
const css = `#keystatic-main-panel form{padding-bottom:128px}.zc-guard a,.zc-guard button{min-height:44px;display:inline-flex;align-items:center}.zc-guard a:focus-visible,.zc-guard button:focus-visible{outline:3px solid #fff;outline-offset:2px}.zc-guard button:disabled{opacity:.7;cursor:wait}`;

function Popup({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ok = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    ok.current?.focus();
    return () => back?.focus?.();
  }, []);
  // On body and marked top layer, so an open Keystatic dialog or menu neither hides it from screen readers nor pulls focus back.
  return createPortal(
    <div
      className="zc-guard"
      data-react-aria-top-layer=""
      role="dialog"
      aria-modal="true"
      aria-label={label}
      style={{ position: "fixed", inset: 0, zIndex: 2147483001, display: "grid", placeItems: "center", background: "rgba(0,0,0,.55)" }}
      onClick={onClose}
      onKeyDown={(e) => {
        // The only focusable thing is Got it, so Tab stays on it.
        if (e.key === "Tab") {
          e.preventDefault();
          ok.current?.focus();
        }
      }}
    >
      <div
        style={{ maxWidth: 420, margin: 16, padding: 24, borderRadius: 14, background: "#14181f", color: "#fff", font: "400 14px/1.5 system-ui, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <p style={{ margin: "20px 0 0", textAlign: "right" }}>
          <button ref={ok} type="button" style={btn} onClick={onClose}>
            Got it
          </button>
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default function BranchGuard() {
  const [branch, setBranch] = useState<string | null>(null);
  const [pr, setPr] = useState<Pr | null>(null);
  const [popup, setPopup] = useState(false);
  const [openError, setOpenError] = useState<string | null>(null);
  const [pub, setPub] = useState<Pub>({ answer: null, saw: false, note: null, sticky: false });
  const [busy, setBusy] = useState(false);
  const shared = branch !== null && SHARED.includes(branch);
  const candidate = branch?.startsWith(OWN) ? branch : null;
  const own = pub.answer !== null && pub.answer.branch === branch;
  const other = branch !== null && !shared && (!candidate || (pub.answer !== null && !own));
  const publishing = own && pub.answer!.kind === "publishing";
  const blockRef = useRef(false);
  useEffect(() => {
    blockRef.current = shared || publishing;
  }, [shared, publishing]);

  // Keystatic routes client-side, so poll the address instead of waiting for a reload.
  useEffect(() => {
    const read = () => setBranch(branchOf(window.location.pathname));
    read();
    const t = setInterval(read, 500);
    return () => clearInterval(t);
  }, []);

  // Stop Save, Create, Delete (button or Ctrl/Cmd+S) while on a shared branch or while publishing.
  useEffect(() => {
    const stop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      setPopup(true);
    };
    const onClick = (e: MouseEvent) => {
      if (blockRef.current && writeButton(e.target)) stop(e);
    };
    const onKey = (e: KeyboardEvent) => {
      if (blockRef.current && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") stop(e);
      // Keystatic's Delete confirm presses on keys, not click. Show the popup on key up, so that key
      // up does not land on Got it and close it again.
      else if (blockRef.current && (e.key === "Enter" || e.key === " ") && writeButton(e.target)) {
        if (e.type === "keyup") stop(e);
        else {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      if (e.key === "Escape") setPopup(false);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("keyup", onKey, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("keyup", onKey, true);
    };
  }, []);

  // On a shared branch, move the editor to the person's own branch, once per visit.
  const opened = useRef(false);
  useEffect(() => {
    if (!shared || opened.current) return;
    opened.current = true;
    api("open").then(
      ({ branch: b }) => {
        const { pathname, search, hash } = window.location;
        const path = pathname.replace(/(\/keystatic\/branch\/)[^/]+/, `$1${encodeURIComponent(b)}`);
        window.history.replaceState(window.history.state, "", path + search + hash);
        // Keystatic's router re-reads the address on popstate.
        window.dispatchEvent(new PopStateEvent("popstate"));
      },
      (e: Error) => setOpenError(e.message),
    );
  }, [shared]);

  // On a feature/content-* branch, ask every 15 seconds while the tab is visible; back off on errors.
  useEffect(() => {
    if (!candidate) return;
    let live = true;
    let inFlight = false;
    let wait = POLL;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      clearTimeout(timer);
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const a = await api();
        if (!live) return;
        wait = POLL;
        setPub((p) => ({ answer: a, saw: pillView(a, p.saw).saw, ...(p.sticky && p.answer?.kind === a.kind ? { note: p.note, sticky: true } : { note: null, sticky: false }) }));
      } catch (e) {
        if (!live) return;
        wait = Math.min(wait * 2, 8 * POLL);
        setPub((p) => ({ ...p, note: (e as Error).message, sticky: false }));
      } finally {
        inFlight = false;
        if (live && !document.hidden) timer = setTimeout(tick, wait);
      }
    };
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    tick();
    return () => {
      live = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [candidate]);

  // Is there an open PR from this branch into develop? Public repo, so no login needed.
  useEffect(() => {
    if (!branch || !other) return;
    let live = true;
    const load = () =>
      fetch(`https://api.github.com/repos/${REPO}/pulls?state=open&base=${BASE_BRANCH}&head=${OWNER}:${encodeURIComponent(branch)}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((list: Pr[]) => live && setPr(list[0] ?? null))
        .catch(() => {});
    load();
    const t = setInterval(load, 20000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [branch, other]);

  const publish = async () => {
    setBusy(true);
    try {
      const a = await api("publish");
      setPub((p) => ({ answer: a, saw: pillView(a, p.saw).saw, note: null, sticky: false }));
    } catch (e) {
      const { message, status } = e as Error & { status: number };
      setPub((p) => ({ ...p, ...(status === 409 && p.answer ? { answer: { branch: p.answer.branch, kind: "clean" } } : {}), note: message, sticky: true }));
    } finally {
      setBusy(false);
    }
  };

  if (!branch) return null;

  const closePopup = () => setPopup(false);
  if (shared) {
    return (
      <>
        <style>{css}</style>
        <div style={{ ...pill, background: "#7a4b00" }} role="status">
          {openError ? `Could not open your private copy. Reload the page. If this stays, ask Furqan. ${openError}` : "Opening your private copy."}
        </div>
        {popup ? (
          <Popup label="Could not open your private copy" onClose={closePopup}>
            <p style={{ margin: 0, font: "600 17px system-ui, sans-serif" }}>Could not open your private copy</p>
            <p style={{ margin: "12px 0 0" }}>Reload the page. If this stays, ask Furqan.</p>
          </Popup>
        ) : null}
      </>
    );
  }

  if (candidate && !other) {
    // Not known yet whose branch this is: say nothing until the first answer, unless it failed.
    if (!own && !pub.note) return null;
    const v = own ? pillView(pub.answer!, pub.saw) : null;
    return (
      <>
        <style>{css}</style>
        <div className="zc-guard" style={pill}>
          <span role="status">{pub.note ?? v?.text}</span>
          {v?.button ? (
            <button type="button" style={btn} disabled={busy} onClick={v.button === "Reload" ? () => window.location.reload() : publish}>
              {v.button}
            </button>
          ) : null}
        </div>
        {popup ? (
          <Popup label="Publishing" onClose={closePopup}>
            <p style={{ margin: 0 }}>Publishing. You can save again in a few minutes.</p>
          </Popup>
        ) : null}
      </>
    );
  }

  const compare = `https://github.com/${REPO}/compare/${BASE_BRANCH}...${branch.split("/").map(encodeURIComponent).join("/")}?expand=1`;
  return (
    <>
      <style>{css}</style>
      <div className="zc-guard" style={pill} role="status">
        {pr ? (
          <>
            <span>PR #{pr.number} is open. Save adds your changes to it.</span>
            <a href={pr.html_url} target="_blank" rel="noreferrer" style={btn}>
              View PR
            </a>
          </>
        ) : (
          <>
            <span>Branch {branch}. Save, then open a PR into {BASE_BRANCH}.</span>
            <a href={compare} target="_blank" rel="noreferrer" style={btn}>
              Create pull request
            </a>
          </>
        )}
      </div>
    </>
  );
}
