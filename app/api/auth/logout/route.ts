import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/cookies";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res);
  return res;
}

export async function GET() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res);
  return res;
}

