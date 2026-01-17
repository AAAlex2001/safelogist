import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const token = cookies().get("authToken")?.value;
  if (!token) notFound();
  return <ProfileClient />;
}
