
import { Request, Response, NextFunction } from "express";
import Bookmark from "../models/Bookmark";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";

const addBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, question_number, questionText } = req.body;
    const userId = req.userId;

    const existing = await Bookmark.findOne({ userId, quizId, question_number });
    if (existing) {
      const err = new ProjectError("Question already bookmarked");
      err.statusCode = 400;
      throw err;
    }

    const bookmark = new Bookmark({ userId, quizId, question_number, questionText });
    await bookmark.save();

    const resp: ReturnResponse = {
      status: "success",
      message: "Bookmark added",
      data: bookmark
    };
    res.status(201).send(resp);
  } catch (error) {
    next(error);
  }
};

const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quizId, question_number } = req.body;
    const userId = req.userId;

    const deleted = await Bookmark.findOneAndDelete({ userId, quizId, question_number });
    if (!deleted) {
      const err = new ProjectError("Bookmark not found");
      err.statusCode = 404;
      throw err;
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "Bookmark removed",
      data: deleted
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const listBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { quizId } = req.params;

    const bookmarks = await Bookmark.find({ userId, quizId });

    const resp: ReturnResponse = {
      status: "success",
      message: "Bookmarks fetched",
      data: bookmarks
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

export { addBookmark, removeBookmark, listBookmarks };
