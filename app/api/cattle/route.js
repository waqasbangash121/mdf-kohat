import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const cattle = await prisma.cattle.findMany();
    return NextResponse.json(cattle);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newCattle = await prisma.cattle.create({ data });
    return NextResponse.json(newCattle);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
