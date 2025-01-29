import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/../drizzle/db";
import { polls, votes } from "@/../drizzle/schema";
import { getUser } from "@/app/(auth)/_lib/dal";

export const getPolls = async () => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const pollData = await db
    .select({
      id: polls.id,
      question: polls.question,
      voteCount: sql`COUNT(${votes.id})`.as("vote_count"),
      creatorId: polls.creatorId,
      createdAt: polls.createdAt,
    })
    .from(polls)
    .leftJoin(votes, eq(votes.pollId, polls.id))
    .where(eq(polls.creatorId, user?.id))
    .groupBy(polls.id)
    .orderBy(desc(polls.createdAt));

  return pollData;
};
