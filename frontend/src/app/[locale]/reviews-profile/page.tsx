import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ReviewsClient from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) notFound();
  return <ReviewsClient />;
}
