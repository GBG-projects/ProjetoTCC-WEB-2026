import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

const public_route_api = [
  '/api/auth/',
  '/api/login',
  '/api/register'
]

const public_pages = [
  "/",
  "/signin",
  "/signup",
]

function isPublicPage(pathname: string){
  return public_pages.some(page => page === '/'?pathname==="/":pathname.startsWith(page))
}

function isPublicRoute(pathname: string){
  return public_route_api.some(page => pathname.startsWith(page))
}


export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get('next-auth.session-token')?.value

  if (pathname.startsWith('/api/')) {

    if(isPublicRoute(pathname)){
      return NextResponse.next()
    }

    if(!token){
      return NextResponse.json({error:"você não tem acesso a essa rota"},{status:401})
    }

    const backend_url = `${BACKEND_URL}${pathname}${search}`
    return NextResponse.rewrite(backend_url)
  }

  if (isPublicPage(pathname)) {
    return NextResponse.next()
  }

  // Páginas privadas sem token redirecionam para login
  if (!token) {
    const loginUrl = new URL('/signin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()

}
export const config = {
    matcher: ['/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
]
}