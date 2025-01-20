import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPolls } from "../_lib/get-polls";

export default async function PollList() {
  const polls = await getPolls();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <Link href={`/poll/${poll.id}`} key={poll.id}>
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="max-w-72 truncate">
                {poll.question}
              </CardTitle>
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
