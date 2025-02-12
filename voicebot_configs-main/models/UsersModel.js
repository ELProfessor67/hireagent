import mongoose from "mongoose";
const { Schema } = mongoose;

const PlanDetailsSchema = new Schema(
  {
    planId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    duration: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const UsersSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String, required: [true, "name is required "] },
    email: {
      type: String,
      required: [true, "email is required "],
      unique: true,
    },
    phoneNumber: { type: String },
    password: { type: String },
    role: { type: String, required: [true, "role is required "] },
    state: { type: String },
    city: { type: String },
    status: { type: Boolean },
    website: { type: String },
    address: { type: String },
    pincode: { type: String },
    profileImage: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "users" },
    projectId: { type: Schema.Types.ObjectId, ref: "projects" },
    selectedPlan: PlanDetailsSchema, // Embed plan details directly
  },
  { timestamps: true }
);

const users = mongoose.model("users", UsersSchema);

export default users;

// schema according to the json format of doc file

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const IdentitySchema = new Schema({
//   identity_id: { type: String, required: true },
//   id: { type: String, required: true },
//   user_id: { type: String, required: true },
//   identity_data: {
//     avatar_url: { type: String },
//     email: { type: String, required: true },
//     email_verified: { type: Boolean, required: true },
//     full_name: { type: String, required: true },
//     iss: { type: String },
//     name: { type: String, required: true },
//     phone_verified: { type: Boolean },
//     picture: { type: String },
//     provider_id: { type: String, required: true },
//     sub: { type: String }
//   },
//   provider: { type: String, required: true },
//   last_sign_in_at: { type: Date, required: true },
//   created_at: { type: Date, required: true },
//   updated_at: { type: Date, required: true },
//   email: { type: String, required: true }
// });

// const UserSchema = new Schema({
//   id: { type: String, required: true },
//   aud: { type: String, required: true },
//   role: { type: String, required: true },
//   email: { type: String, required: true },
//   email_confirmed_at: { type: Date },
//   phone: { type: String },
//   confirmed_at: { type: Date },
//   last_sign_in_at: { type: Date },
//   app_metadata: {
//     provider: { type: String },
//     providers: { type: [String] }
//   },
//   user_metadata: {
//     avatar_url: { type: String },
//     email: { type: String, required: true },
//     email_verified: { type: Boolean, required: true },
//     full_name: { type: String, required: true },
//     iss: { type: String },
//     name: { type: String, required: true },
//     phone_verified: { type: Boolean },
//     picture: { type: String },
//     provider_id: { type: String },
//     sub: { type: String }
//   },
//   identities: [IdentitySchema],
//   created_at: { type: Date, required: true },
//   updated_at: { type: Date, required: true },
//   is_anonymous: { type: Boolean, required: true }
// });

// const User = mongoose.model('User', UserSchema);

// export default User;