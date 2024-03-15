import mongoose, { Schema, Document, Model } from "mongoose";

interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  phone: number;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: { type: String, required: true },
  phone: { type: Number, required: true, module, maxLen: 12 },
});

export const Users: Model<UserDoc> =
  mongoose.models.Users || mongoose.model("Users", UserSchema); //this means if Users model already exists then it'll will not recreate
