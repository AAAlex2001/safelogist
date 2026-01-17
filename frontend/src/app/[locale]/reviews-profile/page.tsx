import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ReviewsClient from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  const token = cookies().get("authToken")?.value;
  if (!token) notFound();
  return <ReviewsClient />;
}
