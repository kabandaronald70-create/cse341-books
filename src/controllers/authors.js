import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorFromDb,
  updateAuthor as updateAuthorFromDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks,
} from "../models/authors.js";

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ error: "Unable to retrieve authors." });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorByIdFromDb(id);
    if (!author) {
      return res.status(404).json({ error: "Author not found." });
    }
    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ error: "Unable to retrieve author." });
  }
};

const createAuthor = async (req, res) => {
  try {
    // Ultimate check for missing or empty body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is required." });
    }

    const { id, name, birthYear } = req.body;

    // Strict validation
    if (
      !id ||
      typeof id !== "string" ||
      !name ||
      typeof name !== "string" ||
      birthYear === undefined ||
      typeof birthYear !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields." });
    }

    if (name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty." });
    }

    if (!Number.isInteger(birthYear) || birthYear <= 0) {
      return res
        .status(400)
        .json({ error: "birthYear must be a positive integer." });
    }

    // Duplicate check
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(400).json({ error: "Author id already exists." });
    }

    try {
      const createdAuthor = await createAuthorFromDb({ id, name, birthYear });
      return res.status(201).json(createdAuthor);
    } catch (dbError) {
      if (dbError.code === 11000) {
        return res.status(400).json({ error: "Author id already exists." });
      }
      throw dbError;
    }
  } catch (error) {
    return res.status(500).json({ error: "Unable to create author." });
  }
};

const updateAuthor = async (req, res) => {
  try {
    // Ultimate check for missing or empty body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is required." });
    }

    const { id } = req.params;
    const { name, birthYear } = req.body;

    // Strict validation
    if (
      !name ||
      typeof name !== "string" ||
      birthYear === undefined ||
      typeof birthYear !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields." });
    }

    if (name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty." });
    }

    if (!Number.isInteger(birthYear) || birthYear <= 0) {
      return res
        .status(400)
        .json({ error: "birthYear must be a positive integer." });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ error: "Author not found." });
    }

    const updatedAuthor = await updateAuthorFromDb(id, { name, birthYear });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return res.status(500).json({ error: "Unable to update author." });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ error: "Author not found." });
    }

    if (await authorHasBooks(id)) {
      return res
        .status(409)
        .json({
          error: "Author cannot be deleted because they still have books.",
        });
    }

    await deleteAuthorFromDb(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Unable to delete author." });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
