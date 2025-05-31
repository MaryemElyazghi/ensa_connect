
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TutoringRequestModel from '@/models/TutoringRequest';
import { StudentModel, TutorModel } from '@/models/User'; // To potentially populate student/tutor info
import type { TutoringRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { studentId, studentName, subject, level, description, studentAvailability } = body;

    if (!studentId || !studentName || !subject || !level || !description || !studentAvailability) {
      return NextResponse.json({ message: 'Missing required fields for tutoring request' }, { status: 400 });
    }

    const newRequest = new TutoringRequestModel({
      studentId,
      studentName,
      subject,
      level,
      description,
      studentAvailability,
      status: 'pending',
    });

    const savedRequest = await newRequest.save();
    const responseRequest = {
        ...savedRequest.toObject(),
        id: savedRequest._id.toString(),
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...result } = responseRequest;


    return NextResponse.json(result as TutoringRequest, { status: 201 });

  } catch (error) {
    console.error('Tutoring request creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error during tutoring request creation', error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const tutorId = searchParams.get('tutorId');
    const status = searchParams.get('status');

    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (tutorId) query.tutorId = tutorId;
    if (status) query.status = status;
    
    // Populate student and tutor details
    // .populate({ path: 'studentId', model: StudentModel, select: 'name email avatarUrl program level' })
    // .populate({ path: 'tutorId', model: TutorModel, select: 'name email avatarUrl teachableSubjects experience' })
    // For simplicity now, not populating fully, relying on stored names. Can be expanded.
    const requests = await TutoringRequestModel.find(query).sort({ createdAt: -1 }).lean();

    const formattedRequests = requests.map(req => {
      const { _id, __v, ...rest } = req as any;
      return { ...rest, id: _id.toString() } as TutoringRequest;
    });
    
    return NextResponse.json(formattedRequests, { status: 200 });

  } catch (error) {
    console.error('Error fetching tutoring requests:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error fetching tutoring requests', error: errorMessage }, { status: 500 });
  }
}
