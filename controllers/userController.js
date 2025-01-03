import User from '../models/user.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and JPG formats are allowed'));
    }
    cb(null, true);
  },
});

export { upload };

// Controller to handle image upload
export const uploadProfile = async (req, res) => {
  try {
    const { name, email, whatsappNumber, altMobileNumber, address, zipCode, aadharNumber, date } = req.body;

    const profilePicPath = req.file ? req.file.filename : null;

    const newUser = new User({ name, email, whatsappNumber, altMobileNumber, address, zipCode, aadharNumber, date, profilePicture: profilePicPath });
    await newUser.save();

    res.status(201).json({ message: 'Profile uploaded successfully', newUser });
  } catch (error) {
    console.error('Error uploading profile:', error);
    res.status(500).json({ message: 'Error uploading profile', error });
  }
};

// Controller to get all users
export const getProfile = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Controller to get user by ID
export const getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to update a user profile by ID
export const editedUserProfile = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  if (req.file) {
    updatedData.profilePicture = req.file.filename;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};
