import { NextResponse } from 'next/server';
import rewardsData from '@/mocks/rewards.json';

export async function GET() {
  try {
    const data = rewardsData;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar recompensas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rewardId, userId } = body;
    
    // Aqui você implementaria a lógica para processar o resgate
    // Por enquanto, apenas retornamos sucesso
    
    return NextResponse.json({ 
      success: true, 
      message: 'Recompensa resgatada com sucesso!' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao resgatar recompensa' },
      { status: 500 }
    );
  }
}