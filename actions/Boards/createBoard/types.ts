import { z } from "zod";

export const CreateBoardSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title must be at least 3 characters",
  }).max(20, {
    message: "Title is too long. Please shorten it.",
  }),
  image: z.object({
    id: z.string().min(1, "Image selection is required"),
    urls: z.object({
      thumb: z.string().url(),
      full: z.string().url(),
    }),
    author: z.string(),
    links: z.object({
      html: z.string().url(),
    }),
  }).refine(data => data.id !== "", {
    message: "Please select an image",
    path: ["id"],
  }),
});

export type InputType = z.infer<typeof CreateBoardSchema>;