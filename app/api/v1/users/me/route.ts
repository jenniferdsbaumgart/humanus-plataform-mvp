import { NextResponse } from 'next/server';
import usersData from '@/mocks/users.json';

export async function GET() {
  try {
    const data = usersData;
    
    return NextResponse.json(data.me);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar dados do usuário' },
      { status: 500 }
    );
  }
}