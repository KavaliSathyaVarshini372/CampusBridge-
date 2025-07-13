export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/collaborate",
    // Add any other paths you want to protect
  ],
};
