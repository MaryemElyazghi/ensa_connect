import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TutorModel } from '@/models/User';
import type { TutorUser } from '@/lib/types';

export async function GET() {
  try {
    await dbConnect();
    const tutors = await TutorModel.find({}).lean(); // .lean() returns plain JavaScript objects

    // Convert _id to id and remove __v if you want to match the mock data structure closer
    const formattedTutors = tutors.map(tutor => {
      const { _id, __v, ...rest } = tutor as any; // Use any to bypass strict type checking for _id and __v
      return { id: _id.toString(), ...rest } as TutorUser;
    });
    
    return NextResponse.json(formattedTutors, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tutors:", error);
    return NextResponse.json({ message: 'Failed to fetch tutors', error: (error as Error).message }, { status: 500 });
  }
}
