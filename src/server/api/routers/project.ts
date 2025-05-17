import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Define the ProjectRole enum since it's not being imported correctly
const ProjectRole = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

type ProjectRoleType = keyof typeof ProjectRole;

export const projectRouter = createTRPCRouter({
  // Create a new project
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        startDate: z.date().optional(),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      return db.project.create({
        data: {
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          dueDate: input.dueDate,
          ownerId: session.user.id,
          members: {
            create: {
              userId: session.user.id,
              role: ProjectRole.ADMIN,
            },
          },
        },
      });
    }),

  // Get all projects for the current user
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        OR: [
          { ownerId: ctx.session.user.id },
          { members: { some: { userId: ctx.session.user.id } } },
        ],
      },
      include: {
        owner: {
          select: { name: true, image: true },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get a single project by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          owner: {
            select: { id: true, name: true, image: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
          tags: true,
          _count: {
            select: { tasks: true },
          },
        },
      });
    }),

  // Update a project
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        status: z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]).optional(),
        startDate: z.date().optional().nullable(),
        dueDate: z.date().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input: { id, ...data } }) => {
      // Verify user has permission to update this project
      const project = await ctx.db.project.findFirst({
        where: {
          id,
          OR: [
            { ownerId: ctx.session.user.id },
            {
              members: { some: { userId: ctx.session.user.id, role: "ADMIN" } },
            },
          ],
        },
      });

      if (!project) {
        throw new Error(
          "Project not found or you do not have permission to update it",
        );
      }

      return ctx.db.project.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    }),

  // Delete a project
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      // Only allow project owner to delete
      const project = await ctx.db.project.findFirst({
        where: {
          id,
          ownerId: ctx.session.user.id,
        },
      });

      if (!project) {
        throw new Error(
          "Project not found or you do not have permission to delete it",
        );
      }

      return ctx.db.project.delete({
        where: { id },
      });
    }),

  // Add member to project
  addMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.enum(["MEMBER", "ADMIN"]).default("MEMBER"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access to the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            {
              members: { some: { userId: ctx.session.user.id, role: "ADMIN" } },
            },
          ],
        },
      });

      if (!project) {
        throw new Error(
          "Project not found or you do not have permission to add members",
        );
      }

      return ctx.db.projectMember.create({
        data: {
          projectId: input.projectId,
          userId: input.userId,
          role: input.role,
        },
      });
    }),

  // Remove member from project
  removeMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access to the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            {
              members: { some: { userId: ctx.session.user.id, role: "ADMIN" } },
            },
          ],
        },
      });

      if (!project) {
        throw new Error(
          "Project not found or you do not have permission to remove members",
        );
      }

      // Prevent removing the project owner
      if (input.userId === project.ownerId) {
        throw new Error("Cannot remove the project owner");
      }

      return ctx.db.projectMember.delete({
        where: {
          projectId_userId: {
            projectId: input.projectId,
            userId: input.userId,
          },
        },
      });
    }),
});
