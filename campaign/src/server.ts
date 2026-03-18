import express from "express";
import campaignRoutes from "./routes/campaign";

const app = express();
app.use(express.json());

app.use("/campaigns", campaignRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
