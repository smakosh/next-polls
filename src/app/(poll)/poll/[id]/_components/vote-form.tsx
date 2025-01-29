"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { submitVote } from "@/app/(poll)/poll/[id]/_lib/actions";
import { FormState } from "../_lib/definitions";
import { getURL } from "@/lib/getUrl";
import CopyToClipboard from "react-copy-to-clipboard";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}

export function VoteForm({
  poll,
}: {
  poll: Poll & { userVote: number | null };
}) {
  const [isCopied, setCopied] = useState(false);
  const [state, action, isPending] = useActionState<
    FormState | undefined,
    FormData
  >(submitVote, undefined);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/poll/${poll.id}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative mb-4 text-right">
        {isCopied && (
          <div className="absolute -right-2 top-10 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white">
            URL has been copied to clipboard
          </div>
        )}
        <CopyToClipboard
          text={`${getURL()}/poll/${poll.id}`}
          onCopy={handleCopy}
        >
          <Button
            variant="outline"
            className="rounded-full border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
            type="button"
          >
            <Copy className="mr-2 size-4" />
            Copy URL
          </Button>
        </CopyToClipboard>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="mb-4 text-xl font-bold">{poll.question}</h2>

          <div className="space-y-2">
            <form action={action}>
              <input type="hidden" name="pollId" value={poll.id} />
              {poll.options.map((option) => {
                const percentage = getPercentage(option.votes);
                const isSelected = poll.userVote === option.id;

                return (
                  <button
                    key={option.id}
                    className="relative w-full text-left"
                    disabled={isPending}
                    value={option.id}
                    name="selectedOption"
                    type="submit"
                  >
                    <div className="relative z-10 flex items-center justify-between rounded-md p-3 transition-colors hover:bg-neutral-50">
                      <span className="font-medium">{option.text}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div
                      className={`absolute left-0 top-0 h-full rounded-md bg-neutral-100 transition-all ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </button>
                );
              })}
            </form>
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
            {totalVotes.toLocaleString()} votes
          </div>
        </div>
      </div>

      {state?.errors?.selectedOption && (
        <p className="text-destructive mt-2 text-sm">
          {state.errors.selectedOption[0]}
        </p>
      )}

      {state?.message && state.message !== "Vote submitted successfully." && (
        <p className="text-destructive mt-2 text-center text-sm">
          {state.message}
        </p>
      )}

      {state?.message === "Vote submitted successfully." && (
        <p className="mt-2 text-center text-sm text-green-600">
          Your vote has been recorded!
        </p>
      )}
    </div>
  );
}
