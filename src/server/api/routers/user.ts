import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { supabase } from "../../../utils/supabaseClient";
import { supabaseAdmin } from "../../../server/utils/supabaseAdmin";

export const userRouter = createTRPCRouter({
  deleteUser: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", input.id);

      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
        input.id,
      );

      if (authError) {
        throw new Error(authError.message);
      }

      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    }),
});
