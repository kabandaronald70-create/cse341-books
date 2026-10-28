import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error(
    "PORT is not set. Make sure the .env file is being loaded (--env-file=.env).",
  );
}

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
