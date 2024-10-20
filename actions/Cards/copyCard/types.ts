import { z } from "zod";

export const CopyCardSchema = z.object({
  id: z.string(),
  boardId: z.string(),
});

export type InputType = z.infer<typeof CopyCardSchema>;