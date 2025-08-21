import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        cattle: true,
        staff: true
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Calculate amount based on category
    let amount = 0;
    let details = {};
    
    if (data.category === 'milk_sales') {
      amount = parseInt(data.litres) * parseInt(data.pricePerLitre);
      details = {
        litres: parseInt(data.litres),
        pricePerLitre: parseInt(data.pricePerLitre),
        session: data.session
      };
    } else {
      amount = parseInt(data.amount);
      if (data.description) {
        details.description = data.description;
      }
    }

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      let cattleId = data.cattleId || null;

      // If this is a cattle purchase, create the cattle first
      if (data.category === 'cattle_purchase' && data.cattleName) {
        const cattleData = {
          name: data.cattleName,
          type: data.cattleType,
          age: parseInt(data.cattleAge),
          purchasePrice: amount,
          purchaseDate: new Date(data.date),
          status: 'active'
        };
        
        // Add market price if provided
        if (data.marketPrice && data.marketPrice !== '' && data.marketPrice !== null) {
          cattleData.marketPrice = parseInt(data.marketPrice);
        }
        
        const newCattle = await tx.cattle.create({
          data: cattleData
        });
        cattleId = newCattle.id;
        
        // Add cattle details to transaction details
        details.cattleDetails = {
          name: data.cattleName,
          type: data.cattleType,
          age: parseInt(data.cattleAge),
          ...(data.marketPrice && data.marketPrice !== '' && data.marketPrice !== null && {
            marketPrice: parseInt(data.marketPrice)
          })
        };
      }

      // Create the transaction record
      const transaction = await tx.transaction.create({
        data: {
          name: data.name,
          type: data.type,
          category: data.category,
          amount: amount,
          date: new Date(data.date),
          details: Object.keys(details).length > 0 ? details : null,
          cattleId: cattleId,
          staffId: data.staffId || null
        },
        include: {
          cattle: true,
          staff: true
        }
      });

      // If this is a cattle sale, mark the cattle as sold
      if (data.category === 'cattle_sales' && data.cattleId) {
        await tx.cattle.update({
          where: { id: data.cattleId },
          data: { status: 'sold' }
        });
      }

      return transaction;
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
