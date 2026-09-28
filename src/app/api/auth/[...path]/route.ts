import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
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

  // Forward every Set-Cookie value without a Domain attribute. Because this
  // response is coming from sqlwhalefrontend.vercel.app, the browser stores
  // the SQLWhale auth/state cookies on the first-party frontend origin.
  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  for (const cookieValue of setCookies) {
    responseHeaders.append(
      "set-cookie",
      cookieValue.replace(/;\\s*Domain=[^;]+/gi, "")
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
