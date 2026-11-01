import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import router from "./src/router.js";

const app = express();

app.use(express.json());

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Books API is running" });
});

export default app;
