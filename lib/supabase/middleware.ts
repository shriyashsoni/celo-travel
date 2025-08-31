import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.includes(".") // Skip files with extensions
  ) {
    return supabaseResponse
  }

  try {
    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: If you remove getUser() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const publicPaths = ["/", "/auth/login", "/auth/sign-up", "/buy-policy", "/policies"]
    const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (!user && !isPublicPath) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("Middleware error:", error)
    return supabaseResponse
  }

  return supabaseResponse
}
