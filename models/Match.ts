import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMatch extends Document {
  _id: mongoose.Types.ObjectId;
  user1: mongoose.Types.ObjectId;
  user2: mongoose.Types.ObjectId;
  user1Swiped: boolean;
  user2Swiped: boolean;
  confirmed: boolean;
  stickersUser1ToUser2: string[];
  stickersUser2ToUser1: string[];
  tradeCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user1Swiped: { type: Boolean, default: false },
    user2Swiped: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    stickersUser1ToUser2: { type: [String], default: [] },
    stickersUser2ToUser1: { type: [String], default: [] },
    tradeCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MatchSchema.index({ user1: 1, user2: 1 }, { unique: true });
MatchSchema.index({ user1: 1 });
MatchSchema.index({ user2: 1 });

const Match: Model<IMatch> =
  mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);

export default Match;
