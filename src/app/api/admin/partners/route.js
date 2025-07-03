import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PartnerLogo from '@/models/PartnerLogo';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user.role === 'admin';
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    await connectToDatabase();
    const logos = await PartnerLogo.find().sort({ order: 1 });
    return NextResponse.json({ logos });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const newLogo = await PartnerLogo.create(body);
    return NextResponse.json(newLogo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...rest } = body;
    if (!_id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    const updated = await PartnerLogo.findByIdAndUpdate(_id, rest, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    await connectToDatabase();
    await PartnerLogo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 