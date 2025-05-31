import mongoose, { Schema, model, models, Document } from 'mongoose';
import type { BaseUser, StudentUser, TutorUser, UserRole } from '@/lib/types';

interface IUser extends BaseUser, Document {
  // Mongoose specific fields like _id are handled by Document
}

interface IStudentUser extends StudentUser, IUser {}
interface ITutorUser extends TutorUser, IUser {}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], required: true },
  avatarUrl: { type: String },
}, { 
  timestamps: true,
  discriminatorKey: 'role' 
});

const StudentSchema = new Schema<IStudentUser>({
  program: { type: String, required: function(this: IStudentUser) { return this.role === 'student'; } },
  level: { type: String, required: function(this: IStudentUser) { return this.role === 'student'; } },
  difficultSubjects: { type: [String], default: [] },
});

const TutorSchema = new Schema<ITutorUser>({
  teachableSubjects: { type: [String], required: function(this: ITutorUser) { return this.role === 'tutor'; }, default: [] },
  experience: { type: String, required: function(this: ITutorUser) { return this.role === 'tutor'; } },
  availability: { type: String, required: function(this: ITutorUser) { return this.role === 'tutor'; } },
  bio: { type: String },
});

// Check if the model already exists before defining it
const UserModel = models.User || model<IUser>('User', UserSchema);

// Discriminators allow for different schemas based on the 'role' field
const StudentModel = UserModel.discriminators?.Student || UserModel.discriminator<IStudentUser>('student', StudentSchema);
const TutorModel = UserModel.discriminators?.Tutor || UserModel.discriminator<ITutorUser>('tutor', TutorSchema);


export { UserModel, StudentModel, TutorModel };
export type { IUser, IStudentUser, ITutorUser };
