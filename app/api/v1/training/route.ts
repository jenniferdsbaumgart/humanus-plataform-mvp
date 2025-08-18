import { NextResponse } from 'next/server';
import trainingData from '@/mocks/training.json';

export async function GET() {
  try {
    const data = trainingData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar treinamentos' },
      { status: 500 }
    );
  }
}