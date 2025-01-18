import { Button } from "@/components/ui/button";
import Link from "next/link";
import PollList from "./_components/poll-list";

export default function Page() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Polls</h2>
        <Link href="/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>
      <PollList />
    </div>
  );
}
