import { Router } from "express";
import { body, validationResult } from "express-validator";
import Book from "../models/book.js";
import { verifyToken, checkRole } from "../middleware/auth.js";
import { listBooks } from "../controllers/bookController.js";

const router = Router();

// GET /books (public list for browsing/search)
router.get("/", listBooks);

// librarian-only CRUD
router.post("/",
  verifyToken, checkRole("librarian"),
  body("title").notEmpty(),
  body("author").notEmpty(),
  body("isbn").notEmpty(),
  body("quantity").isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, author, isbn, quantity } = req.body;
    const book = await Book.create({ title, author, isbn, quantity, available: quantity });
    res.status(201).json(book);
  }
);

router.put("/:id", verifyToken, checkRole("librarian"), async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

router.delete("/:id", verifyToken, checkRole("librarian"), async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
