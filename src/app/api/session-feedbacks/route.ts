
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SessionFeedbackModel from '@/models/SessionFeedback';
import type { SessionFeedback } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { 
        requestId, 
        studentId, 
        tutorId, 
        rating, 
        studentComments, 
        topicsCovered, 
        sessionDate,
        durationMinutes 
    } = body;

    if (!requestId || !studentId || !tutorId || !rating || !topicsCovered || !sessionDate) {
      return NextResponse.json({ message: 'Missing required fields for session feedback' }, { status: 400 });
    }

    const newFeedback = new SessionFeedbackModel({
      requestId,
      studentId,
      tutorId,
      rating,
      studentComments,
      topicsCovered,
      sessionDate,
      durationMinutes,
    });

    const savedFeedback = await newFeedback.save();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...result } = savedFeedback.toObject();
    const responseFeedback = { ...result, id: _id.toString() } as SessionFeedback;

    return NextResponse.json(responseFeedback, { status: 201 });

  } catch (error) {
    console.error('Session feedback creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error during session feedback creation', error: errorMessage }, { status: 500 });
  }
}

// GET route can be added later if needed to fetch feedbacks
