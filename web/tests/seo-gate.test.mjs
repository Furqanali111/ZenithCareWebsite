import test from "node:test";
import assert from "node:assert/strict";
import { gateDecision } from "../lib/seo-gate.ts";

const basic = (user, pass) => `Basic ${btoa(`${user}:${pass}`)}`;
const prod = { production: true, writer: false };

test("gate: local dev with no password is open", () => {
  assert.equal(gateDecision({ production: false, writer: false }), "allow");
});

test("gate: production with no password fails closed for everyone but repo writers", () => {
  assert.equal(gateDecision({ ...prod }), "not-found");
  assert.equal(gateDecision({ ...prod, authorization: basic("x", "anything") }), "not-found");
  assert.equal(gateDecision({ ...prod, writer: true }), "allow");
});

test("gate: a repo writer gets in with or without the password set", () => {
  assert.equal(gateDecision({ ...prod, writer: true, password: "s3cret" }), "allow");
});

test("gate: password users need the exact password, any user name", () => {
  assert.equal(gateDecision({ ...prod, password: "s3cret", authorization: basic("anyone", "s3cret") }), "allow");
  assert.equal(gateDecision({ ...prod, password: "s3cret", authorization: basic("", "s3cret") }), "allow");
  assert.equal(gateDecision({ ...prod, password: "s3cret", authorization: basic("a", "s3cre") }), "unauthorized");
  assert.equal(gateDecision({ ...prod, password: "s3cret", authorization: basic("a", "s3cretX") }), "unauthorized");
});

test("gate: passwords with a colon work, empty and malformed headers are refused", () => {
  assert.equal(gateDecision({ ...prod, password: "a:b", authorization: basic("u", "a:b") }), "allow");
  for (const authorization of [undefined, null, "", "Basic", "Basic !!!not-base64!!!", "Bearer s3cret", basic("u", "")])
    assert.equal(gateDecision({ ...prod, password: "s3cret", authorization }), "unauthorized");
});

test("gate: a password set in dev is still enforced", () => {
  assert.equal(gateDecision({ production: false, writer: false, password: "s3cret" }), "unauthorized");
  assert.equal(gateDecision({ production: false, writer: false, password: "s3cret", authorization: basic("u", "s3cret") }), "allow");
});
