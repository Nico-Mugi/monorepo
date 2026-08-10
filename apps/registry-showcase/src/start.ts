import { createStart } from "@tanstack/react-start";
import {
  tanstackStartRequestLoggerMiddleware,
  tanstackStartServerFnLoggerMiddleware,
} from "@repo/logger/server/tanstack-start/middleware";

export const startInstance = createStart(() => ({
  requestMiddleware: [tanstackStartRequestLoggerMiddleware()],
  functionMiddleware: [tanstackStartServerFnLoggerMiddleware()],
}));
