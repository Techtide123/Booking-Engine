import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password ) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  await user.save();

  return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
}
