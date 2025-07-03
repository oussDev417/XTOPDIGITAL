import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PricingPlan from '@/models/PricingPlan';

export async function GET() {
  try {
    await connectToDatabase();
    const plans = await PricingPlan.find({ published: true }).sort({ order: 1 });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 