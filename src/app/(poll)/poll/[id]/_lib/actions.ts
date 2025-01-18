"use server";

import { eq, and } from "drizzle-orm";

import { db } from "@/../drizzle/db";
import { pollOptions, votes } from "@/../drizzle/schema";
import { FormState, voteSchema } from "./definitions";
import { getUser } from "@/app/(auth)/_lib/dal";
import { getIp } from "@/lib/getIp";
import { revalidatePath } from "next/cache";

export async function submitVote(
  state: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const user = await getUser();
  const ipAddress = await getIp();
  const userId = user?.id;

  // 1. Validate form fields using Zod
  const result = voteSchema.safeParse({
    pollId: Number(formData.get("pollId")),
    selectedOption: Number(formData.get("selectedOption")),
  });

  // If validation fails, return errors
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  // 2. Extract validated data
  const { pollId, selectedOption } = result.data;

  try {
    // 3. Check if the poll option exists in the database
    const optionExists = await db
      .select()
      .from(pollOptions)
      .where(
        and(eq(pollOptions.id, selectedOption), eq(pollOptions.pollId, pollId))
      )
      .limit(1);

    if (!optionExists.length) {
      return {
        message: "Invalid poll or option.",
      };
    }

    const existingVote = await db
      .select()
      .from(votes)
      .where(
        and(
          eq(votes.pollId, pollId),
          userId
            ? eq(votes.userId, userId)
            : eq(votes.ipAddress, String(ipAddress))
        )
      )
      .limit(1);

    if (existingVote.length > 0) {
      return {
        message: "You have already voted in this poll.",
      };
    }

    // 4. Insert the vote record
    await db.insert(votes).values({
      pollId,
      optionId: selectedOption,
      userId: userId || null,
      ipAddress: userId ? null : ipAddress,
    });

    revalidatePath(`/poll/${pollId}`);

    return { message: "Vote submitted successfully." };
  } catch (error) {
    console.error("Database error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
