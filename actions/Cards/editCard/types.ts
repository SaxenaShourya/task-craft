import { z } from "zod";

export const UpdateCardSchema = z.object({
  id: z.string(),
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
  description: z
    .string()
    .max(120, {
      message:
        "Description is too long. Please shorten it to 120 characters or less.",
    })
    .optional(),
  boardId: z.string(),
});

export type InputType = z.infer<typeof UpdateCardSchema>;
