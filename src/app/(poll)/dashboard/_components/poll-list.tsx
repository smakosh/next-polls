import Link from "next/link";
import { eq, sql } from "drizzle-orm";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { db } from "@/../drizzle/db";
import { polls, votes } from "@/../drizzle/schema";

export default async function PollList() {
  const pollData = await db
    .select({
      id: polls.id,
      question: polls.question,
      voteCount: sql`COUNT(${votes.id})`.as("vote_count"),
    })
    .from(polls)
    .leftJoin(votes, eq(votes.pollId, polls.id)) // Use the `eq` helper function
    .groupBy(polls.id);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pollData.map((poll) => (
        <Link href={`/poll/${poll.id}`} key={poll.id}>
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>{poll.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                {poll.voteCount as number} vote{poll.voteCount === 1 ? "" : "s"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
