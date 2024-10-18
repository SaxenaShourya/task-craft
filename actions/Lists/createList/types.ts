import { z } from "zod";

export const CreateListSchema = z.object({
  title: z.string({
    required_error: "List title is required",
  }).min(3, {
    message: "List title must be at least 3 characters",
  }).max(20, {
    message: "List title is too long. Please shorten it.",
  }),
  boardId: z.string(),
});

export type InputType = z.infer<typeof CreateListSchema>;