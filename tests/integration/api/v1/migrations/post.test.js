import database from 'infra/database.js';
import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;")
})

test("POST to /api/v1/migrations should return 200", async () => {
  const responseA = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST',
  });
  expect(responseA.status).toBe(201);
  
  const responseABody = await responseA.json();

  expect(Array.isArray(responseABody)).toBe(true);
  expect(responseABody.length).toBeGreaterThan(0);



  const responseB = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST',
  });
  expect(responseB.status).toBe(200);

  const responseBBody = await responseB.json();

  expect(Array.isArray(responseBBody)).toBe(true);
  expect(responseBBody.length).toBe(0);
});
