import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function apiResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-API-Key');
  const secretKey = process.env.API_SECRET_KEY;
  
  return apiKey === secretKey;
}

export async function validateRequest<S extends z.ZodTypeAny>(
  request: NextRequest,
  schema: S
): Promise<{ data: z.infer<S> | null; error: string | null }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    return { data: null, error: 'Invalid request data' };
  }
}
