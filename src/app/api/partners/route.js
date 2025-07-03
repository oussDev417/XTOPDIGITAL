import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PartnerLogo from '@/models/PartnerLogo';

export async function GET() {
  try {
    await connectToDatabase();
    const logos = await PartnerLogo.find({ published: true }).sort({ order: 1 });
    return NextResponse.json({ logos });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 