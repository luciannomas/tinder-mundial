import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  city?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  stickersHave: string[];    // codes of repeated stickers to trade
  stickersNeed: string[];    // codes of missing stickers
  stickersPasted: string[];  // codes of stickers already in album
  swipedRight: mongoose.Types.ObjectId[];
  swipedLeft: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    image: { type: String, default: "" },
    city: { type: String, default: "" },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    stickersHave: { type: [String], default: [] },
    stickersNeed: { type: [String], default: [] },
    stickersPasted: { type: [String], default: [] },
    swipedRight: [{ type: Schema.Types.ObjectId, ref: "User" }],
    swipedLeft: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
