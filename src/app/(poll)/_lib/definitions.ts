import { z } from "zod";

export const CreatePollFormSchema = z.object({
  question: z
    .string()
    .min(10, { message: "Question must be at least 10 characters long." })
    .max(500, { message: "Question cannot exceed 500 characters." })
    .trim(),
  options: z
    .array(
      z
        .string()
        .min(1, { message: "Option text must not be empty." })
        .max(100, { message: "Option text cannot exceed 100 characters." })
        .trim()
    )
    .min(2, { message: "Poll must have at least two options." })
    .max(10, { message: "Poll cannot have more than 10 options." }),
  creatorId: z.number().int().nonnegative({
    message: "Creator ID must be a valid non-negative integer.",
  }),
});

export type FormState =
  | {
      errors?: {
        question?: string[];
        options?: string[];
        creatorId?: string[];
      };
      message?: string;
    }
  | undefined;
