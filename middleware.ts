import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const REFRESH_COOKIE_INTERVAL = 1000 * 60 * 30; // 30 minutes

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  try {
    // Check if we need to refresh the auth cookie
    const authCookie = request.cookies.get('houdini');
    const lastRefresh = request.cookies.get('last_auth_refresh');
    const now = Date.now();

    // Either no auth cookie or it's been more than 30 minutes since the last refresh
    const shouldRefresh =
      !authCookie ||
      !lastRefresh ||
      now - parseInt(lastRefresh.value) > REFRESH_COOKIE_INTERVAL;

    if (shouldRefresh) {
      // Get the auth cookie from the backend
      const apiBaseUrl = process.env.NEXT_PUBLIC_GQL_HTTP_URL?.replace(
        'graphql',
        'api/authCookie'
      );

      if (apiBaseUrl) {
        console.log('Refreshing auth cookie via middleware');

        const authResponse = await fetch(apiBaseUrl, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
        });

        if (authResponse.ok) {
          // Get the Set-Cookie header from the response
          const setCookieHeader = authResponse.headers.get('set-cookie');

          if (setCookieHeader) {
            // Parse and set each cookie in the response
            const cookieStrings = setCookieHeader.split(/,(?=[a-zA-Z0-9_-]+=)/);

            for (const cookieString of cookieStrings) {
              // Extract cookie name
              const cookieName = cookieString.split('=')[0]?.trim();

              if (cookieName) {
                response.cookies.set(
                  cookieName,
                  cookieString.split('=')[1]?.trim(),
                  {
                    path: '/',
                    maxAge: 1 * 60 * 60, // 24 hours
                    sameSite: 'none',
                    secure: true,
                  }
                );
              }
            }

            // Set a timestamp for when we last refreshed
            response.cookies.set('last_auth_refresh', now.toString(), {
              path: '/',
              maxAge: 60 * 60, // 1 hour
              sameSite: 'none',
              secure: true,
            });

            console.log('Auth cookie refreshed via middleware');
          }
        } else {
          console.error('Failed to refresh auth cookie:', authResponse.status);
        }
      }
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!_next|api|assets|favicon.ico|robots.txt|sitemap.xml).*)',
    '/((?!widget).*)',
  ],
};
