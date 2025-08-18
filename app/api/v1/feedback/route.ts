import { NextRequest, NextResponse } from 'next/server';
import feedbackData from '@/mocks/feedback.json';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = (searchParams.get('type') || 'received') as keyof typeof feedbackData;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Verificar se os dados existem e são válidos
    if (!feedbackData) {
      throw new Error('Dados de feedback não encontrados');
    }
    
    if (!feedbackData[type]) {
      throw new Error(`Tipo de feedback '${type}' não encontrado nos dados`);
    }
    
    const data = feedbackData;
    
    const feedbacks = data[type] || [];
    
    if (!Array.isArray(feedbacks)) {
      throw new Error(`Dados de feedback para tipo '${type}' não é um array`);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = feedbacks.slice(startIndex, endIndex);
    
    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: feedbacks.length,
        totalPages: Math.ceil(feedbacks.length / limit)
      }
    });
  } catch (error) {
    console.error('Erro detalhado na API de feedback:', error);
    return NextResponse.json(
      { error: `Erro ao carregar feedbacks: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, toRole, title, content, tags, type, rating } = body;
    
    // Para o POST, vamos simular a criação sem persistir
    const data = feedbackData;
    
    const newFeedback = {
      id: `fb-g-${Date.now()}`,
      to,
      toRole,
      date: new Date().toISOString(),
      title,
      content,
      tags: tags || [],
      type: type || 'positivo',
      rating: rating || 5
    };
    
    data.given.unshift(newFeedback);
    
    // Simular persistência (não vamos realmente escrever no arquivo)
    
    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar feedback' },
      { status: 500 }
    );
  }
}