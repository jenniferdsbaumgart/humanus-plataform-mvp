import { NextResponse } from 'next/server';
import scheduleData from '@/mocks/schedule.json';

export async function GET() {
  try {
    const data = scheduleData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar agendamentos' },
      { status: 500 }
    );
  }
}