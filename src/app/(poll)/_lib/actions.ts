"use server";

// import { redirect } from "next/navigation";
import { db } from "@/../drizzle/db";
import { polls, pollOptions } from "@/../drizzle/schema";
import { getUser } from "@/app/(auth)/_lib/dal";
import { FormState, CreatePollFormSchema } from "@/app/(poll)/_lib/definitions";

export async function createPoll(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Get the current user
  const user = await getUser();
  if (!user?.id) {
    return {
      message: "You must be logged in to create a poll.",
    };
  }

  // 2. Validate form fields
  const validatedFields = CreatePollFormSchema.safeParse({
    question: formData.get("question"),
    options: formData.getAll("options"),
    creatorId: user.id, // Automatically include user ID
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 3. Extract validated data
  const { question, options } = validatedFields.data;

  // 4. Insert the poll into the database
  try {
    const insertedPoll = await db
      .insert(polls)
      .values({
        creatorId: user.id,
        question,
      })
      .returning({ id: polls.id });

    const pollId = insertedPoll[0]?.id;

    if (!pollId) {
      return {
        message: "An error occurred while creating the poll.",
      };
    }

    // 5. Insert poll options into the database
    const optionInsertions = options.map((optionText) => ({
      pollId,
      optionText,
    }));

    await db.insert(pollOptions).values(optionInsertions);

    // redirect("/dashboard");
    return {
      message: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred while creating the poll.",
    };
  }
}
