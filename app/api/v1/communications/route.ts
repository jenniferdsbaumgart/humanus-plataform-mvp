import { NextRequest, NextResponse } from 'next/server';
import communicationsData from '@/mocks/communications.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get('limit') || '0');
    
    // Verificar se os dados existem e são válidos
    if (!communicationsData || !communicationsData.posts) {
      throw new Error('Dados de comunicações não encontrados ou inválidos');
    }
    
    if (!Array.isArray(communicationsData.posts)) {
      throw new Error('communicationsData.posts não é um array');
    }
    
    const data = communicationsData;
    
    // Ordenar por data mais recente
    const sortedPosts = data.posts.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Aplicar limite se especificado
    const posts = limit > 0 ? sortedPosts.slice(0, limit) : sortedPosts;
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Erro detalhado na API de comunicações:', error);
    return NextResponse.json(
      { error: `Erro ao carregar comunicações: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, title, content, icon, highlight, author, authorRole } = body;
    
    // Para o POST, vamos simular a criação sem persistir
    const data = communicationsData;
    
    const newPost = {
      id: `comm-${Date.now()}`,
      category,
      title,
      content,
      date: new Date().toISOString(),
      icon: icon || '📝',
      highlight: highlight || false,
      author: author || 'Usuário',
      authorRole: authorRole || 'Profissional'
    };
    
    data.posts.unshift(newPost);
    
    // Simular persistência (não vamos realmente escrever no arquivo)
    
    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar postagem' },
      { status: 500 }
    );
  }
}