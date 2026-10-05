/* Turns a data value such as "At Risk" or "Focus & Deep Work" into a dictionary key segment
   ("at_risk", "focus_deep_work") so demo data can be displayed in the active language with
   `tOr(`data.status.${slug(value)}`, value)`. */
export const slug = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
