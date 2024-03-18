import mongoose, { Document, Model, Schema } from "mongoose";

interface UserAccount extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
}

const AccountSchema = new Schema<UserAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users", // this makes sure that for every AccountSchema there should be a corresponding UserAccount exists
    required: true,
  },
  balance: { type: Number, default: 0, required: true },
});

export const Account: Model<UserAccount> =
  mongoose.models.Account ||
  mongoose.model<UserAccount>("Account", AccountSchema);
