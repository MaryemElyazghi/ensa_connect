import mongoose, { Schema, model, models, Document } from 'mongoose';
import type { SessionFeedback as SessionFeedbackType } from '@/lib/types';

export interface ISessionFeedback extends SessionFeedbackType, Document {}

const SessionFeedbackSchema = new Schema<ISessionFeedback>({
  requestId: { type: Schema.Types.ObjectId, ref: 'TutoringRequest', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tutorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  studentComments: { type: String },
  tutorComments: { type: String },
  topicsCovered: { type: String, required: true },
  sessionDate: { type: Date, required: true, default: Date.now },
  durationMinutes: { type: Number },
}, { timestamps: true });

const SessionFeedbackModel = models.SessionFeedback || model<ISessionFeedback>('SessionFeedback', SessionFeedbackSchema);

export default SessionFeedbackModel;
