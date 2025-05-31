
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/User'; // Use the base UserModel to find by email and role
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email, role }).lean();

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials or role' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword as User, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error during login', error: errorMessage }, { status: 500 });
  }
}
