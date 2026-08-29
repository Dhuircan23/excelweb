import { describe, expect, it } from "vitest";
import { isFieldInvalid, STEP_REQUIRED_FIELDS, type DiagnosticoFields } from "./validation";

const emptyFields: DiagnosticoFields = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  industry: "",
  currentProcess: "",
  fileCount: "",
  peopleCount: "",
  manualParts: "",
  problems: "",
  automationGoal: "",
};

describe("isFieldInvalid", () => {
  it("flags an empty required text field", () => {
    expect(isFieldInvalid(emptyFields, "name")).toBe(true);
  });

  it("flags a whitespace-only value as empty", () => {
    expect(isFieldInvalid({ ...emptyFields, name: "   " }, "name")).toBe(true);
  });

  it("accepts a filled text field", () => {
    expect(isFieldInvalid({ ...emptyFields, name: "Ana" }, "name")).toBe(false);
  });

  it("rejects an email without an @ or domain", () => {
    expect(isFieldInvalid({ ...emptyFields, email: "not-an-email" }, "email")).toBe(true);
  });

  it("accepts a well-formed email", () => {
    expect(isFieldInvalid({ ...emptyFields, email: "ana@andes.cl" }, "email")).toBe(false);
  });
});

describe("STEP_REQUIRED_FIELDS", () => {
  it("requires name, company and email on step 1", () => {
    expect(STEP_REQUIRED_FIELDS[1]).toEqual(["name", "company", "email"]);
  });

  it("requires currentProcess on step 2", () => {
    expect(STEP_REQUIRED_FIELDS[2]).toEqual(["currentProcess"]);
  });
});
