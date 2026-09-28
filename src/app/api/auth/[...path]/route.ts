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

  // Node/Next can expose multiple Set-Cookie headers as one combined value.
  // These auth cookies do not contain comma-separated Expires attributes, so
  // split only where the next cookie name begins.
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
  const target = new URL(`${BACKEND_URL}/api/auth/${suffix}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");

  if (cookie) headers.set("cookie", cookie);
  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);

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
  const contentTypeResponse = upstream.headers.get("content-type");
  const location = upstream.headers.get("location");

  if (contentTypeResponse) responseHeaders.set("content-type", contentTypeResponse);
  if (location) responseHeaders.set("location", location);
  responseHeaders.set("cache-control", "no-store");

  // The browser receives this response from sqlwhalefrontend.vercel.app.
  // Strip any backend Domain attribute so OAuth/session cookies become
  // first-party cookies on the SQLWhale frontend origin.
  for (const cookieValue of getSetCookieValues(upstream.headers)) {
    responseHeaders.append(
      "set-cookie",
      stripCookieDomain(cookieValue)
    );
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
