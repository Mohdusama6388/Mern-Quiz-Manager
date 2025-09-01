// import express from "express";
// import { addBookmark, removeBookmark, listBookmarks } from "../controllers/Bookmark";
// import {isAuthenticated} from '../middlewares/isAuth'

// const router = express.Router();

// router.post("/",isAuthenticated, addBookmark);

// router.delete("/",isAuthenticated, removeBookmark);


// router.get("/:quizId",isAuthenticated, listBookmarks);

// export default router;
import express from "express";
import { addBookmark, removeBookmark, listBookmarks } from "../controllers/Bookmark";
import { isAuthenticated } from "../middlewares/isAuth";

const router = express.Router();

// Add bookmark
router.post("/", isAuthenticated, addBookmark);

// Remove bookmark
router.delete("/", isAuthenticated, removeBookmark);

// List all bookmarks of a quiz
router.get("/:quizId", isAuthenticated, listBookmarks);

export default router;
