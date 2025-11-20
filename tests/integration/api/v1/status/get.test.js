import { describe } from "node:test";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parseUpdatedAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toEqual(parseUpdatedAt);

      expect(responseBody.dependencies.database.version).toBeDefined();
      expect(responseBody.dependencies.database.version).toContain("16.");

      expect(responseBody.dependencies.database.max_connections).toBeDefined();
      expect(
        responseBody.dependencies.database.max_connections,
      ).toBeGreaterThan(0);
      //expect(responseBody.dependencies.database.max_connections).toEqual(100);

      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
      expect(
        responseBody.dependencies.database.opened_connections,
      ).toBeGreaterThan(0);
    });
  });
});
