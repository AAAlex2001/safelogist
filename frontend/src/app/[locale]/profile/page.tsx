import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) notFound();
  return <ProfileClient />;
}
