import { mockGenerator, USERS_MOCK } from "./mocks";
import { buildE2eEvents } from "./e2e-fixtures";

export const getEvents = async ({ e2e = false }: { e2e?: boolean } = {}) => {
  if (e2e) return buildE2eEvents();
  return await mockGenerator(80);
};

export const getUsers = async () => {
  return USERS_MOCK;
};
