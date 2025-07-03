import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PricingPlan from '@/models/PricingPlan';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET all pricing plans (admin)
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    await connectToDatabase();
    const plans = await PricingPlan.find().sort({ order: 1 });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new plan
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json();
    const newPlan = await PricingPlan.create(body);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT bulk update
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json(); // expects array of plans with _id and fields to update
    // Si un seul plan est fourni
    if (!body.plans && body._id) {
      const updated = await PricingPlan.findByIdAndUpdate(body._id, { $set: body }, { new: true });
      return NextResponse.json(updated);
    }

    if (!Array.isArray(body.plans)) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    const updates = body.plans.map((p) => PricingPlan.findByIdAndUpdate(p._id, { $set: p }, { new: true }));
    const updated = await Promise.all(updates);
    return NextResponse.json({ plans: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE ?id=xxx
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    await connectToDatabase();
    await PricingPlan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 