import test from "node:test";
import assert from "node:assert/strict";
import { findPhi } from "../lib/validate.ts";
import { estimateRoi, roundToHundred } from "../lib/roi.ts";

const kind = (t) => findPhi(t)?.pattern ?? null;

test("PHI shapes are caught", () => {
  assert.equal(kind("Here is 123-45-6789 for you"), "ssn");
  assert.equal(kind("MRN: 445566"), "mrn");
  assert.equal(kind("DOB 03/14/1952 please"), "dob");
  assert.equal(kind("born 03/14/1952"), "dob");
  assert.equal(kind("Patient Smith has diabetes"), "patient_name");
  assert.equal(kind("the patient Johnson is overdue"), "patient_name");
});

test("B2B text is not flagged as PHI", () => {
  for (const t of [
    "Please call me at 555-1234",
    "I have 2 patients ready",
    "We'd like Patient Care Coordinator staffing",
    "interested in your Patient Coordinator service",
    "Does this integrate with our Patient Portal?",
    "we want to improve Patient Experience",
    "We'd like to onboard by 03/15/2027",
    "Last audit was 12/31/2024",
  ]) assert.equal(kind(t), null, t);
});

test("ROI: 200 patients at 100% is the $13,200 anchor, clamped inputs", () => {
  assert.equal(estimateRoi(200, 1).monthlyMid, 13200);
  assert.equal(estimateRoi(-5, 2).monthlyMid, 0);
  assert.equal(estimateRoi(10.9, 1).monthlyMid, 660);
  assert.equal(roundToHundred(13249), 13200);
});
