import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting storage (em produção, usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuração
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 60; // 60 requisições por minuto

export function middleware(request: NextRequest) {
  // Rate limiting para API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown';
    const now = Date.now();
    
    const rateLimitData = rateLimitMap.get(ip);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      // Nova janela de tempo
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW,
      });
    } else if (rateLimitData.count >= MAX_REQUESTS) {
      // Limite excedido
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
          },
        }
      );
    } else {
      // Incrementa contador
      rateLimitData.count++;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
