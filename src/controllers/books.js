import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../models/books.js";
import { getAuthorById } from "../models/authors.js";

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    // Strict validation: check existence AND data types
    if (
      !id ||
      typeof id !== "string" ||
      !authorId ||
      typeof authorId !== "string" ||
      !title ||
      typeof title !== "string" ||
      !publicationDate ||
      typeof publicationDate !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields." });
    }

    const existingBook = await getBookById(id);
    if (existingBook)
      return res.status(400).json({ error: "Book id already exists." });

    const existingAuthor = await getAuthorById(authorId);
    if (!existingAuthor)
      return res
        .status(400)
        .json({ error: "authorId does not match an existing author." });

    const newBook = await createBook({ id, authorId, title, publicationDate });
    return res.status(201).json(newBook);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;

    // Strict validation: check existence AND data types
    if (
      !authorId ||
      typeof authorId !== "string" ||
      !title ||
      typeof title !== "string" ||
      !publicationDate ||
      typeof publicationDate !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields." });
    }

    const existingBook = await getBookById(id);
    if (!existingBook) return res.status(404).json({ error: "Book not found" });

    const existingAuthor = await getAuthorById(authorId);
    if (!existingAuthor)
      return res
        .status(400)
        .json({ error: "authorId does not match an existing author." });

    const updatedBook = await updateBook(id, {
      authorId,
      title,
      publicationDate,
    });
    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const existingBook = await getBookById(req.params.id);
    if (!existingBook) return res.status(404).json({ error: "Book not found" });

    await deleteBook(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
