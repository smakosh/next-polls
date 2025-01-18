"use client";

import { useActionState, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitVote } from "@/app/(poll)/poll/[id]/_lib/actions";
import { FormState } from "../_lib/definitions";
import { getURL } from "@/lib/getUrl";

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

  const handleCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="relative mx-auto mb-4 max-w-2xl text-right">
        {isCopied && (
          <div className="absolute -right-2 top-10 rounded-md bg-neutral-700 px-2 py-1 text-xs text-white">
            URL has been copied to clipboard
          </div>
        )}
        <CopyToClipboard
          text={`${getURL()}/poll/${poll.id}`}
          onCopy={handleCopied}
        >
          <Button type="button">Copy URL</Button>
        </CopyToClipboard>
      </div>
      <Card className="mx-auto max-w-2xl">
        <form action={action}>
          <CardHeader>
            <CardTitle>{poll.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <input type="hidden" name="pollId" value={poll.id} />
            <RadioGroup
              name="selectedOption"
              className="space-y-3"
              defaultValue={poll.userVote?.toString()}
            >
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`option-${option.id}`}
                  />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="flex flex-1 items-center justify-between"
                  >
                    <span>{option.text}</span>
                    <span className="text-muted-foreground text-sm">
                      ({option.votes} votes)
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {state?.errors?.selectedOption && (
              <p className="text-destructive mt-2 text-sm">
                {state.errors.selectedOption[0]}
              </p>
            )}

            <Button type="submit" className="mt-6 w-full" disabled={isPending}>
              {isPending
                ? "Submitting..."
                : state?.message === "Vote submitted successfully."
                  ? "Vote Recorded"
                  : "Submit Vote"}
            </Button>

            {state?.message &&
              state.message !== "Vote submitted successfully." && (
                <p className="text-destructive mt-2 text-center text-sm">
                  {state.message}
                </p>
              )}

            {state?.message === "Vote submitted successfully." && (
              <p className="mt-2 text-center text-sm text-green-600">
                Your vote has been recorded!
              </p>
            )}
          </CardContent>
        </form>
      </Card>
    </>
  );
}
