"use client";

import { useId, useState } from "react";

const PATTERN = /^\/[a-z0-9/-]*$/;

/**
 * The path of a page SEO entry. An existing entry shows it read only, because changing it silently points the
 * entry at another page. A new entry (empty when the form opened) can be typed once, then stays editable until saved.
 */
export function LockedPathInput({ value, onChange, forceValidation }: { value: string; onChange: (v: string) => void; forceValidation: boolean }) {
  const [wasEmpty] = useState(() => value === "");
  const id = useId();
  const bad = value !== "" && !PATTERN.test(value);
  return (
    <div>
      {/* The Google preview finds this field by this label text, like every other field. */}
      <label htmlFor={id} style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        Page URL path{!wasEmpty && <span style={{ fontWeight: 400, opacity: 0.7 }}> (read only: it picks which page this entry is for)</span>}
      </label>
      <input
        id={id}
        value={value}
        readOnly={!wasEmpty}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={bad || (forceValidation && !value)}
        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #888", background: wasEmpty ? "transparent" : "rgba(128,128,128,0.15)", font: "inherit" }}
      />
      {(bad || (forceValidation && !value)) && (
        <p role="alert" style={{ color: "#b91c1c", fontSize: 12, margin: "4px 0 0" }}>Start with / and use lowercase letters, numbers, dashes and slashes.</p>
      )}
    </div>
  );
}
