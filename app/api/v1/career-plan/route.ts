import { NextResponse } from 'next/server';
import careerData from '@/mocks/career.json';

export async function GET() {
  try {
    const data = careerData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar dados do plano de carreira' },
      { status: 500 }
    );
  }
}