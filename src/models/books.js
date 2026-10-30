import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
  const db = getDb();
  const books = await db.collection("books").find({}).toArray();
  return books;
};

export { getAllBooks };
