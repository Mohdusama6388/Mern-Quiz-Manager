
import express from "express";
import {  getUser, updateUser,} from '../controllers/user';
import {isAuthenticated} from '../middlewares/isAuth'
const router = express.Router();

// Register a new user

router.get('/:userId',isAuthenticated, getUser);

// Update a user by ID
router.put('/',isAuthenticated, updateUser);

export default router;
