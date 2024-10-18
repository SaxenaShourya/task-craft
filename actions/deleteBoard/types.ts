import { z } from "zod";

export const DeleteBoardSchema = z.object({
  id: z.string(),
});

export type InputType = z.infer<typeof DeleteBoardSchema>;
