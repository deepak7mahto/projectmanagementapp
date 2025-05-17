import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// TODO: Define enums/types that match Supabase schema
const TaskStatus = z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
type TaskStatusType = z.infer<typeof TaskStatus>;

const Priority = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
type PriorityType = z.infer<typeof Priority>;

// Define a plain Task type matching Supabase schema
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatusType;
  priority: PriorityType;
  dueDate?: Date | null;
  projectId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

// Define TaskWithRelations for richer queries (optional, can be expanded for Supabase joins)
export type TaskWithRelations = Task & {
  project?: { id: string; name: string };
  createdByUser?: { id: string; name: string | null };
  assignees?: Array<{ userId: string; user: { id: string; name: string | null } }>;
  tags?: Array<{ tagId: string; tag: { id: string; name: string } }>;
};

export const taskRouter = createTRPCRouter({
  // Create a new task
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        status: TaskStatus.default("TODO"),
        priority: Priority.default("MEDIUM"),
        dueDate: z.date().optional(),
        projectId: z.string(),
        assigneeIds: z.array(z.string()).optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<TaskWithRelations> => {
      const { db, session } = ctx;
      const { assigneeIds = [], tagIds = [], ...data } = input;

      // Verify user has access to the project
      const project = await db.project.findFirst({
        where: {
          id: data.projectId,
          OR: [
            { ownerId: session.user.id },
            { members: { some: { userId: session.user.id } } },
          ],
        },
      });

      if (!project) {
        throw new Error("Project not found or access denied");
      }

      // Create the task
      const task = await db.task.create({
        data: {
          ...data,
          createdById: session.user.id,
          assignees: assigneeIds.length > 0 ? {
            create: assigneeIds.map(userId => ({
              userId,
              assignedById: session.user.id,
            }))
          } : undefined,
          tags: tagIds.length > 0 ? {
            create: tagIds.map(tagId => ({
              tagId,
              assignedById: session.user.id,
            }))
          } : undefined,
        },
        include: {
          project: {
            select: { id: true, name: true }
          },
          createdBy: {
            select: { id: true, name: true }
          },
          assignees: {
            include: {
              user: {
                select: { id: true, name: true }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      return task as unknown as TaskWithRelations;
    }),

  // Get task by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<TaskWithRelations | null> => {
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: {
          project: {
            select: { id: true, name: true }
          },
          createdBy: {
            select: { id: true, name: true }
          },
          assignees: {
            include: {
              user: {
                select: { id: true, name: true }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      if (!task) return null;

      // Verify user has access to the project
      const hasAccess = await ctx.db.project.findFirst({
        where: {
          id: task.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!hasAccess) {
        throw new Error("Access denied");
      }

      return task as unknown as TaskWithRelations;
    }),

  // Update a task
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required").optional(),
        description: z.string().optional(),
        status: TaskStatus.optional(),
        priority: Priority.optional(),
        dueDate: z.date().optional().nullable(),
        assigneeIds: z.array(z.string()).optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<TaskWithRelations> => {
      const { id, assigneeIds, tagIds, ...updateData } = input;

      // First, verify the task exists and user has access
      const task = await ctx.db.task.findUnique({
        where: { id },
        include: { project: true }
      });

      if (!task) {
        throw new Error("Task not found");
      }

      const hasAccess = await ctx.db.project.findFirst({
        where: {
          id: task.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!hasAccess) {
        throw new Error("Access denied");
      }

      // Update the task
      const updatedTask = await ctx.db.task.update({
        where: { id },
        data: {
          ...updateData,
          // Handle assignees and tags updates if provided
          ...(assigneeIds && {
            assignees: {
              deleteMany: {},
              create: assigneeIds.map(userId => ({
                userId,
                assignedById: ctx.session.user.id,
              }))
            }
          }),
          ...(tagIds && {
            tags: {
              deleteMany: {},
              create: tagIds.map(tagId => ({
                tagId,
                assignedById: ctx.session.user.id,
              }))
            }
          })
        },
        include: {
          project: {
            select: { id: true, name: true }
          },
          createdBy: {
            select: { id: true, name: true }
          },
          assignees: {
            include: {
              user: {
                select: { id: true, name: true }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      return updatedTask as unknown as TaskWithRelations;
    }),

  // Delete a task
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First, verify the task exists and user has access
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: { project: true }
      });

      if (!task) {
        throw new Error("Task not found");
      }

      const hasAccess = await ctx.db.project.findFirst({
        where: {
          id: task.projectId,
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!hasAccess) {
        throw new Error("Access denied");
      }

      // Delete the task (cascading deletes will handle related records)
      await ctx.db.task.delete({
        where: { id: input.id },
      });

      return { success: true };
    })
});
