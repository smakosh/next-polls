import { z } from "zod";

export const voteSchema = z.object({
  pollId: z.number().int().positive(),
  selectedOption: z.number().int().positive(),
});

export interface FormState {
  errors?: {
    selectedOption?: string[];
    pollId?: string[];
  };
  message?: string;
}
