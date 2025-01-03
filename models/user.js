import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    whatsappNumber: { type: String, required: true, maxlength: 10 },
    altMobileNumber: { type: String, required: true, maxlength: 10 },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    aadharNumber: { type: String, required: true, unique: true, maxlength: 12 },
    date: { type: String, required: true },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
