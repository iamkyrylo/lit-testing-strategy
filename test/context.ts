import { test as baseTest } from "vitest";
import { server } from "./server";
import { testSchema } from "./mocks/schema";

interface TestContext {
  server: typeof server;
  schema: typeof testSchema;
}

export const test = baseTest.extend<TestContext>({
  server: [
    // eslint-disable-next-line no-empty-pattern -- Vitest requires the destructuring pattern to statically detect fixture dependencies
    async ({}, use) => {
      server.listen({ onUnhandledRequest: "error" });
      await use(server);
      server.close();
    },
    { scope: "file", auto: true },
  ],
  schema: [
    // eslint-disable-next-line no-empty-pattern -- Vitest requires the destructuring pattern to statically detect fixture dependencies
    async ({}, use) => {
      testSchema.emptyData();
      await use(testSchema);
      server.resetHandlers();
    },
    { auto: true },
  ],
});

export { describe, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from "vitest";
