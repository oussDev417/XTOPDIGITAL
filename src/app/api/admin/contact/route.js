import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactDetail from '@/models/ContactDetail';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    await connectToDatabase();
    const detail = await ContactDetail.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ detail });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json();
    let detail = await ContactDetail.findOne();
    if (detail) {
      await detail.set(body).save();
    } else {
      detail = await ContactDetail.create(body);
    }
    return NextResponse.json({ detail });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 