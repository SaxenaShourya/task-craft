import { z } from "zod";

export const UpdateListOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
  boardId: z.string(),
});

export type InputType = z.infer<typeof UpdateListOrderSchema>;

