"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { findPhi, type PhiHit } from "@/lib/validate";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "phi"; pattern: PhiHit["pattern"] }
  | { kind: "error"; message: string }
  | { kind: "success" };

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const;

export function ContactForm() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  if (!formspreeId) {
    // No endpoint configured — don't render a form that would submit to "".
    // Three-door CTAs above the form stay as the primary path meanwhile.
    return (
      <p className="rounded-lg border border-dashed border-border/80 bg-[color:var(--color-surface-50)] p-6 text-sm text-muted-foreground">
        The fallback contact form will light up here once the Formspree
        endpoint is configured. In the meantime, use the WhatsApp, email, or
        Calendly options above.
      </p>
    );
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);

    const message = String(data.get("message") ?? "");
    const phi = findPhi(message);
    if (phi) {
      setStatus({ kind: "phi", pattern: phi.pattern });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: `Submission failed (${res.status}). Please email us directly.`,
        });
        return;
      }
      form.reset();
      setStatus({ kind: "success" });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Network error. Please try again, or email us directly.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-border bg-[color:var(--color-surface-50)] p-8 text-center"
      >
        <h3 className="font-serif text-xl font-semibold text-[color:var(--color-brand-900)]">
          Thanks — your message is in.
        </h3>
        <p className="mt-3 text-base text-[color:var(--color-ink-600)]">
          We&rsquo;ll reply within one business day. If it&rsquo;s urgent,
          WhatsApp us using the button above.
        </p>
      </div>
    );
  }

  const isSubmitting = status.kind === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-describedby="contact-no-phi"
    >
      {/* Hidden metadata so Ali can route by source + see a readable subject */}
      <input type="hidden" name="source" value="zenith-website-v1" />
      <input
        type="hidden"
        name="_subject"
        value="New Zenith inquiry (website form)"
      />

      <p
        id="contact-no-phi"
        className="rounded-md border border-border/80 bg-[color:var(--color-surface-50)] px-4 py-3 text-sm text-muted-foreground"
      >
        <strong className="font-medium text-[color:var(--color-ink-900)]">
          Please do not submit patient information
        </strong>{" "}
        — this form is for provider contact details only. Patient data
        belongs inside your EHR under a signed BAA.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" htmlFor="cf-name" required>
          <Input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
          />
        </Field>
        <Field label="Work email" htmlFor="cf-email" required>
          <Input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
          />
        </Field>
        <Field label="Practice name" htmlFor="cf-practice" required>
          <Input
            id="cf-practice"
            name="practice"
            type="text"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={120}
          />
        </Field>
        <Field label="State" htmlFor="cf-state" required>
          <select
            id="cf-state"
            name="state"
            required
            defaultValue=""
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              Select…
            </option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Your role" htmlFor="cf-role">
          <select
            id="cf-role"
            name="role"
            defaultValue=""
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">—</option>
            <option value="Physician">Physician</option>
            <option value="Practice Manager">Practice Manager</option>
            <option value="Office Manager">Office Manager</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Approx. Medicare patients" htmlFor="cf-patient-count">
          <Input
            id="cf-patient-count"
            name="patientCount"
            type="number"
            min={0}
            max={5000}
            step={10}
            placeholder="e.g. 200"
          />
        </Field>
      </div>

      <Field label="What should we know?" htmlFor="cf-message" required>
        <Textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Panel size, EHR, timeline — anything useful before our call. No patient details, please."
          aria-describedby="contact-no-phi"
        />
      </Field>

      {status.kind === "phi" ? (
        <div
          role="alert"
          className="rounded-md border border-[color:var(--color-error-600)]/40 bg-[color:var(--color-error-600)]/5 px-4 py-3 text-sm text-[color:var(--color-error-600)]"
        >
          Your message looks like it contains patient information
          ({humanisePhi(status.pattern)}). Please edit it out and resubmit —
          this form is for provider contact only.
        </div>
      ) : null}

      {status.kind === "error" ? (
        <div
          role="alert"
          className="rounded-md border border-[color:var(--color-error-600)]/40 bg-[color:var(--color-error-600)]/5 px-4 py-3 text-sm text-[color:var(--color-error-600)]"
        >
          {status.message}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-[color:var(--color-error-600)]">
            *
          </span>
        ) : null}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function humanisePhi(pattern: PhiHit["pattern"]): string {
  switch (pattern) {
    case "ssn":
      return "a Social Security number";
    case "mrn":
      return "a medical record number";
    case "dob":
      return "a date of birth";
    case "patient_name":
      return "a patient name";
  }
}
