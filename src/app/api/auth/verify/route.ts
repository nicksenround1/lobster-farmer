import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, createSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lobsterfarmer.com";

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/login?error=missing_token`);
  }

  const result = await verifyMagicLinkToken(token);
  if (!result) {
    return NextResponse.redirect(`${baseUrl}/login?error=expired`);
  }

  const sessionToken = await createSessionToken(result.email);

  // Return a 200 HTML page (not a 3xx redirect) with Set-Cookie header.
  // Browsers reliably process Set-Cookie on 200 responses.
  // The page uses JS to redirect to /dashboard after cookie is set.
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signing in...</title>
  <style>
    body{background:#0a0a0a;color:#fff;font-family:-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
    .b{text-align:center}
    .e{font-size:48px;animation:b .6s ease infinite alternate}
    @keyframes b{to{transform:translateY(-10px)}}
    p{color:rgba(255,255,255,.5);margin-top:16px}
  </style>
</head>
<body>
  <div class="b">
    <div class="e">🦞</div>
    <p>Signing you in...</p>
  </div>
  <script>
    // Small delay to ensure cookie is processed by browser
    setTimeout(function(){ window.location.replace("${baseUrl}/dashboard"); }, 300);
  </script>
</body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });

  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
