import express from 'express';
import { getProfile, uploadProfile, upload, getProfileById, editedUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Route to upload a profile
router.post('/signup', upload.single('profilePicture'), uploadProfile);

// Route to get all users
router.get('/all-users', getProfile);

// Route to get a single user
router.get('/:id', getProfileById);

// Route to update user profile
router.patch('/:id', upload.single('profilePicture'), editedUserProfile);

export default router;
