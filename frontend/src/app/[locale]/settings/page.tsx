import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const token = cookies().get("authToken")?.value;
  if (!token) notFound();
  return <SettingsClient />;
}

