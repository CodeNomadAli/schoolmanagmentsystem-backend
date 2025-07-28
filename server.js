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

import adminMiddleware from "./middleware/staff.middleware.js";
import adminRouter from "./routes/portal/admin.route.js";
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
import Aliments from "./routes/portal/ailment.route.js"
import privacyRouter from "./routes/portal/Web-Policy.route.js";
import UploadFile from "./routes/file.routes.js";
import WebHookRoute  from "./routes/portal/webhook.route.js"
import Subcription from "./routes/portal/subscription.routes.js"
import Card from "./routes/card.route.js"
import planRoutes from "./routes/plan.route.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import profileQuestions from "./routes/profile-questions.route.js"
const app = express();

const PORTAL_ROUTE_PREFIX = '/api/v1/portal';

dotenv.config();
app.use(express.json());

app.use(cors({
  origin: [ process.env.FRONTEND_URL, "https://admin.thenaturalsociety.com", "http://localhost:5173", "http://localhost:3000" ], // Allow requests from these origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], //
  credentials: true,
}));

validateEnv(); 
connectDB(); 


app.use("/api/v1/auth", authRouter);


app.use("/api/v1/users", auth, userRouter);

app.use("/api/v1/plan", auth, Subcription);

app.use("/api/v1/user-plan", auth, planRoutes);

app.use("/api/v1/stripe", WebHookRoute);

app.use("/api/v1/card", Card);

app.use("/api/v1/invoice", invoiceRoutes);

app.use("/api/v1/user", profileQuestions);





app.use("/api/v1/user",auth,userPorfileRoute);
// remedy routes
app.use("/api/v1/remedy", auth, remedyRouter);
// admin Routes
app.use("/api/v1/admin", auth, adminMiddleware, adminRouter);
// upload files (images,etc)
// moderator routes
app.use("/api/v1/moderator", auth, ModeratorRoute);
// writer routes

// articles route
app.use("/api/v1/articles", ArticleRoute)


// staff routes



app.use(PORTAL_ROUTE_PREFIX + "/staff", staffAuth, staffRoutes)


app.use(PORTAL_ROUTE_PREFIX + "/files", staffAuth, UploadFile)

app.use(PORTAL_ROUTE_PREFIX + "/ailments", staffAuth, Aliments)

app.use(PORTAL_ROUTE_PREFIX + "/web-policy", staffAuth, privacyRouter)

app.use(PORTAL_ROUTE_PREFIX + "/staff-roles", staffAuth, staffRolesRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/staff-permissions", staffAuth, staffPermissionRoutes)

app.use(PORTAL_ROUTE_PREFIX + "/users", staffAuth,userPortalRoute);
 
app.use(PORTAL_ROUTE_PREFIX + "/article-categories", staffAuth,ArticleCategoryRouter)

app.use(PORTAL_ROUTE_PREFIX + "/articles", staffAuth,ArticleRouter)

app.use(PORTAL_ROUTE_PREFIX + "/remedy", remedyRoutes);

app.use(PORTAL_ROUTE_PREFIX + "/remedy-types", remedyTypeRoutes);
app.use(PORTAL_ROUTE_PREFIX + "/remedy-categories", remedyCategoryRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

