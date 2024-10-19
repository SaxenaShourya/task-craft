import { z } from "zod";

export const CopyListSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export type InputType = z.infer<typeof CopyListSchema>;