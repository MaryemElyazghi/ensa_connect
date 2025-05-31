
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { StudentModel, TutorModel, UserModel } from '@/models/User';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'student' && role !== 'tutor') {
      return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    const commonUserData = {
      name,
      email,
      password: hashedPassword,
      role,
      avatarUrl: `https://placehold.co/100x100.png?text=${name.charAt(0)}`, // Basic placeholder
    };

    if (role === 'student') {
      // Provide default empty values for student-specific fields
      newUser = new StudentModel({
        ...commonUserData,
        program: '', 
        level: '',
        difficultSubjects: [],
      });
    } else { // role === 'tutor'
      // Provide default empty values for tutor-specific fields
      newUser = new TutorModel({
        ...commonUserData,
        teachableSubjects: [],
        experience: '',
        availability: '',
        bio: '',
      });
    }

    await newUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    
    return NextResponse.json(userWithoutPassword as User, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error during signup', error: errorMessage }, { status: 500 });
  }
}
