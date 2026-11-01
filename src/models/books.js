import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
  const db = getDb();
  return await db.collection("books").find({}).toArray();
};

const getBookById = async (id) => {
  const db = getDb();
  return await db.collection("books").findOne({ id });
};

const createBook = async (book) => {
  const db = getDb();
  await db.collection("books").insertOne(book);
  return book;
};

const updateBook = async (id, book) => {
  const db = getDb();
  await db.collection("books").updateOne({ id }, { $set: book });
  return { id, ...book };
};

const deleteBook = async (id) => {
  const db = getDb();
  return await db.collection("books").deleteOne({ id });
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
