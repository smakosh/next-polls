import { Skeleton } from "@/components/ui/skeleton";

export const FallbackPolls = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }, (_, i) => i + 1).map((i) => (
      <Skeleton
        key={`fallback-poll-${i}`}
        className="h-[110px] w-full rounded-xl"
      />
    ))}
  </div>
);
