import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "@/../drizzle/db";
import { polls, votes } from "@/../drizzle/schema";

export const getPolls = async () => {
  const pollData = await db
    .select({
      id: polls.id,
      question: polls.question,
      voteCount: sql`COUNT(${votes.id})`.as("vote_count"),
    })
    .from(polls)
    .leftJoin(votes, eq(votes.pollId, polls.id)) // Use the `eq` helper function
    .groupBy(polls.id);

  return pollData;
};
