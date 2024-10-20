import { z } from "zod";

export const UpdateCardPositionSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      listId: z.string(),
    })
  ),
  boardId: z.string(),
});

export type InputType = z.infer<typeof UpdateCardPositionSchema>;
