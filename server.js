import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
import remedyRouter from "./routes/remedy.route.js";
import validateEnv from "./validations/env.validation.js";
import userRouter from "./routes/user.route.js";
import auth from "./middleware/auth.middleware.js";
import reviewRouter from './routes/review.route.js';
import adminMiddleware from "./middleware/admin.middleware.js";
import adminRouter from "./routes/admin.route.js";
import uploadRouter from "./routes/upload.routes.js";
import ModeratorRoute from "./routes/moderator.route.js";
import WriterRouter from "./routes/writer.route.js";
import writerMiddleware from './middleware/writer.middleware.js';
import ArticleRouter from "./routes/article.route.js";

const app = express();

dotenv.config(); // Load environment variables from .env file
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
validateEnv(); // check all env variable is available
connectDB(); // connect to Database

// authentication routes
app.use("/api/v1/auth", authRouter);
// user routes
app.use("/api/v1/user", auth, userRouter);
// review routes
app.use("/api/v1/review",reviewRouter);
// remedy routes
app.use("/api/v1/remedy", remedyRouter);
// admin Routes
app.use("/api/v1/admin",auth,adminMiddleware,adminRouter);
// upload files (images,etc)
app.use("/api/v1/upload",auth,uploadRouter)
// moderator routes
app.use("/api/v1/moderator",auth,ModeratorRoute);
// writer routes
app.use("/api/v1/writer",auth,writerMiddleware,WriterRouter)
// articles route
app.use("/api/v1/articles",ArticleRouter)

// main();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
