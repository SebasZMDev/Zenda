// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  console.log('🔍 Middleware - Path:', request.nextUrl.pathname);
  console.log('🔍 AccessToken:', !!accessToken);
  console.log('🔍 RefreshToken:', !!refreshToken);

  if (!accessToken && !refreshToken) {
    console.log('❌ No tokens - redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!accessToken && refreshToken) {
    console.log('🔄 Attempting refresh...');
    
    const apiUrl = process.env.API_URL;
    const fullUrl = `${apiUrl}/auth/refresh`;
    
    console.log('🌐 Full refresh URL:', fullUrl);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ Forward the cookie to the backend
          'Cookie': `refreshToken=${refreshToken.value}`
        },
        credentials: 'include' // ✅ This is still good practice
      });

      console.log('📥 Refresh response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Refresh failed:', errorText);
        
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('accessToken');
        redirectResponse.cookies.delete('refreshToken');
        return redirectResponse;
      }

      console.log('✅ Refresh successful');

      // ✅ Extract Set-Cookie headers from backend response
      const setCookieHeaders = response.headers.getSetCookie();
      const nextResponse = NextResponse.next();
      
      // ✅ Forward the cookies set by the backend
      setCookieHeaders.forEach(cookie => {
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');
        
        if (name === 'accessToken' || name === 'refreshToken') {
          nextResponse.cookies.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: name === 'accessToken' ? 15 * 60 : 7 * 24 * 60 * 60,
            path: '/'
          });
          console.log(`✅ Set new ${name}`);
        }
      });

      return nextResponse;
      
    } catch (error) {
      console.error('❌ Middleware refresh error:', error);
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('accessToken');
      redirectResponse.cookies.delete('refreshToken');
      return redirectResponse;
    }
  }

  console.log('✅ Auth OK - continuing');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};