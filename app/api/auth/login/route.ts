import { NextResponse } from "next/server";
import { generateCustomerToken } from "@/services/auth";
import { AUTH_COOKIE_NAME, encryptToken, getAuthCookieOptions } from "@/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const token = await generateCustomerToken(email, password);

    const secret = process.env.AUTH_COOKIE_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfiguration: missing AUTH_COOKIE_SECRET" }, { status: 500 });
    }

    const encrypted = encryptToken(token, secret);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE_NAME, encrypted, getAuthCookieOptions());
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
