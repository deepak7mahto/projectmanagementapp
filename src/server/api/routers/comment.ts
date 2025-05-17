import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  // Add a comment to a task
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        content: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to the task
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.taskId,
          project: {
            OR: [
              { ownerId: ctx.session.user.id },
              { members: { some: { userId: ctx.session.user.id } } },
            ],
          },
        },
      });

      if (!task) {
        throw new Error('Task not found or access denied');
      }

      return ctx.db.comment.create({
        data: {
          content: input.content,
          taskId: input.taskId,
          authorId: ctx.session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  // Get all comments for a task
  getByTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input: { taskId } }) => {
      // Verify user has access to the task
      const task = await ctx.db.task.findFirst({
        where: {
          id: taskId,
          project: {
            OR: [
              { ownerId: ctx.session.user.id },
              { members: { some: { userId: ctx.session.user.id } } },
            ],
          },
        },
      });

      if (!task) {
        throw new Error('Task not found or access denied');
      }

      return ctx.db.comment.findMany({
        where: { taskId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    }),

  // Update a comment
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .mutation(async ({ ctx, input: { id, content } }) => {
      // Verify the comment exists and belongs to the user
      const comment = await ctx.db.comment.findFirst({
        where: {
          id,
          authorId: ctx.session.user.id,
        },
      });

      if (!comment) {
        throw new Error('Comment not found or access denied');
      }

      return ctx.db.comment.update({
        where: { id },
        data: {
          content,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  // Delete a comment
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      // Verify the comment exists and belongs to the user or user is admin
      const comment = await ctx.db.comment.findFirst({
        where: {
          id,
          OR: [
            { authorId: ctx.session.user.id },
            {
              task: {
                project: {
                  OR: [
                    { ownerId: ctx.session.user.id },
                    { members: { some: { userId: ctx.session.user.id, role: 'ADMIN' } } },
                  ],
                },
              },
            },
          ],
        },
      });

      if (!comment) {
        throw new Error('Comment not found or access denied');
      }

      return ctx.db.comment.delete({
        where: { id },
      });
    }),
});
