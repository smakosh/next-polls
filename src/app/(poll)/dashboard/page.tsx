import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import PollList from "./_components/poll-list";
import { FallbackPolls } from "./_components/fallback-polls";

export const experimental_ppr = true;
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Polls</h2>
        <Link href="/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      <Suspense fallback={<FallbackPolls />}>
        <PollList />
      </Suspense>
    </div>
  );
}
