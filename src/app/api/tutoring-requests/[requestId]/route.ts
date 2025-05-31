
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TutoringRequestModel from '@/models/TutoringRequest';
import { StudentModel, TutorModel } from '@/models/User';
import type { TutoringRequest } from '@/lib/types';

export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = params;
  if (!requestId) {
    return NextResponse.json({ message: 'Request ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const tutoringRequest = await TutoringRequestModel.findById(requestId)
      // Example of populating referenced User documents
      // .populate({ path: 'studentId', model: StudentModel, select: 'name email avatarUrl program level' })
      // .populate({ path: 'tutorId', model: TutorModel, select: 'name email avatarUrl teachableSubjects experience' })
      .lean();

    if (!tutoringRequest) {
      return NextResponse.json({ message: 'Tutoring request not found' }, { status: 404 });
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = tutoringRequest as any;
    const responseRequest = { ...rest, id: _id.toString() } as TutoringRequest;

    return NextResponse.json(responseRequest, { status: 200 });

  } catch (error) {
    console.error(`Error fetching tutoring request ${requestId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error fetching tutoring request', error: errorMessage }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: { requestId: string } }) {
  const { requestId } = params;
  if (!requestId) {
    return NextResponse.json({ message: 'Request ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    // Fields that can be updated: status, tutorId, tutorName, scheduledTime
    const { status, tutorId, tutorName, scheduledTime } = body;

    const updateData: Partial<TutoringRequest> = {};
    if (status) updateData.status = status;
    if (tutorId) updateData.tutorId = tutorId;
    if (tutorName) updateData.tutorName = tutorName;
    if (scheduledTime) updateData.scheduledTime = scheduledTime;
    
    const updatedRequest = await TutoringRequestModel.findByIdAndUpdate(
      requestId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedRequest) {
      return NextResponse.json({ message: 'Tutoring request not found or no changes made' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = updatedRequest as any;
    const responseRequest = { ...rest, id: _id.toString()} as TutoringRequest;
    
    return NextResponse.json(responseRequest, { status: 200 });

  } catch (error) {
    console.error(`Error updating tutoring request ${requestId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Server error updating tutoring request', error: errorMessage }, { status: 500 });
  }
}
