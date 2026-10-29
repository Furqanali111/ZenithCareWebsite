"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { track } from "@/components/conversion-tracking";
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

const STEPS = ["About you", "Your practice", "Your message"] as const;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
] as const;

export function ContactForm() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [step, setStep] = useState(0);
  const panels = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // After Next or Back, put focus on the first field of the new step.
  useEffect(() => {
    if (!moved.current) return;
    panels.current
      ?.querySelector<HTMLElement>(`[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`)
      ?.focus();
  }, [step]);

  function next() {
    const fields = panels.current?.querySelectorAll<HTMLInputElement>(
      `[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`,
    );
    for (const el of Array.from(fields ?? [])) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return;
      }
    }
    moved.current = true;
    setStep((v) => Math.min(v + 1, STEPS.length - 1));
  }
  function back() {
    moved.current = true;
    setStep((v) => Math.max(v - 1, 0));
  }
  // Enter inside a field moves to the next step instead of submitting early.
  function onKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && step < STEPS.length - 1 && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
      next();
    }
  }

  if (!formspreeId) {
    // No endpoint configured, don't render a form that would submit to "".
    // Three-door CTAs above the form stay as the primary path meanwhile.
    return (
      <p className="rounded-lg border border-dashed border-border/80 bg-surface-tint p-6 text-sm text-muted-foreground">
        The online form is not available right now. Please use the email,
        WhatsApp or booking options above and we will reply within one
        business day.
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
      track("contact_form_success");
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
        className="rounded-xl border border-border bg-surface-tint p-8 text-center"
      >
        <h3 className="font-serif text-xl font-semibold text-brand-ink">
          Thanks, your message is in.
        </h3>
        <p className="mt-3 text-base text-body-ink">
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
      onKeyDown={onKeyDown}
      className="space-y-6"
      aria-describedby="contact-no-phi"
    >
      {/* Hidden metadata so Furqan can route by source + see a readable subject */}
      <input type="hidden" name="source" value="zenith-website-v1" />
      <input
        type="hidden"
        name="_subject"
        value="New Zenith inquiry (website form)"
      />

      <p
        id="contact-no-phi"
        className="rounded-md border border-border/80 bg-surface-tint px-4 py-3 text-sm text-muted-foreground"
      >
        <strong className="font-medium text-ink-strong">
          Please do not submit patient information
        </strong>. This form is for provider contact details only. Patient
        data belongs inside your EHR under a signed BAA.
      </p>

      <ol aria-label="Form progress" className="flex justify-between gap-2 text-sm">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={`flex flex-1 items-center gap-2 transition-colors duration-500 ${
              i <= step ? "text-brand-ink" : "text-muted-foreground"
            }`}
          >
            <span
              className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-[background-color,border-color,color] duration-500 motion-reduce:transition-none ${
                i <= step
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background"
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="-mt-2 h-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
          style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <div ref={panels}>
        <div data-step="0" hidden={step !== 0} className="grid gap-5 md:grid-cols-2">
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
          <Field label="Your role" htmlFor="cf-role">
            <select
              id="cf-role"
              name="role"
              defaultValue=""
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select role…</option>
              <option value="Physician">Physician</option>
              <option value="Practice Manager">Practice Manager</option>
              <option value="Office Manager">Office Manager</option>
              <option value="Other">Other</option>
            </select>
          </Field>
        </div>
        <div data-step="1" hidden={step !== 1} className="grid gap-5 md:grid-cols-2">
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
        <div data-step="2" hidden={step !== 2} className="space-y-6">
          <Field label="What should we know?" htmlFor="cf-message" required>
            <Textarea
              id="cf-message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              placeholder="Panel size, EHR, timeline, anything useful before our call. No patient details, please."
              aria-describedby="contact-no-phi"
            />
          </Field>

          <div className="flex items-start gap-3">
            <input
              id="cf-consent"
              name="consent"
              type="checkbox"
              required
              className="mt-1 size-4 shrink-0 accent-[color:var(--color-brand-700)]"
            />
            <label htmlFor="cf-consent" className="text-sm text-body-ink">
              I agree that Zenith Care Solutions may use these details to reply to
              my inquiry, as described in the{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                Privacy Policy
              </Link>
              . I have not included patient information.
              <span aria-hidden="true" className="ml-1 text-[color:var(--color-error-600)]">*</span>
            </label>
          </div>

        </div>
      </div>

      {status.kind === "phi" ? (
        <div
          role="alert"
          className="rounded-md border border-[color:var(--color-error-600)]/40 bg-[color:var(--color-error-600)]/5 px-4 py-3 text-sm text-[color:var(--color-error-600)]"
        >
          Your message looks like it contains patient information
          ({humanisePhi(status.pattern)}). Please edit it out and resubmit, 
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

      <div className="flex items-center gap-3">
        {step > 0 ? (
          <Button type="button" variant="outline" size="lg" onClick={back}>
            Back
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button type="button" size="lg" onClick={next}>
            Next
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        )}
      </div>
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
