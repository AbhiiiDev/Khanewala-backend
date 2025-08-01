import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose, { ConnectOptions } from "mongoose";
import UserRoute from "./routes/UserRoute";
import { v2 as cloudinary } from "cloudinary";
import PaymentRoute from "./routes/payment";
import Webhook from "./routes/webhook";
const app = express();

const allowedOrigins = ["http://localhost:5173", "https://khanewala.vercel.app"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.get("/test", (req, res) => {
  res.json({
    message: "test server working fine",
  });
});


// app.use("/api/payment", Webhook);

app.use(express.json({ limit: "50MB" }));
// app.use("/api/payment", PaymentRoute);
app.use("/user", UserRoute);

app.listen(8000, () => {
  console.log("server working fine on PORT: 8000");
});
