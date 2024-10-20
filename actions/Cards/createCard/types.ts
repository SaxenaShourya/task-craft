import { z } from "zod";

export const CreateCardSchema = z.object({
  title: z
    .string({
      required_error: "Card title is required",
    })
    .min(3, {
      message: "Card title must be at least 3 characters",
    })
    .max(25, {
      message: "Card title is too long. Please shorten it.",
    }),
  listId: z.string(),
  boardId: z.string(),
});

export type InputType = z.infer<typeof CreateCardSchema>;
