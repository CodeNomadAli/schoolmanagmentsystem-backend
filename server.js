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
import adminMiddleware from "./middleware/staff.middleware.js";
import adminRouter from "./routes/portal/admin.route.js";
import uploadRouter from "./routes/upload.routes.js";
import ModeratorRoute from "./routes/moderator.route.js";
import WriterRouter from "./routes/writer.route.js";
import writerMiddleware from './middleware/writer.middleware.js';
import ArticleRouter from "./routes/article.route.js";
import staffRoutes from "./routes/portal/staff.route.js";
import UserProfile from "./models/user_profile.model.js";
import staffAuth from "./middleware/staff.middleware.js";
const app = express();

const PORTAL_ROUTE_PREFIX = '/api/v1/portal';

dotenv.config(); 
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
},{
  origin: "http://localhost:5173", // Allow requests from this local origin
  credentials: true,
},{
  origin: "http://localhost:3000", // Allow requests from this local origin
  credentials: true,
}));

validateEnv(); // check all env variable is available
connectDB(); // connect to Database

// authentication routes
app.use("/api/v1/auth", authRouter);
// user routes
app.use(PORTAL_ROUTE_PREFIX+"/users", auth, userRouter);

// user profile routes
  app.use("/api/v1/user-profile", auth, UserProfile);
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



// staff routes
app.use(PORTAL_ROUTE_PREFIX+"/staff",staffAuth,staffRoutes)

// main();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

