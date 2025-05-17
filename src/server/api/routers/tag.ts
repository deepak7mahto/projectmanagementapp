import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  // Create a new tag
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        color: z.string().default("#808080"),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id, role: 'ADMIN' } } },
          ],
        },
      });

      if (!project) {
        throw new Error('Project not found or access denied');
      }

      return ctx.db.tag.create({
        data: {
          name: input.name,
          color: input.color,
          projectId: input.projectId,
        },
      });
    }),

  // Get all tags for a project
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input: { projectId } }) => {
      // Verify user has access to the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!project) {
        throw new Error('Project not found or access denied');
      }

      return ctx.db.tag.findMany({
        where: { projectId },
        orderBy: { name: 'asc' },
      });
    }),

  // Update a tag
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      // Verify user has access to the tag's project
      const tag = await ctx.db.tag.findFirst({
        where: {
          id,
          project: {
            OR: [
              { ownerId: ctx.session.user.id },
              { members: { some: { userId: ctx.session.user.id, role: 'ADMIN' } } },
            ],
          },
        },
      });

      if (!tag) {
        throw new Error('Tag not found or access denied');
      }

      return ctx.db.tag.update({
        where: { id },
        data: {
          ...data,
        },
      });
    }),

  // Delete a tag
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      // Verify user has access to the tag's project
      const tag = await ctx.db.tag.findFirst({
        where: {
          id,
          project: {
            OR: [
              { ownerId: ctx.session.user.id },
              { members: { some: { userId: ctx.session.user.id, role: 'ADMIN' } } },
            ],
          },
        },
      });

      if (!tag) {
        throw new Error('Tag not found or access denied');
      }

      // First, remove all task associations
      await ctx.db.taskTag.deleteMany({
        where: { tagId: id },
      });

      // Then delete the tag
      return ctx.db.tag.delete({
        where: { id },
      });
    }),
});
