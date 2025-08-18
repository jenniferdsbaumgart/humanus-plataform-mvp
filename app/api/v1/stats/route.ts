import { NextResponse } from 'next/server';
import statsData from '@/mocks/stats.json';

export async function GET() {
  try {
    const data = statsData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar estatísticas' },
      { status: 500 }
    );
  }
}