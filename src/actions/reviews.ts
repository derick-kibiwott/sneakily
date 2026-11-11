"use server";

export type ReviewState = {
  status: "idle" | "success" | "error";
  message?: string | undefined;
};

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const creatorId = String(formData.get("creatorId") ?? "");
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!creatorId)
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { status: "error", message: "Choose a star rating." };
  if (body.length < 20)
    return {
      status: "error",
      message: "Tell us a little more (at least 20 characters).",
    };
  if (body.length > 1000)
    return {
      status: "error",
      message: "Please keep your review under 1,000 characters.",
    };

  // TODO: save as "pending" for moderation, rate-limit per session/IP,
  // then revalidatePath(`/creators/${creatorId}`) once approved.
  return {
    status: "success",
    message:
      "Thank you. Your review is anonymous and will appear once it has been checked.",
  };
}
