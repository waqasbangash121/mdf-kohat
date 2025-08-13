import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const cattle = await prisma.cattle.findMany({
      include: {
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(cattle);
  } catch (error) {
    console.error('Error fetching cattle:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    const cattle = await prisma.cattle.create({
      data: {
        name: data.name,
        type: data.type,
        age: parseInt(data.age),
        purchasePrice: parseInt(data.purchasePrice || data.price), // Support both field names
        purchaseDate: new Date(data.purchaseDate || data.date),
        status: 'active'
      }
    });
    
    return NextResponse.json(cattle);
  } catch (error) {
    console.error('Error creating cattle:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
