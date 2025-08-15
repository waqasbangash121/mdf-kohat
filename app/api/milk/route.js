import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    // Fetch transactions with category 'milk_sales' since milk data is stored as transactions
    const milkTransactions = await prisma.transaction.findMany({
      where: {
        category: 'milk_sales'
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json(milkTransactions);
  } catch (error) {
    console.error('Error fetching milk transactions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Create a new milk transaction
    const newMilkTransaction = await prisma.transaction.create({
      data: {
        name: data.name || 'Milk Sale',
        type: 'income',
        category: 'milk_sales',
        amount: data.amount || 0,
        date: data.date ? new Date(data.date) : new Date(),
        details: {
          litres: data.litres,
          pricePerLitre: data.pricePerLitre,
          session: data.session,
          ...(data.details || {})
        }
      }
    });
    
    return NextResponse.json(newMilkTransaction);
  } catch (error) {
    console.error('Error creating milk transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
