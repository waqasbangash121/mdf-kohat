import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany();
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const newStaff = await prisma.staff.create({ data });
    return NextResponse.json(newStaff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
