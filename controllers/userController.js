import User from '../models/users.js';
import path from 'path';
import multer from 'multer';

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
    const { name, email, whatsappNumber, altMobileNumber, address, zipCode, aadharNumber, date, profilePicture } = req.body;

    // If `profilePicture` is not a file, save the URL
    if (!profilePicture && !req.file) {
      return res.status(400).json({ message: 'No profile picture provided' });
    }

    const profilePicPath = req.file ? req.file.filename : profilePicture;

    const newUser = new User({ name, email, whatsappNumber, altMobileNumber, address, zipCode, aadharNumber, date, profilePicture: profilePicPath });
    await newUser.save();

    res.status(201).json({ message: 'Profile uploaded successfully', newUser });
  } catch (error) {
    console.error('Error uploading profile:', error);
    res.status(500).json({ message: 'Error uploading profile', error });
  }
};






// Controller to get all images
export const getProfile = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error });
  }
};



export const getProfileById = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    const user = await user.findById(userId); // Find user by ID in the database

    if (!user) {
      return res.status(404).json({ message: 'user not found' }); // If user is not found
    }

    res.status(200).json(user); // Send the user data if found
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user profile by ID
export const editedUserProfile = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  // Check if a new profile picture was uploaded
  if (req.file) {
    updatedData.profilePicture = req.file.filename; // Save file name to `profilePicture` field
  }

  try {
    const updateduser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json(updateduser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};
