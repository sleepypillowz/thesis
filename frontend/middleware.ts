import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPatientRoute = createRouteMatcher(['/patient(.*)']);
const isDoctorRoute = createRouteMatcher(['/doctor(.*)']);
const isSecretaryRoute = createRouteMatcher(['/secretary(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isOncallDoctorRoute = createRouteMatcher(['/oncalldoctor(.*)']);
const isdesignerRoute = createRouteMatcher(['/designer(.*)']);

const roleDefaultRoutes: Record<string, string> = {
  patient: "/patient",
  doctor: "/doctor",
  secretary: "/secretary",
  admin: "/admin",
  oncalldoctor: "/oncalldoctor",
  designer: "/designer",
};

const publicPages = ['/', '/services', '/doc-list', '/about', '/contact',]

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.role || "patient") as keyof typeof roleDefaultRoutes;
  const redirectUrl = req.nextUrl.clone();

  // If not signed in, block protected routes
  if (!userId) {
    if (
      isPatientRoute(req) ||
      isDoctorRoute(req) ||
      isSecretaryRoute(req) ||
      isAdminRoute(req)
    ) {
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
    return;
  }

  // Signed-in user hits a public page → redirect to their dashboard
  if (publicPages.includes(req.nextUrl.pathname)) {
    redirectUrl.pathname = roleDefaultRoutes[role];
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect any signed-in user hitting a route that isn't theirs
  const routeRoleCheck = [
    { matcher: isPatientRoute, role: "patient" },
    { matcher: isDoctorRoute, role: "doctor" },
    { matcher: isSecretaryRoute, role: "secretary" },
    { matcher: isAdminRoute, role: "admin" },
    { matcher: isOncallDoctorRoute, role: "oncalldoctor" },
    { matcher: isdesignerRoute, role: "designer" },
  ];

  for (const { matcher, role: routeRole } of routeRoleCheck) {
    if (matcher(req) && role !== routeRole) {
      redirectUrl.pathname = roleDefaultRoutes[role];
      return NextResponse.redirect(redirectUrl);
    }
  }
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};