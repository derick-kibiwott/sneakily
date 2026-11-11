"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { submitReview, type ReviewState } from "@/actions/reviews";
import { SwitcherButton } from "@/components/ui/switcher-button";
import { Textarea } from "@/components/ui/textarea";

const MAX = 1000;

export function ReviewForm({
  creatorId,
  handle,
}: {
  creatorId: string;
  handle: string;
}) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(
    submitReview,
    { status: "idle" },
  );
  const [rating, setRating] = React.useState(0);
  const [body, setBody] = React.useState("");

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-4xl border bg-card p-6"
      >
        <CheckCircle2
          className="mt-0.5 size-5 shrink-0 text-emerald-500"
          aria-hidden
        />
        <div>
          <p className="font-semibold">Review submitted</p>
          <p className="mt-1 text-muted-foreground">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      aria-labelledby="review-form-heading"
      className="rounded-4xl border bg-card p-5 md:p-6"
    >
      <h3 id="review-form-heading" className="text-xl font-semibold">
        Leave a review
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reviews are anonymous and checked before they appear. Keep it honest and
        respectful.
      </p>

      <input type="hidden" name="creatorId" value={creatorId} />

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <label
              key={v}
              className="cursor-pointer rounded-full p-1 has-focus-visible:ring-3 has-focus-visible:ring-ring/40"
            >
              <input
                type="radio"
                name="rating"
                value={v}
                checked={rating === v}
                onChange={() => setRating(v)}
                className="sr-only"
              />
              <Star
                aria-hidden
                className={cn(
                  "size-8 transition-colors motion-reduce:transition-none",
                  v <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40 hover:text-amber-400/60",
                )}
              />
              <span className="sr-only">
                {v} {v === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label
        htmlFor="review-body"
        className="mb-2 mt-5 block text-sm font-medium"
      >
        Your review of {handle}
      </label>
      <Textarea
        id="review-body"
        name="body"
        rows={5}
        required
        minLength={20}
        maxLength={MAX}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-describedby="review-count"
        placeholder="What was it like? Be specific and respectful."
        className="rounded-3xl"
      />
      <p id="review-count" className="mt-2 text-xs text-muted-foreground">
        {body.length}/{MAX}
      </p>

      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="mt-5">
        <SwitcherButton
          icon={Send}
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11"
        >
          {pending ? "Submitting" : "Submit review"}
        </SwitcherButton>
      </div>
    </form>
  );
}
