import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
import remedyRouter from "./routes/remedy.route.js";
import validateEnv from "./validations/env.validation.js";
import userRouter from "./routes/user.route.js";
import userPortalRoute from "./routes/portal/user-portal.route.js";
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
import staffRolesRoutes from "./routes/portal/staff-role.route.js";
import staffPermissionRoutes from "./routes/portal/staff-permissions.route.js";
import remedyRoutes from "./routes/portal/remedy.route.js";
import remedyCategoryRoutes from "./routes/portal/remedyCategory.routes.js";
import remedyTypeRoutes from "./routes/portal/remedyType.routes.js";

const app = express();

const PORTAL_ROUTE_PREFIX = '/api/v1/portal';

dotenv.config();
app.use(express.json());

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"], // Allow requests from these origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], //
  credentials: true,
}));

validateEnv(); // check all env variable is available
connectDB(); // connect to Database

// authentication routes
app.use("/api/v1/auth", authRouter);
// user routes

app.use("/api/v1/users", auth, userRouter);


// user profile routes
app.use("/api/v1/user-profile", auth, UserProfile);
// review routes
app.use("/api/v1/review", reviewRouter);
// remedy routes
app.use("/api/v1/remedy", auth, remedyRouter);
// admin Routes
app.use("/api/v1/admin", auth, adminMiddleware, adminRouter);
// upload files (images,etc)
app.use("/api/v1/upload", auth, uploadRouter)
// moderator routes
app.use("/api/v1/moderator", auth, ModeratorRoute);
// writer routes
app.use("/api/v1/writer", auth, writerMiddleware, WriterRouter)
// articles route
app.use("/api/v1/articles", ArticleRouter)


// staff routes

app.use(PORTAL_ROUTE_PREFIX + "/staff", staffAuth, staffRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/staff-roles", staffAuth, staffRolesRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/staff-permissions", staffAuth, staffPermissionRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/users", staffAuth,userPortalRoute);

app.use(PORTAL_ROUTE_PREFIX + "/writer", staffAuth, WriterRouter)

app.use(PORTAL_ROUTE_PREFIX + "/remedy", remedyRoutes);

app.use(PORTAL_ROUTE_PREFIX + "/remedy-types", remedyTypeRoutes);
app.use(PORTAL_ROUTE_PREFIX + "/remedy-categories", remedyCategoryRoutes);

// main();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

