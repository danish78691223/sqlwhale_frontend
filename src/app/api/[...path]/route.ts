import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

function getSetCookieValues(headers: Headers): string[] {
  const direct =
    typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];
  if (direct.length > 0) return direct;

  const combined = headers.get("set-cookie");
  if (!combined) return [];
  return combined.split(/,\s*(?=[^;,=\s]+=[^;,]*)/);
}

function stripCookieDomain(cookieValue: string): string {
  return cookieValue.replace(/;\s*Domain=[^;]+/gi, "");
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const suffix = path.join("/");
  const target = new URL(`${BACKEND_URL}/api/${suffix}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["cookie", "content-type", "authorization"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  const location = upstream.headers.get("location");
  if (location) responseHeaders.set("location", location);
  responseHeaders.set("cache-control", "no-store");

  for (const cookieValue of getSetCookieValues(upstream.headers)) {
    responseHeaders.append("set-cookie", stripCookieDomain(cookieValue));
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;
