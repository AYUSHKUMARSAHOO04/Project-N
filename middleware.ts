// import { clerkMiddleware } from '@clerk/nextjs/server';

// console.log("✅ Clerk Middleware is running..."); // Debugging

// export default clerkMiddleware();

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)'], 
// };
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.next();
}
