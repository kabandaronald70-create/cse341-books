import { getAllBooks, getBookById } from "../models/books.js";

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error("Failed to retrieve books:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// New controller for Issue 3
const getBookByIdHandler = async (req, res) => {
  try {
    const requestedId = req.params.id;
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error("Failed to retrieve book:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getBooksHandler, getBookByIdHandler };
