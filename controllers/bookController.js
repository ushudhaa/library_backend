import { validationResult } from "express-validator";
import Book from "../models/book.js";

// GET /books → list or search
export const listBooks = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const filter = q
      ? { $or: [{ title: new RegExp(q, "i") }, { author: new RegExp(q, "i") }] }
      : {};
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch books", error: error.message });
  }
};

// POST /books → librarian only
export const addBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { title, author, isbn, quantity } = req.body;
    const book = await Book.create({
      title,
      author,
      isbn,
      quantity,
      available: quantity,
    });

    res.status(201).json({ success: true, message: "Book added", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add book", error: error.message });
  }
};

// PUT /books/:id → librarian only
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    res.json({ success: true, message: "Book updated", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update book", error: error.message });
  }
};

// DELETE /books/:id → librarian only
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete book", error: error.message });
  }
};
