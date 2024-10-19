import { z } from "zod";

export const UpdateListSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters").max(20, "Title must be at most 20 characters"),
  boardId: z.string(),
});

export type InputType = z.infer<typeof UpdateListSchema>;