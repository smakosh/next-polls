import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";

import { db } from "@/../drizzle/db";
import { polls, pollOptions, votes } from "@/../drizzle/schema";
import { VoteForm } from "./_components/vote-form";
import { getUser } from "@/app/(auth)/_lib/dal";
import { unstable_noStore } from "next/cache";
import { getIp } from "@/lib/getIp";

export default async function PollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  unstable_noStore();
  const pageParams = await params;
  const user = await getUser();
  const userId = user?.id;
  const userIp = await getIp();
  const pollId = parseInt(pageParams.id);

  // Fetch poll data with options and vote counts
  const pollData = await db
    .select({
      id: polls.id,
      question: polls.question,
      options: sql<
        {
          id: number;
          text: string;
          votes: number;
        }[]
      >`json_agg(
        json_build_object(
          'id', ${pollOptions.id},
          'text', ${pollOptions.optionText},
          'votes', (SELECT COUNT(*) FROM ${votes} WHERE ${votes.optionId} = ${pollOptions.id})
        )
      )`.as("options"),
      userVote: sql<number | null>`(
        SELECT ${votes.optionId}
        FROM ${votes}
        WHERE ${votes.pollId} = ${polls.id}
        AND (
          (${votes.userId} = ${sql.raw(userId ? userId.toString() : "-1")})
          OR 
          (${votes.userId} IS NULL AND ${votes.ipAddress} = ${sql.raw(userIp ? `'${userIp}'` : "''")})
        )
        LIMIT 1
      )`.as("userVote"),
    })
    .from(polls)
    .leftJoin(pollOptions, eq(pollOptions.pollId, polls.id))
    .where(eq(polls.id, pollId))
    .groupBy(polls.id)
    .limit(1);

  if (!pollData.length) {
    notFound();
  }

  const poll = {
    id: pollData[0].id,
    question: pollData[0].question,
    options: pollData[0].options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: option.votes || 0,
    })),
    userVote: pollData[0].userVote,
  };

  return <VoteForm poll={poll} />;
}
