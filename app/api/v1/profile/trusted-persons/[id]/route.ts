/** DELETE /api/v1/profile/trusted-persons/[id] — remove a trusted person. */
import { NextResponse } from "next/server";
import { currentUserId, removeTrustedPerson, writeAudit } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    await removeTrustedPerson(userId, id);
    await writeAudit({ user_id: userId, action: "profile.trusted_person.remove", resource: "trusted_persons", detail: id });
    return NextResponse.json({ apiVersion: API_VERSION, data: { id } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
