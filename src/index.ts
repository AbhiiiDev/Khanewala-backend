import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose, { ConnectOptions } from "mongoose";
import UserRoute from "./routes/UserRoute";
import RestaurantRoute from "./routes/RestaurantRoute";
import { v2 as cloudinary } from "cloudinary";
import RestaurantSearchRoute from "./routes/RestaurantSearchRoute";
import PaymentRoute from "./routes/payment";
import Webhook from "./routes/webhook";
import Order from "./routes/OrderRoute";
const app = express();

const allowedOrigins = ["http://localhost:5173", "https://khane-wala.vercel.app"];
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

app.use("/api/v1/restaurant", RestaurantRoute);

app.use("/api/payment", Webhook);

app.use(express.json({ limit: "50MB" }));
app.use("/api/payment", PaymentRoute);
app.use("/api/v1/user", UserRoute);
app.use("/api/restaurant", RestaurantSearchRoute);
app.use('/api/order',Order);

app.listen(8000, () => {
  console.log("server working fine on PORT: 8000");
});
