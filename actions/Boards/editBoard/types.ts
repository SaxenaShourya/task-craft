import { z } from "zod";

export const UpdateBoardSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters").max(20, "Title must be at most 20 characters"),
});

export type InputType = z.infer<typeof UpdateBoardSchema>;