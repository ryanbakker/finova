import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/welcome"]);
const isWebhookRoute = createRouteMatcher(["/api/webhooks"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Skip authentication checks for webhook routes
  if (isWebhookRoute(req)) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected routes
  if (!userId && !isPublicRoute(req)) {
    const welcomeUrl = new URL("/welcome", req.url);
    return NextResponse.redirect(welcomeUrl);
  }

  // If user is authenticated and trying to access /welcome, redirect to home
  if (userId && pathname === "/welcome") {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
