import type { BasicFormField } from "@keystatic/core";
import { LockedPathInput } from "./locked-path-input";

/** Page URL path field that cannot be edited on an existing entry (the component is a client module; this factory stays plain). */
export function lockedPath(label: string): BasicFormField<string> {
  return {
    kind: "form",
    label,
    Input: (props) => <LockedPathInput value={props.value} onChange={props.onChange} forceValidation={props.forceValidation} />,
    defaultValue: () => "",
    parse: (value) => (typeof value === "string" ? value : ""),
    serialize: (value) => ({ value }),
    validate: (value) => value,
    reader: { parse: (value) => (typeof value === "string" ? value : "") },
  };
}
