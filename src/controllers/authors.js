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
    const { id, name, birthYear } = req.body;

    // Strict validation: check existence AND data types
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
    if (birthYear <= 0) {
      return res
        .status(400)
        .json({ error: "birthYear must be a positive number." });
    }

    // Duplicate check
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(400).json({ error: "Author id already exists." });
    }

    const createdAuthor = await createAuthorFromDb({ id, name, birthYear });
    return res.status(201).json(createdAuthor);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create author." });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthYear } = req.body;

    // Strict validation: check existence AND data types
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
    if (birthYear <= 0) {
      return res
        .status(400)
        .json({ error: "birthYear must be a positive number." });
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

    // Relationship check
    if (await authorHasBooks(id)) {
      return res.status(409).json({
        error: "Author cannot be deleted because they still have books.",
      });
    }

    await deleteAuthorFromDb(id);
    return res.status(204).send(); // 204 No Content
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
