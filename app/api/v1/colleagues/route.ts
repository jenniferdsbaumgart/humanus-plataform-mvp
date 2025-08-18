import { NextResponse } from 'next/server';
import colleaguesData from '@/mocks/colleagues.json';

export async function GET() {
  try {
    const data = colleaguesData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar colegas' },
      { status: 500 }
    );
  }
}