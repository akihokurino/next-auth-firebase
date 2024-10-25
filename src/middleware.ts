import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();
    if (!req.nextauth.token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (url.pathname === "/" && req.nextauth.token.type === "customer") {
      url.pathname = "/customer";
      return NextResponse.redirect(url);
    }
    if (url.pathname === "/" && req.nextauth.token.type === "client") {
      url.pathname = "/client";
      return NextResponse.redirect(url);
    }

    if (
      url.pathname.startsWith("/customer") &&
      req.nextauth.token.type === "client"
    ) {
      url.pathname = "/client";
      return NextResponse.redirect(url);
    }
    if (
      url.pathname.startsWith("/client") &&
      req.nextauth.token.type === "customer"
    ) {
      url.pathname = "/customer";
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!login).*)"],
};
