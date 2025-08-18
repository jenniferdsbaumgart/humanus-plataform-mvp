import { NextRequest, NextResponse } from 'next/server';
import moodsData from '@/mocks/moods.json';

export async function GET() {
  try {
    const data = moodsData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar moods' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mood, tags, note } = body;
    
    // Para o POST, vamos simular a criação sem persistir
    const data = moodsData;
    
    const today = new Date().toISOString().split('T')[0];
    const existingMoodIndex = data.records.findIndex((record: any) => record.date === today);
    
    const newMood = {
      id: `mood-${Date.now()}`,
      date: today,
      mood,
      tags: tags || [],
      note: note || ''
    };
    
    if (existingMoodIndex >= 0) {
      data.records[existingMoodIndex] = newMood;
    } else {
      data.records.unshift(newMood);
    }
    
    // Manter apenas os últimos 30 registros
    data.records = data.records.slice(0, 30);
    
    // Simular persistência (não vamos realmente escrever no arquivo)
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao registrar mood' },
      { status: 500 }
    );
  }
}