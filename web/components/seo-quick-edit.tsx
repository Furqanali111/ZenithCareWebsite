"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LIMITS, type EditTarget, type EditValues } from "@/lib/seo-edit";

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "ok"; text: string; url?: string } | { kind: "error"; text: string };

/** Inline SEO edit for one row of the dashboard. Saves through /api/seo-edit. */
export function SeoQuickEdit({ target, initial, onSaved }: { target: EditTarget; initial: EditValues; onSaved?: (pullRequestUrl: string | undefined, saved: EditValues) => void }) {
  const id = useId();
  const [v, setV] = useState(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const titleMax = target.kind === "post" ? LIMITS.postTitle : LIMITS.pageTitle;
  const dirty = JSON.stringify(v) !== JSON.stringify(initial);
  const invalid = v.title.length > titleMax || v.description.length > LIMITS.description || !v.description.trim() || (target.kind === "page" && !v.title.trim());

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/seo-edit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target, values: v }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string; url?: string; mode?: string };
      if (!res.ok) setStatus({ kind: "error", text: data.error ?? `Save failed (${res.status}).` });
      else {
        setStatus({ kind: "ok", text: data.mode === "pr" ? "Saved to a pull request. It goes live after review, merge and deploy." : (data.message ?? "Saved."), url: data.url });
        onSaved?.(data.url, v);
      }
    } catch {
      setStatus({ kind: "error", text: "Could not reach the server." });
    }
  }

  const count = (n: number, max: number) => <span className={n > max ? "text-red-700" : "text-muted-foreground"}>{n}/{max}</span>;

  return (
    <form onSubmit={save} className="space-y-3 rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quick edit</p>
      <div className="space-y-1">
        <Label htmlFor={`${id}-t`} className="flex justify-between text-sm">
          <span>{target.kind === "post" ? "SEO title (blank uses the H1)" : "SEO title (site name is added)"}</span>
          {count(v.title.length, titleMax)}
        </Label>
        <Input id={`${id}-t`} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${id}-d`} className="flex justify-between text-sm">
          <span>Meta description</span>
          {count(v.description.length, LIMITS.description)}
        </Label>
        <Textarea id={`${id}-d`} rows={3} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${id}-k`} className="text-sm">Focus keyword</Label>
        <Input id={`${id}-k`} value={v.focusKeyword} onChange={(e) => setV({ ...v, focusKeyword: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={v.noindex} onChange={(e) => setV({ ...v, noindex: e.target.checked })} />
        Hide from Google (noindex)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="sm" disabled={!dirty || invalid || status.kind === "saving"}>
          {status.kind === "saving" ? "Saving..." : "Save"}
        </Button>
        <p role="status" className={`text-sm ${status.kind === "error" ? "text-red-700" : "text-muted-foreground"}`}>
          {(status.kind === "ok" || status.kind === "error") && status.text}{" "}
          {status.kind === "ok" && status.url && (
            <a href={status.url} className="underline" target="_blank" rel="noreferrer">
              Open the pull request
            </a>
          )}
        </p>
      </div>
    </form>
  );
}
