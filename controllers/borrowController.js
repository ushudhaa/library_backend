import Book from "../models/book.js";
import Borrow from "../models/Borrow.js";

// POST /borrow → borrower borrows book
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);

    if (!book || book.available <= 0) {
      return res.status(400).json({ success: false, message: "No copies available" });
    }

    book.available -= 1;
    await book.save();

    const record = await Borrow.create({
      userId: req.user.id,
      bookId: book._id,
    });

    res.status(201).json({ success: true, message: "Book borrowed", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Borrow failed", error: error.message });
  }
};

// POST /borrow/return → borrower returns book
export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;
    const record = await Borrow.findById(borrowId);

    if (!record || record.returnDate) {
      return res.status(400).json({ success: false, message: "Invalid borrow record" });
    }

    record.returnDate = new Date();
    await record.save();

    const book = await Book.findById(record.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.json({ success: true, message: "Book returned", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Return failed", error: error.message });
  }
};

// GET /borrow → view records (borrower sees own, librarian sees all)
export const listBorrowRecords = async (req, res) => {
  try {
    const filter = req.user.role === "librarian" ? {} : { userId: req.user.id };
    const records = await Borrow.find(filter)
      .populate("userId", "name email role")
      .populate("bookId", "title author isbn");

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch borrow records", error: error.message });
  }
};
