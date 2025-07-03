import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactDetail from '@/models/ContactDetail';
import ContactMessage from '@/models/ContactMessage';

// GET public contact details
export async function GET() {
  try {
    await connectToDatabase();
    // Return latest document or default
    let detail = await ContactDetail.findOne().sort({ createdAt: -1 });
    if (!detail) {
      detail = await ContactDetail.create({
        address: 'Los Angles CA, 300, New York USA',
        phone: '+589 939 939 99',
        email: 'hellodigiv@gmail.com',
        mapEmbedUrl: '',
      });
    }
    return NextResponse.json({ detail });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST save contact message
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }
    await ContactMessage.create({ name, email, subject, message });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 