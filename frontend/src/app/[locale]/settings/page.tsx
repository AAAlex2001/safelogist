import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) notFound();
  return <SettingsClient />;
}

