import express from "express";
import cors from "cors";
import campaignRoutes from "./routes/campaign";
import userRoutes from "./routes/user";
import eventRouter from "./routes/event";
import messageRouter from "./routes/message";

import { sequelize } from "./models";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.use("/campaigns", campaignRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRouter);
app.use("/messages", messageRouter);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err: Error) => {
    console.error("Failed to start:", err);
    process.exit(1);
  });
