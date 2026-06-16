import { listReviewTasks } from "@/features/review/api/reviews";
import { ReviewQueue } from "@/features/review/components/review-queue";

export default async function ReviewPage() {
  const reviews = await listReviewTasks();
  return <ReviewQueue reviews={reviews} />;
}
