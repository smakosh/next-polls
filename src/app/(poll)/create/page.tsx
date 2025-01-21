"use client";

import { useState } from "react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPoll } from "@/app/(poll)/_lib/actions";

export default function CreatePoll() {
  const [state, action, isPending] = useActionState(createPoll, undefined);
  const [options, setOptions] = useState(["", ""]); // Start with two empty options

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  return (
    <form action={action}>
      <div className="mb-4">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          name="question"
          placeholder="Enter your poll question"
          required
        />
        {state?.errors?.question && (
          <p className="text-sm text-red-500">{state.errors.question}</p>
        )}
      </div>
      <div className="options-container">
        {options.map((option, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            <Input
              id={`option-${index}`}
              name="options"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveOption(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      {state?.errors?.options && (
        <p className="text-sm text-red-500">{state.errors.options}</p>
      )}
      <div className="mt-4 flex flex-col gap-2">
        <Button type="button" onClick={handleAddOption} variant="outline">
          Add Option
        </Button>
        <Button type="submit" aria-disabled={isPending} className="mt-4 w-full">
          {isPending ? "Submitting..." : "Create Poll"}
        </Button>
        {state?.message && state.message !== "success" && (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </form>
  );
}
