import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
// import portalAuthRouter from "./routes/portal/auth.route.js";
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
import ArticleRoute from "./routes/article.route.js";
import staffRoutes from "./routes/portal/staff.route.js";
import userPorfileRoute from "./routes/userProfile.route.js";
import staffAuth from "./middleware/staff.middleware.js";
import staffRolesRoutes from "./routes/portal/staff-role.route.js";
import staffPermissionRoutes from "./routes/portal/staff-permissions.route.js";
import remedyRoutes from "./routes/portal/remedy.route.js";
import remedyCategoryRoutes from "./routes/portal/remedy-category.routes.js";
import remedyTypeRoutes from "./routes/portal/remedy-type.routes.js";
import ArticleRouter from "./routes/portal/article.route.js";
import ArticleCategoryRouter from "./routes/portal/article-category.routes.js";
import freeUserRoutes from "./routes/user-client/free-user.route.js";
import Aliments from "./routes/portal/ailment.route.js"
import privacyRouter from "./routes/portal/Web-Policy.route.js";
const app = express();

const PORTAL_ROUTE_PREFIX = '/api/v1/portal';

dotenv.config();
app.use(express.json());

app.use(cors({
  origin: [ process.env.FRONTEND_URL, "https://admin.thenaturalsociety.com", "http://localhost:5173", "http://localhost:3000" ], // Allow requests from these origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], //
  credentials: true,
}));

validateEnv(); // check all env variable is available
connectDB(); // connect to Database


app.use("/api/v1/auth", authRouter);

// user routes
app.use("/api/v1/users", auth, userRouter);


// user profile routes
app.use("/api/v1/freeuser",freeUserRoutes);

app.use("/api/v1/user",auth,userPorfileRoute);
// remedy routes
app.use("/api/v1/remedy", auth, remedyRouter);
// admin Routes
app.use("/api/v1/admin", auth, adminMiddleware, adminRouter);
// upload files (images,etc)
app.use("/api/v1/upload", auth, uploadRouter)
// moderator routes
app.use("/api/v1/moderator", auth, ModeratorRoute);
// writer routes

// articles route
app.use("/api/v1/articles", ArticleRoute)


// staff routes

app.use(PORTAL_ROUTE_PREFIX + "/staff", staffAuth, staffRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/ailments", staffAuth,Aliments)

app.use(PORTAL_ROUTE_PREFIX + "/privacy-policy", staffAuth,privacyRouter)

app.use(PORTAL_ROUTE_PREFIX + "/staff-roles", staffAuth, staffRolesRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/staff-permissions", staffAuth, staffPermissionRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/users", staffAuth,userPortalRoute);

 
app.use(PORTAL_ROUTE_PREFIX + "/article-categories", staffAuth,ArticleCategoryRouter)

app.use(PORTAL_ROUTE_PREFIX + "/articles", staffAuth,ArticleRouter)

app.use(PORTAL_ROUTE_PREFIX + "/remedy", remedyRoutes);

app.use(PORTAL_ROUTE_PREFIX + "/remedy-types", remedyTypeRoutes);
app.use(PORTAL_ROUTE_PREFIX + "/remedy-categories", remedyCategoryRoutes);

// main();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

