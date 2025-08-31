import { Router } from "express";
import Book from "../models/book.js";
import Borrow from "../models/borrow.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, async (req, res) => {
  const { bookId } = req.body;
  const book = await book.findById(bookId);
  if (!book || book.available <= 0) return res.status(400).json({ message: "No copies available" });

  book.available -= 1;
  await book.save();
  const rec = await Borrow.create({ userId: req.user.id, bookId: book._id });
  res.status(201).json(rec);
});

router.post("/return", verifyToken, async (req, res) => {
  const { borrowId } = req.body;
  const rec = await Borrow.findById(borrowId);
  if (!rec || rec.returnDate) return res.status(400).json({ message: "Invalid borrow record" });

  rec.returnDate = new Date();
  await rec.save();

  const book = await Book.findById(rec.bookId);
  if (book) { book.available += 1; await book.save(); }

  res.json(rec);
});

router.get("/", verifyToken, async (req, res) => {
  const filter = req.user.role === "librarian" ? {} : { userId: req.user.id };
  const records = await Borrow.find(filter).populate("userId", "name email").populate("bookId", "title author isbn");
  res.json(records);
});

export default router;
