
import { test, expect } from "vitest";
import { hello } from "./index.js";

test("should return greeting with provided name", () => {
  const result = hello("World");
  expect(result).toBe("Hello, World!!");
});