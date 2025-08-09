import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const milkProductions = await prisma.milkProduction.findMany();
    return NextResponse.json(milkProductions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newRecord = await prisma.milkProduction.create({ data });
    return NextResponse.json(newRecord);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
