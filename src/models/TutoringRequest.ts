import mongoose, { Schema, model, models, Document } from 'mongoose';
import type { TutoringRequest as TutoringRequestType } from '@/lib/types';

export interface ITutoringRequest extends TutoringRequestType, Document {}

const TutoringRequestSchema = new Schema<ITutoringRequest>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, required: true },
  description: { type: String, required: true },
  studentAvailability: { type: String, required: true },
  status: { type: String, enum: ['pending', 'matched', 'active', 'completed', 'cancelled'], required: true, default: 'pending' },
  tutorId: { type: Schema.Types.ObjectId, ref: 'User' },
  tutorName: { type: String },
  scheduledTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const TutoringRequestModel = models.TutoringRequest || model<ITutoringRequest>('TutoringRequest', TutoringRequestSchema);

export default TutoringRequestModel;
