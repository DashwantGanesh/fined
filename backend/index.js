import express from "express";
import dotenv from "dotenv";
dotenv.config(); // ✅ must be first
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import loanRoute from "./routes/loan.routes.js";
import bankRoute from "./routes/bank.routes.js";
import applicationRoute from "./routes/application.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000; // ✅ from .env

app.use(
  cors({
    origin: [
      "http://localhost:5173",            // local dev
      "https://fined.vercel.app",         // ✅ your vercel URL (update after deploy)
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/loan", loanRoute);
app.use("/api/v1/bank", bankRoute);
app.use("/api/v1/application", applicationRoute);

connectDB();

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});