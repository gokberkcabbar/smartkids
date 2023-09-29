import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { classRouter } from "./routers/class";
import { notificationRouter } from "./routers/notification";
import { tasksRouter } from "./routers/tasks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  class: classRouter,
  notification: notificationRouter,
  task: tasksRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
