
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserModel, StudentModel, TutorModel } from '@/models/User';
import type { User, StudentUser, TutorUser } from '@/lib/types';

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    // Destructure common fields and role-specific fields
    const { name, email, role, program, level, difficultSubjects, teachableSubjects, experience, availability, bio, avatarUrl } = body;

    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Basic updates applicable to all users (if provided)
    if (name) existingUser.name = name;
    if (avatarUrl) existingUser.avatarUrl = avatarUrl;
    // Email update is tricky, usually handled separately due to uniqueness and verification. Skipping for now.
    // Role change is also a complex operation, not handled here.

    // Role-specific updates
    if (existingUser.role === 'student') {
      const studentData: Partial<StudentUser> = {};
      if (program !== undefined) studentData.program = program;
      if (level !== undefined) studentData.level = level;
      if (difficultSubjects !== undefined) studentData.difficultSubjects = difficultSubjects;
      
      Object.assign(existingUser, studentData);

    } else if (existingUser.role === 'tutor') {
      const tutorData: Partial<TutorUser> = {};
      if (teachableSubjects !== undefined) tutorData.teachableSubjects = teachableSubjects;
      if (experience !== undefined) tutorData.experience = experience;
      if (availability !== undefined) tutorData.availability = availability;
      if (bio !== undefined) tutorData.bio = bio;

      Object.assign(existingUser, tutorData);
    }

    const updatedUser = await existingUser.save();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    return NextResponse.json(userWithoutPassword as User, { status: 200 });

  } catch (error) {
    console.error(`Profile update error for user ${userId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error during profile update', error: errorMessage }, { status: 500 });
  }
}


export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword as User, { status: 200 });

  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error fetching profile', error: errorMessage }, { status: 500 });
  }
}
