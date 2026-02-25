import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    const barbers = await prisma.barber.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return apiResponse(barbers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar barbeiros' },
      { status: 500 }
    );
  }
}
