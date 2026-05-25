import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Set cookies on the request so downstream Server Components
          // can read the updated values immediately.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Clone the response so we can set cookies and headers on it.
          supabaseResponse = NextResponse.next({
            request,
          });

          // Write all cookies to the response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );

          // Write cache-control headers to prevent CDN/proxy caching
          // of responses that contain auth cookies.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use supabase.auth.getSession() here.
  // getSession() reads from cookies without validation.
  // getUser() contacts the Supabase Auth server to validate the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
